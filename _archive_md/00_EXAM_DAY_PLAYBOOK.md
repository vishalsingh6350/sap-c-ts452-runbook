# C_TS452 — EXAM DAY PLAYBOOK
### Read this ONCE before you start. Then work from the individual task files.

---

## A. THE 8 RULES THAT DECIDE PASS / FAIL

| # | Rule | Why you fail without it |
|---|------|------------------------|
| 1 | **Every `##` = your group number.** Write it on paper before you start. | Results are matched by group number. Wrong number = zero, silently. |
| 2 | **`Y0##` and `P0##` contain a ZERO**, not the letter O. | Object created under a wrong key is never found by the grader. |
| 3 | **German number format.** `110.030,--` means **110030.00**. `730,29` means **730.29**. `100.000` means **100000**. | Typing 110.03 instead of 110030 kills the invoice and the task. |
| 4 | **Never re-create blindly; correct instead.** If you do re-create, the **newest / highest number wins**. | Grader reads only the latest object of that kind. |
| 5 | **Save every screen.** Config screens need transport request `C_TS452_##`. | Unsaved config looks complete on screen and is absent at evaluation. |
| 6 | **Use `Z##` (purchasing group) everywhere it is offered.** The exam says "where possible, use entries related to your group number". | Several checks look for Z## on PR / PO / info record / material / supplier. |
| 7 | **Right plant, right purchasing org.** Task 3 = `Y0##` + `P0##`. Tasks 4–7 = plant `1010` + purch. org `101C`. | The single most common silent failure in this exam. |
| 8 | **Do not submit until the Final Verification sweep (Section F) is green.** | No changes are possible after submit. |

---

## B. FIRST 10 MINUTES — PRE-FLIGHT (do not skip)

```
[ ] 1. Find your group number ##  -> Practice System page, under the course title
       (or Windows Start menu -> expand -> last 2 digits of your user name)

[ ] 2. Write it here, big:   ## = ______

[ ] 3. Open Guides/01_CHEATSHEET_my_values.md and fill in EVERY blank ONCE.
       From then on you copy from the cheat sheet. Never re-derive a key mid-task.

[ ] 4. Log on to Fiori: entry "S4HANA T41 Launchpad", user TS450-##, pwd Welcome1

[ ] 5. CHECK DECIMAL NOTATION:  SU3 -> Defaults tab -> Decimal Notation
       Tick which is active:  [ ] 1.234.567,89 (German)   [ ] 1,234,567.89 (US)
       -> This decides how you type every amount today. See Rule 3.

[ ] 6. CHECK DATE FORMAT on the same screen:  DD.MM.YYYY  or  MM/DD/YYYY

[ ] 7. Confirm SAP GUI / SPRO opens (Tasks 3 and 5 need customizing)

[ ] 8. Open Notepad as your LOG SHEET (Section E) and paste the template in
```

---

## C. RECOMMENDED ORDER AND TIME BUDGET

The exam states tasks are independent and you may start anywhere. **Do not simply go 3‑4‑5‑6‑7.**
Task 3 is the longest and the plant copy has real runtime — start it early, but bank easy points
before you sink into it.

Budget below assumes a **3-hour** window. Scale proportionally if yours differs.

| Slot | Do this | Why this position |
|------|---------|-------------------|
| 0:00–0:10 | **Pre-flight** (Section B) | Cheap insurance |
| 0:10–0:25 | **Task 3, steps 1–2 only** (plant copy + purchasing org) | Longest runtime in the exam; the rest of Task 3 is blocked until it finishes |
| 0:25–0:50 | **Task 4 (all)** | Self-contained, no config, fastest points available |
| 0:50–1:30 | **Task 3, steps 3–10** | Plant and purchasing org are ready by now |
| 1:30–2:00 | **Task 6 (all)** | Medium weight, self-contained |
| 2:00–2:30 | **Task 5 (all)** | Medium weight, one config step |
| 2:30–2:52 | **Task 7 (all)** | Most steps, but each step is short |
| 2:52–3:00 | **Final verification sweep (Section F) + submit** | Non-negotiable |

> **Hard rule: if one step blocks you for more than 5 minutes, log it, skip it, move on.**
> Every task is independent. A step you never reached scores the same as a step you fought
> for 25 minutes and lost — but those 25 minutes cost you three other steps.

---

## D. THE SILENT KILLERS

These fail at evaluation and look completely fine on screen. Check each one deliberately.

1. **Source Determination left ON** when creating a purchase requisition (Tasks 3.6, 4.1).
   The PR gets a source automatically, so the "assign source of supply" step has nothing to
   prove. Switch it **OFF** before entering the first item.
2. **Plant created with "New Entries" instead of "Copy org. object"** (Task 3.1). The plant
   exists, looks right, and carries none of the dependent assignments.
3. **Business Partner saved without the Company Code / Purchasing Org segments** (Task 3.4).
   The BP exists; the vendor does not. You must open the role, click the *Company Code* /
   *Purchasing Org* button, enter 1010 / P0##, and fill the tabs.
4. **Flexible workflow saved but not ACTIVATED** (Task 3.8). Looks saved. Never runs.
5. **PO created standalone instead of from the PR** (Tasks 3.9, 4.3). The grader checks the
   PR→PO link. Always adopt from Document Overview.
6. **Invoice posted directly instead of parked-then-posted** (Task 4.6 / 4.7). The park is
   itself graded. MIR7 to park, MIR4 to change and post.
7. **Tolerance group created AFTER the invoice** (Task 5.6 vs 5.7). Automatic invoice
   reduction only applies at posting time. **Do 5.6 before 5.7.**
8. **"SC Vendor" not flagged on the direct-delivery PO** (Task 5.2). The goods receipt lands
   in your own plant stock instead of stock-provided-to-vendor, and the whole subcontracting
   flow scores wrong.
9. **Purchase requisition not set to "Fixed" after the change** (Task 7.6). The next MRP run
   overwrites your changes and the step evaporates.
10. **German description not maintained** on the product master (Task 3.3). The English one is
    obvious; the German one hides behind *Additional Data → Descriptions*.
11. **Wrong document type.** ZNBF in Task 3.9; NB in Tasks 4, 5, 6. Document type cannot be
    changed once the first item is entered — set it first, every time.
12. **Output record created but never processed.** Status must read *Successfully processed* / green.

---

## E. YOUR LOG SHEET (paste into Notepad, fill as you go)

You will need these numbers again — in later steps of the same task, and in the final sweep.

```
GROUP NUMBER ## = ____
TRANSPORT REQUEST = ____________________

T3  Plant created ................ Y0__       [ ]
T3  Purch org created ............ P0__       [ ]
T3  Product ...................... T-RC__     [ ]
T3  Supplier ..................... SP-C__     [ ]
T3  Info record # ................ ____________
T3  Purchase requisition # ....... ____________
T3  Workflow ..................... CERT__     [ ] ACTIVE?
T3  Purchase order # (ZNBF) ...... ____________  [ ] released  [ ] output

T4  Purchase requisition # ....... ____________
T4  Purchase order # (NB) ........ ____________  [ ] output
T4  GR material document # ....... ____________
T4  Parked invoice # ............. ____________
T4  Posted invoice # ............. ____________

T5  Subcontracting PO # .......... ____________
T5  Component PO # (SC vendor) ... ____________  [ ] SC vendor flagged
T5  501 doc (if needed) .......... ____________
T5  541 goods issue doc # ........ ____________
T5  GR component doc # ........... ____________
T5  GR finished doc # ............ ____________  [ ] +2 extra consumption
T5  Tolerance group .............. C__         [ ] assigned to T-S52A__
T5  Invoice # .................... ____________

T6  Value contract # ............. ____________
T6  Release order (PO) # ......... ____________
T6  GR 103 doc # ................. ____________
T6  105 release docs # ........... ____________ / ____________
T6  321 transfer doc # ........... ____________

T7  Material ..................... T-RC5__    [ ]
T7  Info record # ................ ____________
T7  Source list .................. [ ] maintained
T7  501 GR doc # ................. ____________
T7  Reservation 1 # .............. ____________
T7  MRP run 1 -> PR # ............ ____________  [ ] fixed
T7  Quantity contract # .......... ____________
T7  Reservation 2 # .............. ____________
T7  MRP run 2 -> PR # ............ ____________
```

---

## F. FINAL VERIFICATION SWEEP (last 8 minutes — always)

Read-only checks, one transaction each.

```
[ ] OX18 (or SPRO Assignment) -> plant Y0## assigned to company code 1010
[ ] OX17                      -> purchasing org P0## assigned to plant Y0##
[ ] MM03 T-RC##               -> price control V, valuation class 3000, bin GR##,
                                 German description present, plant Y0## / SLoc 101C
[ ] BP SP-C##                 -> Company Code 1010 segment AND Purchasing Org P0##
                                 segment both exist; GR-based IV ticked
[ ] ME13 info record          -> purch org P0##, plant Y0##, BOTH validity periods
[ ] ME53N Task 3 PR           -> 2 items, source of supply assigned on both
[ ] Manage Workflows          -> CERT## status = ACTIVE
[ ] ME23N Task 3 PO           -> type ZNBF, released, output green
[ ] MIR4 Task 4 invoice       -> status POSTED (not parked)
[ ] ME23N Task 5 component PO -> Delivery Address tab shows SC Vendor = subcontractor
[ ] MMBE Task 5 component     -> stock under "Stock Provided to Vendor"
[ ] ME33K Task 6 contract     -> type WK, target value 100000, items 10 (cat M), 20 (cat W)
[ ] MMBE Task 6 B520-5##      -> 100 unrestricted, 0 in quality inspection (after the 321)
[ ] MD04 Task 7 material      -> two purchase requisitions: one fixed, one on the contract
[ ] Log sheet has no blank line you meant to fill
```

Then, and only then: **Confirm completion** — in the ORIGINAL browser tab, not the system tab.

---

## G. IF SOMETHING GOES WRONG

| Symptom | Do this |
|---------|---------|
| Message you do not understand | Double-click it for the long text. Task 6 explicitly says **ignore warnings**; only red errors block you. |
| Field greyed out | You are in display mode, or the segment it belongs to is not open yet. |
| "Object already exists" | Either another group's key or your own earlier attempt. Verify the key carries YOUR `##`. |
| You created a duplicate | Leave it. The newest number is evaluated — just make sure the newest one is the correct one. |
| Browser session closed | learning.sap.com → log in → back to the assessment. System work is already saved. |
| Stuck more than 5 minutes | Log it, skip it, next step. Return only if time remains. |

---

*Built from `C_TS452_EN_2601_Task_Instructions.pdf`. Points marked **JUDGMENT CALL** in the task
files are places where the exam wording permits two readings — the recommendation and the
reasoning are both given so you can decide in the moment rather than freeze.*
