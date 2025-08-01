import { TriageEngine } from './TriageEngine.ts';

const te = new TriageEngine();

te.insert('P001', 10, 2, 3, 1);
te.insert('P002', 14, 4, 1, 0);
te.insert('P003', 7, 3, 2, 1);
te.insert('P004', 2, 1, 2, 0);
te.insert('P005', 0, 0, 1, 0);
te.insert('P006', 5, 2, 1, 0);
te.insert('P007', 8, 3, 2, 1);
te.insert('P008', 12, 4, 1, 0);
te.insert('P009', 6, 2, 1, 0);
te.insert('P010', 3, 1, 2, 0);

console.log('\n=== Initial Dump ===');
te.dump();

setTimeout(() => {
  te.recomputeAll();
  console.log('\n=== After 5 sec ===');
  te.dump();
}, 5000);

setTimeout(() => {
  te.recomputeAll();
  console.log('\n=== After 10 sec ===');
  te.dump();
}, 10000);
