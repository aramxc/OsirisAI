import pytest
from playwright.sync_api import sync_playwright

# This is a basic suite of API tests for the endpoints we have so far.
# We are using Playwright for testing. Playwright is a Node.js library to automate Chromium, Firefox, and WebKit with a single API.

# Define the base URL for the API
BASE_URL = "http://localhost:8000"

# This fixture sets up Playwright and the browser context
@pytest.fixture(scope="session")
def playwright_context():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()
        yield context
        context.close()
        browser.close()

# Test the health check endpoint
def test_health_check(playwright_context):
    # Create a new page in the browser context
    page = playwright_context.new_page()

    # Send a GET request to the health check endpoint
    response = page.request.get(f"{BASE_URL}/health")
    
    # Assert that the response status is 200 (OK)
    assert response.status() == 200
    
    # Assert that the response body contains the expected message
    assert response.json() == {"status": "ok"}

# Test the embedding creation endpoint
def test_create_embedding(playwright_context):
    # Create a new page in the browser context
    page = playwright_context.new_page()
    
    # Define the payload for the POST request
    payload = {
        "input": ["How many chucks would a woodchuck chuck"],
        "model": "text-embedding-ada-002"
    }
    
    # Send a POST request to the embedding creation endpoint
    response = page.request.post(f"{BASE_URL}/create-embedding", data=payload)
    
    # Assert that the response status is 200 (OK)
    assert response.status() == 200
    
    # Assert that the response body contains the expected keys
    response_json = response.json()
    assert "data" in response_json
    assert "embedding" in response_json["data"][0]

# Test the similarity calculation endpoint
def test_calculate_similarity(playwright_context):
    # Create a new page in the browser context
    page = playwright_context.new_page()
    
    # Define the payload for the POST request
    payload = {
        "query_embedding": [0.1, 0.2, 0.3],  # Example embedding vector
        "target_embedding": [0.1, 0.2, 0.3]  # Example embedding vector
    }
    
    # Send a POST request to the similarity calculation endpoint
    response = page.request.post(f"{BASE_URL}/calculate-similarity", data=payload)
    
    # Assert that the response status is 200 (OK)
    assert response.status() == 200
    
    # Assert that the response body contains the expected similarity score
    response_json = response.json()
    assert "similarity" in response_json
    assert isinstance(response_json["similarity"], float)

# Note: These tests assume that the API is running locally on port 8000.
# You may need to adjust the BASE_URL and the payloads according to your actual API implementation.