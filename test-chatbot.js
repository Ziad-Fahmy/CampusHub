// Test script for CampusHub Chatbot API
const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000/api';

// Test functions
async function testHealthCheck() {
  console.log('🔍 Testing health check...');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server health:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Server health check failed:', error.message);
    return false;
  }
}

async function testChatbotHealth() {
  console.log('🔍 Testing chatbot health...');
  try {
    const response = await axios.get(`${BASE_URL}/chatbot/health`);
    console.log('✅ Chatbot health:', response.data);
    return response.data.status === 'healthy';
  } catch (error) {
    console.error('❌ Chatbot health check failed:', error.message);
    return false;
  }
}

async function testChatbotMessage(message) {
  console.log(`🔍 Testing chatbot with message: "${message}"`);
  try {
    const response = await axios.post(`${BASE_URL}/chatbot/chat`, {
      message: message
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Chatbot response:', response.data.response);
    return true;
  } catch (error) {
    console.error('❌ Chatbot message test failed:', error.response?.data || error.message);
    return false;
  }
}

async function testChatbotCategories() {
  console.log('🔍 Testing chatbot categories...');
  try {
    const response = await axios.get(`${BASE_URL}/chatbot/categories`);
    console.log('✅ Available categories:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Chatbot categories test failed:', error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting CampusHub Chatbot API Tests\n');
  
  const tests = [
    { name: 'Server Health Check', fn: testHealthCheck },
    { name: 'Chatbot Health Check', fn: testChatbotHealth },
    { name: 'Chatbot Categories', fn: testChatbotCategories },
    { name: 'Simple Chat Message', fn: () => testChatbotMessage('Hello') },
    { name: 'University Info Query', fn: () => testChatbotMessage('Tell me about admissions') },
    { name: 'Facilities Query', fn: () => testChatbotMessage('What facilities are available?') }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    console.log(`\n--- ${test.name} ---`);
    try {
      const result = await test.fn();
      if (result) {
        passed++;
        console.log(`✅ ${test.name} PASSED`);
      } else {
        failed++;
        console.log(`❌ ${test.name} FAILED`);
      }
    } catch (error) {
      failed++;
      console.log(`❌ ${test.name} FAILED:`, error.message);
    }
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Chatbot API is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Please check the server configuration and logs.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testHealthCheck, testChatbotHealth, testChatbotMessage };

