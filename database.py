# backend
import sqlite3
import os
from rapidfuzz import process, fuzz

DB_PATH = os.path.join(os.path.dirname(__file__), "aushadhi_v2.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row   # lets you access columns by name: row["generic_name"]
    return conn


def search_medicines(query="", category="", rx_filter="", page=1, per_page=10):
    conn = get_connection()
    cur  = conn.cursor()

    offset = (page - 1) * per_page

    # Build WHERE clause dynamically
    conditions = []
    params     = []

    # ── Layer 1: FTS5 search (handles brand names + partials) ──
    if query.strip():
        conditions.append("""
            m.id IN (
                SELECT rowid FROM medicines_fts
                WHERE medicines_fts MATCH ?
            )
        """)
        params.append(query.strip() + "*")   # * = prefix match

    # ── Layer 2: category filter ──
    if category.strip():
        conditions.append("m.category = ?")
        params.append(category.strip())

    # ── Layer 3: rx filter ──
    if rx_filter == "otc":
        conditions.append("m.prescription_required = 0")
    elif rx_filter == "rx":
        conditions.append("m.prescription_required = 1")

    where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

    # ── Count total (for pagination) ──
    cur.execute(f"SELECT COUNT(*) FROM medicines m {where}", params)
    total = cur.fetchone()[0]

    # ── Fetch page slice ──
    cur.execute(f"""
        SELECT
            m.id,
            m.generic_name,
            m.brands,
            m.category,
            m.prescription_required,
            m.uses,
            m.dosage,
            m.side_effects,
            m.precautions,
            m.contraindications,
            m.mechanism,
            m.severity,
            m.drug_class
        FROM medicines m
        {where}
        ORDER BY m.generic_name
        LIMIT ? OFFSET ?
    """, params + [per_page, offset])

    rows = cur.fetchall()

    # ── NORMAL RESULTS ──
    results = [dict(r) for r in rows]

    # ── FUZZY FALLBACK (only if no results AND query exists) ──
    suggestion = None

    if query.strip() and not results:
        # get ALL medicine names
        cur.execute("SELECT generic_name, brands FROM medicines")

        all_choices = []
        mapping = {}

        for row in cur.fetchall():
            g = row["generic_name"]

            # add generic name
            all_choices.append(g)
            mapping[g] = g

            # add brands
            if row["brands"]:
                for b in row["brands"].split(","):
                    b = b.strip()
                    if b:
                        all_choices.append(b)
                        mapping[b] = g   # map brand → generic
        matches = process.extract(
            query,
            all_choices,
            scorer=fuzz.WRatio,
            limit=5
        )

        best_generics = []

        for m in matches:
            if m[1] > 60:
                generic = mapping[m[0]]
                if generic not in best_generics:
                    best_generics.append(generic)

        if best_generics:
            suggestion = best_generics[0]

            # fetch those medicines properly
            placeholders = ",".join(["?"] * len(best_generics))
            cur.execute(f"""
                SELECT *
                FROM medicines
                WHERE generic_name IN ({placeholders})
            """, best_generics)

            fuzzy_rows = cur.fetchall()
            results = [dict(r) for r in fuzzy_rows]

            total = len(results)

    conn.close()

    return {
        "results":      results,
        "total":        total,
        "page":         page,
        "per_page":     per_page,
        "total_pages":  max(1, -(-total // per_page)),
        "suggestion":   suggestion
    }
def get_medicine_by_id(medicine_id):
    conn = get_connection()
    cur  = conn.cursor()
    cur.execute("SELECT * FROM medicines WHERE id = ?", [medicine_id])
    row = cur.fetchone()
    conn.close()
    return dict(row) if row else None


def check_interaction(drug1, drug2):
    conn = get_connection()
    cur  = conn.cursor()

    # Check both directions (Warfarin+Ibuprofen = Ibuprofen+Warfarin)
    cur.execute("""
        SELECT * FROM interactions
        WHERE (LOWER(drug1) = LOWER(?) AND LOWER(drug2) = LOWER(?))
           OR (LOWER(drug1) = LOWER(?) AND LOWER(drug2) = LOWER(?))
    """, [drug1, drug2, drug2, drug1])

    row = cur.fetchone()
    conn.close()
    return dict(row) if row else None


def get_categories():
    conn = get_connection()
    cur  = conn.cursor()
    cur.execute("""
        SELECT DISTINCT category
        FROM medicines
        WHERE category IS NOT NULL
        ORDER BY category
    """)
    rows = cur.fetchall()
    conn.close()
    return [r["category"] for r in rows]