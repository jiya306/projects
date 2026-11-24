async function testBookingFlow() {
  console.log('Testing Appointment Booking & Conflict Prevention...\n');

  // Fetch a stylist and service
  const services = await fetch('http://localhost:5000/api/services').then(r => r.json());
  const staff = await fetch('http://localhost:5000/api/staff').then(r => r.json());

  const srv = services.data[0];
  const stf = staff.data[0];

  const bookingPayload = {
    serviceId: srv._id,
    stylistId: stf._id,
    date: '2026-12-05',
    startTime: '14:00',
    customerName: 'Kareena Kapoor',
    customerPhone: '+91 99999 11111',
    customerEmail: 'kareena@kapoor.demo',
    notes: 'Testing booking flow',
    couponCode: 'FIRSTVISIT15',
    bookingSource: 'ONLINE_WIZARD',
  };

  // 1. Create Appointment
  const res1 = await fetch('http://localhost:5000/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingPayload),
  }).then(r => r.json());

  console.log('1. New Appointment Created:', res1.success);
  console.log('   ID:', res1.data?.appointmentId);
  console.log('   Original Price:', res1.data?.price, 'Final Price after discount:', res1.data?.finalPrice);

  // 2. Attempt Double Booking (Same stylist, same date, same time)
  const res2 = await fetch('http://localhost:5000/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingPayload),
  }).then(r => r.json());

  console.log('\n2. Conflict Prevention Test (Expected failure on duplicate slot):');
  console.log('   Success:', res2.success, '| Message:', res2.message);

  if (res1.success && !res2.success) {
    console.log('\n✓ Booking and Conflict Engine PASSED with flying colors!');
  }
}

testBookingFlow().catch(console.error);
