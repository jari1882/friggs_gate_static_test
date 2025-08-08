
# Bifrost API Payload Contract

This document defines the payload structure required by the frontend (Frigs Gate Chate) to interact with the Bifrost backend via the LangServe interface.

---

## 🧩 Endpoint

**URL Path:** `POST /ask/invoke`  
**Description:** Submits a question and session context to Bifrost for inference.

---

## 📥 Input Payload Format

All payloads must be wrapped in an `"input"` field:

```json
{
  "input": {
    "version": "1.0",
    "question": "How much would a policy cost for a 40-year-old?",
    "chat_history": [
      { "human": "Hi", "ai": "Hello!" }
    ],
    "metadata": {
      "caller": "frontend_app",
      "purpose": "quote_request",
      "timestamp": "2025-06-06T13:45:00Z",
      "system_message": "optional override message"
    },
    "agent_request": {
      "target_agent": "quick_quote",
      "confidence": 0.92,
      "rationale": "User asked for pricing"
    },
    "session": {
      "user_id": "user-456",
      "context": {
        "active_policy": "UL12345"
      }
    },
    "stream": false
  }
}
```

---

## 🧾 Input Field Definitions

| Field           | Type        | Required | Description |
|------------------|-------------|----------|-------------|
| `version`        | `string`    | ✅       | Must be `"1.0"` |
| `question`       | `string`    | ✅       | Natural language question |
| `chat_history`   | `list`      | ⬜        | List of `{human, ai}` dialogue pairs |
| `metadata`       | `object`    | ✅       | Includes `caller`, `purpose`, `timestamp`, and optional `system_message` |
| `agent_request`  | `object`    | ⬜        | Optional — defines specific routing metadata |
| `session`        | `object`    | ✅       | Includes `user_id` and `context` dict |
| `stream`         | `boolean`   | ⬜        | Enables streaming (default: `false`) |

---

## 📤 Response Structure

```json
{
  "output": {
    "version": "1.0",
    "question": "...",
    "chat_history": [...],
    "metadata": { ... },
    "agent_request": {
      "target_agent": "quick_quote",
      "confidence": 0.92,
      "rationale": "..."
    },
    "session": { ... },
    "stream": false,
    "agent": "quick_quote",
    "status": "success",
    "answer": "Here’s your quote: $34/month.",
    "error": null
  }
}
```

---

## ❌ Error Response Example

```json
{
  "output": {
    "status": "failed",
    "agent": "input_node",
    "error": "ValidationError: ...",
    "answer": "❌ Invalid input payload received by input node."
  }
}
```

---

## ⚠️ Validation Behavior

- If `question` is empty, Bifrost injects `"..."` as fallback.
- If `metadata.system_message` is empty, Bifrost injects a default router instruction.
- All inputs are validated using the `BifrostState` Pydantic model.

---

## 🧪 Sample Test Payload

Defined in `test_utils.py`:

```json
{
  "version": "1.0",
  "question": "Can I get a illustration?",
  "chat_history": [
    { "human": "Hi", "ai": "Hello!" },
    { "human": "How are you?", "ai": "I am good. Thank you for asking. How can I help?" }
  ],
  "metadata": {
    "caller": "cli_test",
    "purpose": "dev_debug",
    "timestamp": "2025-05-17T10:30:00Z"
  },
  "session": {
    "user_id": "rod-123",
    "context": { "active_policy": "UL12345" }
  },
  "stream": false
}
```

---

## 🌐 Base URL Configuration

Bifrost does not hardcode a fixed address like `http://127.0.0.1:8000` in this contract. Here's why — and how we handle it clearly and explicitly.

### 🔎 Why the Full URL Is Not Included in the Core Spec

This API contract defines **how** to interact with the API (endpoint path, payload schema, response format), but **not exactly where** it's hosted. That's because:

- Bifrost can be run in **multiple environments** (local dev, Docker, internal staging, production).
- The **host and port** are runtime-configurable.
- Including a fixed URL like `http://127.0.0.1:8000` would be **wrong or misleading** in non-local cases.

This is common practice for internal or flexible deployments.

---

### 🧭 Where You Define the Base URL

The actual address (host and port) is configured in the `.env` file at the project root. Here's how:

```env
# .env

# Server configuration
API_HOST=127.0.0.1     # Use 0.0.0.0 to expose outside localhost
API_PORT=8000          # Default port, can be changed
```

In Python (usually in `main.py` or `api.py`):

```python
import os
from dotenv import load_dotenv

load_dotenv()

host = os.getenv("API_HOST", "127.0.0.1")
port = int(os.getenv("API_PORT", "8000"))

uvicorn.run(app, host=host, port=port)
```

---

### 💡 What This Means for You

- When running locally, your **full URL** is:
  ```
  http://127.0.0.1:8000/ask/invoke
  ```

- In production, it may become:
  ```
  https://bifrost.lns.io/ask/invoke
  ```

- Always construct your full request URL like this:
  ```
  {BASE_URL} + /ask/invoke
  ```

Where `BASE_URL` comes from your deployment configuration, environment variable, or frontend settings.

---

### 📌 Reminder

If you're setting up or integrating Bifrost, make sure your `.env` has `API_HOST` and `API_PORT`, and the frontend knows the base URL for your current environment.
