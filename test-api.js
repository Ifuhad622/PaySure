// Test script to verify API functionality
const fetch = require("node-fetch");

const BASE_URL = "http://localhost:3000";

async function testAPI() {
  console.log("🧪 Testing MelHad Investment API...\n");

  try {
    // Test 1: Login
    console.log("1. Testing login...");
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "admin",
        password: "admin123",
      }),
    });

    const loginResult = await loginResponse.json();

    if (loginResult.success) {
      console.log("✅ Login successful");
      const token = loginResult.token;

      // Test 2: Get services
      console.log("2. Testing services endpoint...");
      const servicesResponse = await fetch(`${BASE_URL}/api/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (servicesResponse.ok) {
        const services = await servicesResponse.json();
        console.log(
          `✅ Services loaded: ${services.length} services available`,
        );
      } else {
        console.log("❌ Services endpoint failed");
      }

      // Test 3: Get customers
      console.log("3. Testing customers endpoint...");
      const customersResponse = await fetch(`${BASE_URL}/api/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (customersResponse.ok) {
        const customers = await customersResponse.json();
        console.log(`✅ Customers loaded: ${customers.length} customers found`);
      } else {
        console.log("❌ Customers endpoint failed");
      }

      // Test 4: Get orders
      console.log("4. Testing orders endpoint...");
      const ordersResponse = await fetch(`${BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (ordersResponse.ok) {
        const orders = await ordersResponse.json();
        console.log(`✅ Orders loaded: ${orders.length} orders found`);
      } else {
        console.log("❌ Orders endpoint failed");
      }

      // Test 5: Get invoices
      console.log("5. Testing invoices endpoint...");
      const invoicesResponse = await fetch(`${BASE_URL}/api/invoices`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (invoicesResponse.ok) {
        const invoices = await invoicesResponse.json();
        console.log(`✅ Invoices loaded: ${invoices.length} invoices found`);
      } else {
        console.log("❌ Invoices endpoint failed");
      }

      console.log("\n🎉 All API tests completed successfully!");
    } else {
      console.log("❌ Login failed:", loginResult.error);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run tests
testAPI();
