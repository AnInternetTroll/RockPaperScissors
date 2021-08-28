# Game rules

```json
{
  "tries": 3, // number
  "items": [
    {
      "name": "rock",
      "weakness": ["paper"],
      "picture": "url_or_data"
    },
    {
      "name": "paper",
      "weakness": ["scissors"],
      "picture": "url_or_data"
    },
    {
      "name": "scissors",
      "weakness": ["rock"],
      "picture": "url_or_data"
    }
  ]
}
```

# OP Codes

## 1

**Ping** Client:

```json
{
  "op": 1,
  "d": "Ping pong"
}
```

Server:

```json
{
  "op": 1,
  "d": "Ping pong"
}
```

## 2

**Join**

Client:

```json
{
  "op": 2,
  "d": {
    "username": "my username",
    "against": "other username" // Optional.
  }
}
```

Server:

```json
{
  "op": 2,
  "d": {
    "status": "ready", // "waiting" || "ready"
    "rules": {
      // see #Game-rules
    }
  }
}
```

## 3

Server:

```json
{
  "op": 3,
  "d": "paper" // "paper" | "scissor" | "rock" (or whatever there is in the rules) (this is what the other player chose)
}
```

Client:

```json
{
  "op": 3,
  "d": "rock" // "paper" | "scissor" | "rock" (or whatever there is in the rules)
}
```
