# System design

Fleetly separates the delivery workflow into an order service, pricing service, dispatch service, tracking service, and notification worker. A relational database is appropriate because orders, roles, rate cards, and immutable histories need transactional consistency. PostgreSQL stores operational data; Redis can hold temporary availability/location signals and job queues.

## Pricing and zone detection

Administrators maintain zones, area aliases, B2B/B2C rate cards, and COD surcharges. On a quote request, the pricing service normalizes the pickup and drop addresses and matches their locality/postcode against configured zone boundaries. A geocoding provider can supply coordinates; point-in-polygon lookup is preferred where polygons are available, with postcode/area aliases as a fallback. The lane is intra-zone when zone IDs match and inter-zone otherwise.

Volumetric weight is calculated as `length × breadth × height ÷ 5000`, using centimetres and kilograms. The billable weight is the maximum of actual and volumetric weight. The service selects the correct B2B/B2C and intra/inter rate, then adds the COD surcharge when applicable. It returns a versioned quote breakdown. At order confirmation the backend repeats the calculation within the transaction, snapshots the rate-card version and totals onto the order, and prevents client-side charge tampering.

## Assignment and availability

Agents have a service-zone assignment, latest location, capacity, shift state, and availability state. Auto-assignment filters agents who are active, available, capacity-safe, and permitted for the pickup zone. It ranks candidates by travel time from current GPS location to pickup; when location is stale it falls back to zone distance. Ties are resolved with lower active-load count and then fair round-robin ordering. An assignment reservation is committed atomically so two dispatch jobs cannot claim the same agent. Admins may override the result and the override is recorded.

## Lifecycle, tracking, and failed deliveries

Orders use an explicit lifecycle: `Pending → Assigned → Picked Up → In Transit → Out for Delivery → Delivered`, with `Failed` allowed from active delivery states. Each transition validates actor permissions and writes an append-only `tracking_events` row containing timestamp, actor, previous status, new status, location, and optional note. The order table stores the current status only as a projection of this history.

When a delivery fails, the system records reason and proof, sends customer email/SMS, and exposes a reschedule window. A reschedule creates a new delivery attempt linked to the original order rather than mutating the old history. The dispatch service clears the former assignment and queues auto-assignment for the selected date. Every assignment, notification, and reschedule is auditable.
