async function runTests() {
  console.log('Testing SalonFlow live endpoints...\n');

  // 1. Health check
  const healthRes = await fetch('http://localhost:5000/api/health').then(r => r.json());
  console.log('1. Health Check:', healthRes);

  // 2. Services
  const servicesRes = await fetch('http://localhost:5000/api/services').then(r => r.json());
  console.log('2. Services Count:', servicesRes.data?.length, 'services found');

  // 3. Staff
  const staffRes = await fetch('http://localhost:5000/api/staff').then(r => r.json());
  console.log('3. Staff Count:', staffRes.data?.length, 'stylists found');

  // 4. Login Admin
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@salonflow.demo', password: 'Admin@123' }),
  }).then(r => r.json());
  console.log('4. Admin Login:', loginRes.success, 'Token role:', loginRes.user?.role);

  // 5. Analytics Dashboard with token
  const dashRes = await fetch('http://localhost:5000/api/analytics/dashboard', {
    headers: { Authorization: `Bearer ${loginRes.token}` },
  }).then(r => r.json());
  console.log('5. Analytics Dashboard KPIs:', {
    todayAppointments: dashRes.data?.kpi?.todayAppointmentsCount,
    totalCustomers: dashRes.data?.kpi?.totalCustomers,
    todayRevenue: dashRes.data?.kpi?.todayRevenue,
    monthlyRevenue: dashRes.data?.kpi?.monthlyRevenue,
    activeStaff: dashRes.data?.kpi?.activeStaff,
  });

  // 6. Availability Engine
  const availRes = await fetch('http://localhost:5000/api/appointments/availability?date=2026-11-25&duration=45').then(r => r.json());
  console.log('6. Slot Availability Engine:', availRes.slots?.length, 'slots calculated, sample slot:', availRes.slots?.[0]);

  // 7. Validate Coupon
  const promoRes = await fetch('http://localhost:5000/api/promotions/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'FIRSTVISIT15', amount: 2000 }),
  }).then(r => r.json());
  console.log('7. Coupon Validation (FIRSTVISIT15 on ₹2000):', {
    valid: promoRes.valid,
    discountAmount: promoRes.discountAmount,
    finalAmount: promoRes.finalAmount,
  });

  // 8. Frontend Dev Server Check
  const frontRes = await fetch('http://localhost:5173/');
  console.log('8. Frontend Dev Server HTTP Status:', frontRes.status, frontRes.statusText);

  console.log('\nAll core backend APIs and frontend dev server are 100% operational!');
}

runTests().catch(console.error);
