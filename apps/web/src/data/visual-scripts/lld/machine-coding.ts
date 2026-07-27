import { domainStep, fsmStep, gridStep, script } from './helpers';

const parkingLot = script(
  'lld-machine-design-a-parking-lot',
  'Design a Parking Lot',
  'Machine-Coding Challenges',
  'Model floors, parking spots, vehicles, and tickets — assign spots by vehicle size and track occupancy.',
  [
    'ParkingLot → Floor[] → Spot[]',
    'Vehicle.size → findCompatibleSpot()',
    'Ticket issued on park(), fee on unpark()',
  ],
  [
    domainStep(1, [{ id: 'lot', label: 'ParkingLot', type: 'Floor', x: 140, y: 30, highlight: true }, { id: 'f1', label: 'Floor 1', type: 'Floor', x: 60, y: 120 }, { id: 'f2', label: 'Floor 2', type: 'Floor', x: 220, y: 120 }], [{ from: 'lot', to: 'f1' }, { from: 'lot', to: 'f2' }], { floors: 2 }, 'ParkingLot owns floors — each floor has a grid of spots.'),
    domainStep(2, [{ id: 'f1', label: 'Floor 1', type: 'Floor', x: 60, y: 40 }, { id: 's1', label: 'S1 compact', type: 'Spot', x: 40, y: 130, highlight: true }, { id: 's2', label: 'S2 large', type: 'Spot', x: 160, y: 130 }, { id: 'car', label: 'Car', type: 'Vehicle', x: 280, y: 80, highlight: true }], [{ from: 'car', to: 's1', label: 'park()', highlight: true }], { vehicle: 'compact' }, 'Car arrives — findCompatibleSpot() picks S1 (compact).'),
    domainStep(3, [{ id: 's1', label: 'S1 occupied', type: 'Spot', x: 40, y: 130, highlight: true, diff: 'Car parked' }, { id: 'ticket', label: 'T-1042', type: 'Booking', x: 200, y: 130, highlight: true, diff: 'issued' }], [{ from: 's1', to: 'ticket', label: 'linked', highlight: true }], { fee: 'on exit' }, 'Spot marked occupied, ticket issued — unpark() calculates fee from entry time.'),
  ],
);

const vendingMachine = script(
  'lld-machine-design-a-vending-machine',
  'Design a Vending Machine',
  'Machine-Coding Challenges',
  'State pattern drives the flow: Idle → HasMoney → Dispensing → Idle, with inventory and change handling.',
  [
    'states: Idle, HasMoney, Dispensing',
    'insertCoin() / selectProduct() / dispense()',
    'inventory[slot] tracks stock',
  ],
  [
    fsmStep(1, [{ id: 'idle', label: 'Idle', x: 40, y: 90 }, { id: 'money', label: 'HasMoney', x: 180, y: 90 }, { id: 'disp', label: 'Dispensing', x: 320, y: 90 }], [{ from: 'idle', to: 'money', label: 'insertCoin', active: true }], 'idle', { coin: '$1' }, 'Machine idle — customer inserts coin.', 'Vending FSM'),
    fsmStep(2, [{ id: 'idle', label: 'Idle', x: 40, y: 90 }, { id: 'money', label: 'HasMoney', x: 180, y: 90 }, { id: 'disp', label: 'Dispensing', x: 320, y: 90 }], [{ from: 'money', to: 'disp', label: 'select B3', active: true }], 'money', { selection: 'B3' }, 'Customer selects B3 — checks inventory[slot] and price.'),
    fsmStep(3, [{ id: 'idle', label: 'Idle', x: 40, y: 90 }, { id: 'money', label: 'HasMoney', x: 180, y: 90 }, { id: 'disp', label: 'Dispensing', x: 320, y: 90 }], [{ from: 'disp', to: 'idle', label: 'dispense + change', active: true }], 'disp', { stock: 'B3--' }, 'Product drops, change returned — back to Idle.'),
  ],
);

const splitwise = script(
  'lld-machine-design-splitwise',
  'Design Splitwise',
  'Machine-Coding Challenges',
  'Track users, groups, expenses, and who owes whom — simplify debts with balance diffs per step.',
  [
    'Group { users[], expenses[] }',
    'Expense.split(amount, paidBy, splitAmong)',
    'BalanceSheet.simplify()',
  ],
  [
    domainStep(1, [{ id: 'g', label: 'Trip', type: 'Group', x: 140, y: 30, highlight: true }, { id: 'a', label: 'Alice', type: 'User', x: 40, y: 120 }, { id: 'b', label: 'Bob', type: 'User', x: 140, y: 120 }, { id: 'c', label: 'Carol', type: 'User', x: 240, y: 120 }], [{ from: 'g', to: 'a' }, { from: 'g', to: 'b' }, { from: 'g', to: 'c' }], { members: 3 }, 'Trip group with Alice, Bob, Carol.'),
    domainStep(2, [{ id: 'a', label: 'Alice', type: 'User', x: 40, y: 60, highlight: true, diff: 'paid $90' }, { id: 'e', label: 'Dinner $90', type: 'Expense', x: 200, y: 60, highlight: true }, { id: 'b', label: 'Bob', type: 'User', x: 40, y: 150, diff: 'owes $30' }, { id: 'c', label: 'Carol', type: 'User', x: 240, y: 150, diff: 'owes $30' }], [{ from: 'a', to: 'e', label: 'paid', highlight: true }, { from: 'e', to: 'b' }, { from: 'e', to: 'c' }], { split: 'equal' }, 'Alice pays $90 dinner, split 3 ways — Bob and Carol each owe $30.'),
    domainStep(3, [{ id: 'b', label: 'Bob', type: 'User', x: 100, y: 100, highlight: true, diff: 'pays $30' }, { id: 'a', label: 'Alice', type: 'User', x: 240, y: 100, diff: 'receives $30' }], [{ from: 'b', to: 'a', label: 'settle', highlight: true }], { settled: 'yes' }, 'simplify() nets debts — Bob pays Alice $30 directly.'),
  ],
);

const ticTacToe = script(
  'lld-machine-design-tic-tac-toe',
  'Design Tic-Tac-Toe',
  'Machine-Coding Challenges',
  'Board state machine: turns alternate X/O, win/draw detection after each move.',
  [
    'class Board { cells[3][3] }',
    'class Game { players[], board, turn }',
    'move(r,c) → checkWin() | checkDraw()',
  ],
  [
    gridStep(1, [['', '', ''], ['', '', ''], ['', '', '']], { turn: 'X' }, 'Empty board — X goes first.', { highlight: [{ row: 1, col: 1 }] }),
    gridStep(2, [['X', '', ''], ['', 'O', ''], ['', '', '']], { turn: 'O' }, 'X at (0,0), O responds center — turn alternates.', { highlight: [{ row: 0, col: 0 }, { row: 1, col: 1 }] }),
    gridStep(3, [['X', 'O', 'X'], ['', 'O', ''], ['', '', 'X']], { winner: 'X' }, 'X wins diagonal — GameState → FINISHED.', { highlight: [{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }], label: 'X wins' }),
  ],
);

const bookMyShow = script(
  'lld-machine-design-bookmyshow',
  'Design BookMyShow',
  'Machine-Coding Challenges',
  'Shows, seats, concurrent booking locks, and confirmed reservations with state diffs.',
  [
    'Show → Screen → Seats[]',
    'BookingService.lockSeats(show, seats)',
    'Payment → confirmBooking()',
  ],
  [
    domainStep(1, [{ id: 'show', label: 'Avengers 7pm', type: 'Show', x: 140, y: 30, highlight: true }, { id: 's1', label: 'A1', type: 'Seat', x: 60, y: 120 }, { id: 's2', label: 'A2', type: 'Seat', x: 160, y: 120 }, { id: 's3', label: 'A3', type: 'Seat', x: 260, y: 120 }], [{ from: 'show', to: 's1' }, { from: 'show', to: 's2' }, { from: 'show', to: 's3' }], { available: 3 }, 'Show maps to seat grid — each seat has status AVAILABLE.'),
    domainStep(2, [{ id: 'u', label: 'User', type: 'User', x: 40, y: 60, highlight: true }, { id: 's2', label: 'A2', type: 'Seat', x: 160, y: 120, highlight: true, diff: 'LOCKED' }, { id: 's3', label: 'A3', type: 'Seat', x: 260, y: 120, highlight: true, diff: 'LOCKED' }], [{ from: 'u', to: 's2', label: 'lock 5min', highlight: true }, { from: 'u', to: 's3', label: 'lock', highlight: true }], { ttl: '5min' }, 'User selects A2, A3 — seats locked temporarily to prevent double booking.'),
    domainStep(3, [{ id: 'book', label: 'BK-8821', type: 'Booking', x: 140, y: 60, highlight: true, diff: 'CONFIRMED' }, { id: 's2', label: 'A2', type: 'Seat', x: 160, y: 140, diff: 'BOOKED' }, { id: 's3', label: 'A3', type: 'Seat', x: 260, y: 140, diff: 'BOOKED' }], [{ from: 'book', to: 's2', highlight: true }, { from: 'book', to: 's3', highlight: true }], { paid: 'yes' }, 'Payment succeeds — lock converts to BOOKED, confirmation issued.'),
  ],
);

const elevator = script(
  'lld-machine-design-an-elevator-system',
  'Design an Elevator System',
  'Machine-Coding Challenges',
  'Elevator FSM: Idle, MovingUp, MovingDown, DoorsOpen — SCAN algorithm picks next floor.',
  [
    'Elevator { currentFloor, direction, requests[] }',
    'states: Idle, Moving, DoorsOpen',
    'addRequest(floor) → schedule',
  ],
  [
    fsmStep(1, [{ id: 'idle', label: 'Idle', x: 40, y: 90 }, { id: 'up', label: 'MovingUp', x: 180, y: 90 }, { id: 'open', label: 'DoorsOpen', x: 320, y: 90 }], [{ from: 'idle', to: 'up', label: 'req floor 5', active: true }], 'idle', { floor: 1 }, 'Elevator idle at floor 1 — request for floor 5 arrives.', 'Elevator FSM'),
    fsmStep(2, [{ id: 'idle', label: 'Idle', x: 40, y: 90 }, { id: 'up', label: 'MovingUp', x: 180, y: 90 }, { id: 'open', label: 'DoorsOpen', x: 320, y: 90 }], [{ from: 'up', to: 'open', label: 'arrived 5', active: true }], 'up', { passing: '2,3,4' }, 'MovingUp — stops at intermediate floors if requested (SCAN).'),
    fsmStep(3, [{ id: 'idle', label: 'Idle', x: 40, y: 90 }, { id: 'up', label: 'MovingUp', x: 180, y: 90 }, { id: 'open', label: 'DoorsOpen', x: 320, y: 90 }], [{ from: 'open', to: 'idle', label: 'doors close', active: true }], 'open', { floor: 5 }, 'DoorsOpen — passengers exit/enter, then return to Idle or continue.'),
  ],
);

export const MACHINE_SCRIPTS = {
  'lld-machine-design-a-parking-lot': parkingLot,
  'lld-machine-design-a-vending-machine': vendingMachine,
  'lld-machine-design-splitwise': splitwise,
  'lld-machine-design-tic-tac-toe': ticTacToe,
  'lld-machine-design-bookmyshow': bookMyShow,
  'lld-machine-design-an-elevator-system': elevator,
};
