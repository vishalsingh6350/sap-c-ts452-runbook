# TASK 6 — CONTRACT PROCESSING (VALUE CONTRACT)

> **Time box: 30 min** · **Steps: 4** · **Risk: MEDIUM** · **No customizing**
> The exam explicitly says: **"Ignore any warning messages."** Only red errors matter here.

**Scenario:** a value contract for two material groups (warning signs, electrical spare parts),
one release order with three different item types, then a goods receipt through blocked stock →
quality inspection → unrestricted.

**Everything uses plant `1010`, purchasing org `101C`, document type `NB` for the release order.**

---

## THE TWO ITEM CATEGORIES — understand this before you start

This task is really a test of whether you know which contract item category to use.

| Contract item | Situation | **Item category** | Why |
|---|---|---|---|
| **10** — warning signs | *many different signs, but all cost the same 5,00* | **`M`** — Material unknown | `M` = no material master, but **one fixed price and one unit**. Exactly the described case. |
| **20** — electrical spare parts | *different prices AND different order units* | **`W`** — Material group | `W` = no material, **no price, no quantity** — only the material group and a value. Required when prices/units vary. |

> The exam says "Choose the correct item category" twice without naming it. That is the graded
> decision. `M` for item 10, `W` for item 20.

---

## STEP 1 — Create the value contract

**`ME31K`** — *Create Contract*

### Initial screen

| Field | Value |
|---|---|
| Vendor | **`S520-3##`** |
| **Agreement Type** | **`WK`** (value contract) |
| Agreement date | today |
| Purchasing Org | `101C` |
| Purchasing Group | `Z##` |
| Plant | `1010` |

> ⚠️ `WK` = value contract (target **value**). `MK` = quantity contract — that is Task 7, not this one.

### Header data

| Field | Value |
|---|---|
| **Valid from** | **1st day of the CURRENT month** (e.g. 01.09.2026) |
| **Valid to** | valid-from **+ 1 year − 1 day** (e.g. 31.08.2027) |
| **Target Value** | **`100000,00`** |
| Currency | `EUR` |

> ⚑ **JUDGMENT CALL — the end date.** "valid for one year from the first of the actual month."
> **Recommendation: 31.08.2027** for a 01.09.2026 start — exactly one year, no overlap.
> (Using 01.09.2027 gives a year and a day; 31.08 is the cleaner reading and the usual SAP answer.)
> ⚠️ **`100.000,--` = `100000,00`.**

### Header condition — the 10 % release-order discount

**Header → Conditions** (menu *Header → Conditions*, or the Conditions button):

| Condition type | Value |
|---|---|
| **`RA01`** — Discount % on gross | `10` (%) |

*If `RA01` is not available in the header condition list, use **`RA00`** (Discount % on net) — the
requirement is a 10 % percentage discount that applies to every release order.*

> ⚠️ It must be a **header** condition so it flows into every release order. An item-level
> discount only covers that one item.

### Item 10 — warning signs

| Field | Value |
|---|---|
| **Item category** | **`M`** |
| Material | *(leave blank)* |
| Short text | `Warning signs GR##` |
| **Material group** | **`WS##`** |
| Target quantity | e.g. `1000` *(enter a round number if the field is mandatory)* |
| Order unit | `PC` |
| **Net price** | **`5,00`** |
| Plant | `1010` |

Then: **item detail → tab `Delivery`** *(if not there, check the `Material Data` tab)*

| Field | Value |
|---|---|
| **Planned Deliv. Time** | **`10`** |

### Item 20 — electrical spare parts

| Field | Value |
|---|---|
| **Item category** | **`W`** |
| Material | *(blank)* |
| Short text | `Electrical spare parts GR##` |
| **Material group** | **`ET##`** |
| Quantity / price | *(leave empty — `W` does not take them)* |
| Plant | `1010` |

Item detail → **Planned Deliv. Time = `5`**

**Save.** → **Log the contract number.** You need it in step 2.

> ⚠️ Item numbers must end up as **10** and **20** — the release order in step 2 refers to them by
> number. The default increment is 10, so do not renumber.
> ⚠️ If item category `W` refuses a price or quantity, that is correct behaviour — leave them empty.
> ⚠️ Ignore warnings about missing info records, target values, dates. The exam says so.

**✅ Done when:** `ME33K` shows type WK, target value 100000, RA01 10 % at header, item 10 = M /
WS## / 5,00 / 10 days, item 20 = W / ET## / 5 days.

---

## STEP 2 — Contract release order (a PO referencing the contract)

**`ME21N`**

| Field | Value |
|---|---|
| Document type | **`NB`** |
| Supplier | `S520-3##` |
| Purchasing Org | `101C` |
| Purchasing Group | `Z##` |
| Plant | `1010` |

### How to reference the contract

**Document Overview On** → selection variant **Outline Agreements** (or *My contracts*) → enter
your contract number → **Execute** → expand → **drag the contract item** into the PO for each line.

*Alternative:* enter the item manually, then in **item detail → tab `Material Data`** fill
**Outline Agreement** = contract number and **Agreement Item** = 10 or 20.

### The three items

| | Item 10 | Item 20 | Item 30 |
|---|---|---|---|
| Refers to contract item | **10** | **10** | **20** |
| Material | **`B520-5##`** | *(none — free text)* | *(none — free text)* |
| Short text | *(from material)* | **`Wear safety shoes`** | `Electric fuses 100A` |
| Quantity | **`200`** PC | **`50`** PC | **`50`** |
| **Order unit** | PC | PC | **`PAC`** |
| Material group | (from material, `WS##`) | `WS##` | `ET##` |
| Net price | from contract (5,00) | from contract (5,00) | **`99,90`** |
| Acct assignment cat. | *(blank = stock)* | **`K`** | **`K`** |
| Cost center | — | **`T-ENG##`** | **`T-ENG##`** |
| Plant | `1010` | `1010` | `1010` |

**Save.** → **Log the PO number.**

> ⚠️ **Item 10 must stay a stock item** (no account assignment). Step 3 posts it into GR blocked
> stock and quality inspection stock — you cannot do that with a cost-center item.
> ⚠️ **Item 30 order unit is `PAC`**, not PC. The exam says "50 PAC".
> ⚠️ The 10 % header discount from the contract should appear in the item conditions. Check one
> item's Conditions tab — if there is no RA01/RA00 line, the reference to the contract did not
> take. Re-do that item via Document Overview.
> ⚠️ All three items reference the contract. An item without the contract link scores nothing.

**✅ Done when:** PO has 3 items, each showing the contract number and the right contract item.

---

## STEP 3 — Goods receipt via GR blocked stock

Only **item 10** (`B520-5##`, 200 PC) is relevant — it is the only stock material.

### 3a. Receive into GR blocked stock — movement `103`

**`MIGO`**

| Setting | Value |
|---|---|
| Action | **Goods Receipt** |
| Reference | **Purchase Order** |
| PO number | your release order |
| **Movement type** | **`103`** (GR to blocked stock — non-valuated) |
| Item | only `B520-5##`, **200** PC |
| Plant | `1010` |

Deselect / set "Item OK" off for the two cost-center items. **Post.**
→ **Log the material document number.**

> ⚠️ `103` posts into **GR blocked stock**, which is **unvaluated** — exactly what the exam asks
> for ("For a first inspection, you post it into the unvaluated GR blocked stock").
> ⚠️ Do not use 101 here. 101 goes straight to unrestricted and the rest of the step collapses.

### 3b. Release the blocked stock — movement `105`, split 100 / 100

**`MIGO` → Action: `Release GR Blocked Stock` → Reference: `Material Document`** (your 103 doc)
Movement type becomes **`105`**.

**Do this as TWO separate postings — it is far easier than splitting one line:**

**Posting A — to quality inspection**

| Field | Value |
|---|---|
| Quantity | `100` PC |
| **Storage location** | **`101C`** |
| **Stock type** (Where tab) | **Quality Inspection** |

**Posting B — to unrestricted use**

| Field | Value |
|---|---|
| Quantity | `100` PC |
| Storage location | `101C` |
| **Stock type** (Where tab) | **Unrestricted Use** |

→ **Log both material document numbers.**

> ⚠️ **Stock type** is on the item's **Where** tab in MIGO. It is a dropdown — *Unrestricted use /
> Quality inspection / Blocked*. This is the graded field.
> ⚠️ The exam names storage location `101C` only for the quality-inspection portion. Using `101C`
> for both keeps the stock together and makes step 4 simple. If your PO proposed a different
> storage location for the unrestricted part, that is also defensible — but **the 100 pc in
> quality inspection must be in `101C`**.

**Check with `MMBE`** for `B520-5##` / plant 1010: 100 in quality inspection, 100 unrestricted.

**✅ Done when:** MMBE shows the 100 / 100 split.

---

## STEP 4 — Transfer quality inspection → unrestricted (movement `321`)

**`MIGO`**

| Setting | Value |
|---|---|
| Action | **Transfer Posting** |
| Reference | **Other** |
| **Movement type** | **`321`** |

### Header text — do not miss it

**Header → tab `General` → `Document Header Text`:**

```
C##-TR
```

### Item

| Field | Value |
|---|---|
| Material | `B520-5##` |
| Quantity | `100` PC |
| Plant | `1010` |
| Storage location | `101C` |
| From stock type | Quality inspection |
| To stock type | Unrestricted use |

**Post.** → **Log the material document number.**

> ⚠️ `321` = quality inspection → unrestricted, same plant/storage location. The stock types are
> implied by the movement type; you do not usually pick them manually.
> ⚠️ `Document Header Text` is on the **header** *General* tab. Not *Delivery Note*. Not *Bill of
> Lading*. Not the item text.

**Verify with `MMBE`:** `B520-5##` in 1010/101C = **200 unrestricted, 0 in quality inspection**.

**✅ Done when:** quality inspection stock is zero and header text `C##-TR` is on the document.

---

## TASK 6 FINAL CHECK

```
[ ] 1  Contract type WK, supplier S520-3##, 101C, plant 1010, Z##
[ ] 1  Valid from 1st of current month, valid to +1 year -1 day
[ ] 1  Target value 100000,00 ; header condition 10 % discount
[ ] 1  Item 10: category M, material group WS##, price 5,00, plan deliv 10
[ ] 1  Item 20: category W, material group ET##, plan deliv 5
[ ] 2  Release order NB with 3 items, ALL referencing the contract
[ ] 2  Item 1: B520-5## 200 PC stock | Item 2: 50 PC free text, K/T-ENG## | Item 3: 50 PAC 99,90 K/T-ENG##
[ ] 2  10 % discount visible in item conditions
[ ] 3  103 posted for 200 PC ; 105 split 100 to quality insp. (101C) + 100 unrestricted
[ ] 4  321 for 100 PC with document header text C##-TR
[ ] 4  MMBE: 200 unrestricted, 0 in quality inspection
```

**Numbers to log:** contract #, release order #, 103 doc, both 105 docs, 321 doc.

---

### Quick troubleshooting

| Problem | Fix |
|---|---|
| Item category `M` rejects a blank material | Correct — `M` needs a short text, material group, price and unit. Fill those. |
| Item category `W` rejects a price | Correct — `W` takes no price and no quantity. Leave them blank. |
| Contract items numbered 1, 2 instead of 10, 20 | Change the item number increment or renumber; step 2 references "item 10" and "item 20". |
| No discount on the release order | The 10 % was entered at item level in the contract, or the PO item does not reference the contract. |
| MIGO offers no `105` action | Use Action = *Release GR Blocked Stock* with reference *Material Document* (the 103), not *Goods Receipt*. |
| Cannot set stock type | You are on the wrong tab — it lives on the item **Where** tab. |
| Warnings everywhere | The exam says ignore them. Press Enter and continue. |
