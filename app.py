from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from database import search_medicines, get_medicine_by_id, check_interaction, get_categories

app = Flask(__name__)
CORS(app)

# ── Serve frontend ──────────────────────────────────────
@app.route("/")
def index():
    return render_template("index.html")

# ── ROUTE 1: Search medicines ───────────────────────────
@app.route("/api/search")
def search():
    query    = request.args.get("q",        "").strip()
    category = request.args.get("category", "").strip()
    rx       = request.args.get("rx",       "").strip()
    page     = int(request.args.get("page",     1))
    per_page = int(request.args.get("per_page", 10))
    per_page = min(per_page, 50)
    page     = max(page, 1)
    data = search_medicines(query, category, rx, page, per_page)
    return jsonify(data)

# ── ROUTE 2: Single medicine detail ────────────────────
@app.route("/api/medicine/<int:medicine_id>")
def medicine_detail(medicine_id):
    med = get_medicine_by_id(medicine_id)
    if not med:
        return jsonify({"error": "Medicine not found"}), 404
    return jsonify(med)

# ── ROUTE 3: Interaction check ──────────────────────────
@app.route("/api/interaction")
def interaction():
    drug1 = request.args.get("drug1", "").strip()
    drug2 = request.args.get("drug2", "").strip()
    if not drug1 or not drug2:
        return jsonify({"error": "Both drug1 and drug2 required"}), 400
    result = check_interaction(drug1, drug2)
    if result:
        return jsonify({"found": True,  "interaction": result})
    else:
        return jsonify({"found": False, "interaction": None})

# ── ROUTE 4: Categories ─────────────────────────────────
@app.route("/api/categories")
def categories():
    return jsonify(get_categories())

# ── ROUTE 5: Suggest (for interaction dropdowns) ────────
@app.route("/api/suggest")
def suggest():
    query = request.args.get("q", "").strip()
    if not query:
        return jsonify([])
    data  = search_medicines(query=query, page=1, per_page=5)
    names = [{"id": r["id"], "generic_name": r["generic_name"],
              "brands": r["brands"]} for r in data["results"]]
    return jsonify(names)

if __name__ == "__main__":
    app.run(debug=True, port=5000)