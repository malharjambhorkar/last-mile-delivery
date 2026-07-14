# API contract

Base URL: `/api/v1`

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/register` | Create a customer, agent, or admin account. |
| `POST` | `/auth/login` | Create a role-based session. |
| `GET` | `/zones` | List configured zones and area mappings. |
| `PATCH` | `/zones/:id` | Admin-only zone/area update. |
| `GET` | `/rate-cards` | Read B2B/B2C intra/inter-zone rate cards. |
| `PATCH` | `/rate-cards/:orderType` | Admin-only rate-card update. |
| `POST` | `/orders/quote` | Calculate a non-persistent charge preview. |
| `POST` | `/orders` | Confirm and create an order from the quote input. |
| `GET` | `/orders` | Role-scoped orders; supports status, zone, and agent filters. |
| `GET` | `/orders/:id/tracking` | Customer-safe status and immutable tracking timeline. |
| `POST` | `/orders/:id/assign` | Admin assigns an agent or requests auto-assignment. |
| `POST` | `/orders/:id/status` | Agent/admin status transition; creates a tracking event. |
| `POST` | `/orders/:id/reschedule` | Captures a failed-delivery reschedule and queues reassignment. |

## Quote request

```json
{
  "pickup": "Warehouse A, Austin",
  "delivery": "North Loop, Austin",
  "dimensionsCm": { "length": 40, "breadth": 30, "height": 25 },
  "actualWeightKg": 12,
  "orderType": "B2C",
  "paymentType": "COD"
}
```

The response includes detected zones, lane, actual/volumetric/billable weights, rate-card version, COD surcharge, and total. The server recalculates this payload when creating an order; the client quote is never trusted as final pricing.
