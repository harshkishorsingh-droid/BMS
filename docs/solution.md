# Hold & Split — the full solution

BookMyShow group booking · November 2026

## The problem

> "Every time our group plans a movie, one person ends up paying ₹2,500–₹3,000 upfront just so we
> don't lose seats while waiting for everyone to confirm. Then you spend days chasing people for
> money. If you wait for everyone first, the good seats are gone. Why isn't there an easier way to
> block good seats, some pre-booking together?"
> — Rohan, 21

That complaint contains three separate problems, and most solutions only fix the second one.

1. He spends his own money on seats that are not all his.
2. He then chases his friends for money, for days.
3. If he waits for everyone to confirm first, the good seats are gone.

Underneath all three sits one thing: BookMyShow lets one person commit, but a group needs everyone
to commit at the same moment. Rohan's own money is the tool he uses to fake that.

So the design job is not "let people hold seats." It is **"let four people commit as fast as one
person can."** The seat hold is simply what that commitment buys.

## The solution

Everyone in the group pays a small part of their own ticket to hold the seats, then pays the rest
before the show.

Nobody pays for anybody else. Rohan puts in ₹30 instead of ₹1,184. The seats are held from the
moment the group starts paying, so they argue over seats that are already theirs. There is nothing
to chase afterwards, because each person's seat is their own responsibility and their own ticket.

It runs on BookMyShow's existing checkout. No new payment technology, no money stored inside the
app, no chat, and no changes to how anyone finds a movie.

## The worked example

Used throughout, and matching the prototype screen for screen.

| | |
| --- | --- |
| Movie | Ramayana · Hindi · 2D |
| Venue | Silver Screen (AC Dolby 7.1): Bijoynagar, Screen 1 |
| Show | Sat, 21 Nov 2026 · 03:00 PM |
| Seats | Platinum · G5, G6, G7, G8 |
| Group | Rohan (organiser), Arjun, Priya, Dev |
| Ticket price | ₹250 each · ₹1,000 total |
| Convenience fees | ₹184.08 |
| Order total | ₹1,184.08 |
| **Per person** | **₹296.02 — ₹30 now, ₹266.02 before the show** |
| Collected at hold | ₹120 |
| Outstanding after hold | ₹1,064 |

## The full flow

1. Rohan picks 4 seats on the seat map, exactly as he does today.
2. Instead of **Pay ₹1,000**, he taps **Split & hold**.
3. The app shows the split: ₹30 now, ₹266.02 later, per person.
4. He pays his own ₹30. The 4 seats go on hold and the securing timer starts.
5. He shares one link into the WhatsApp group where the plan already lives.
6. Each friend taps the link and sees the movie, the exact seats, their ₹30, who has already paid,
   and the time left.
7. Each friend enters their phone number and pays ₹30 from their own UPI app. No download, no
   password, no account.
8. When the last person pays, the seats are **secured**. The race is over. ₹120 collected,
   ₹1,064 outstanding.
9. Each person pays their own ₹266.02 before their deadline. Their ticket becomes valid the moment
   they do.
10. Four people end up with four separate tickets on four separate phones. Nobody owes anybody.

### The four states a seat passes through

| State | What it means | Who can take the seat |
| --- | --- | --- |
| Available | On sale as normal | Anyone |
| Held | Someone started a group hold and paid their own part | Nobody, until the timer ends |
| Secured | Every person has paid their hold | Nobody, until the balance deadline |
| Confirmed | That person has paid in full | It is theirs |

A seat that fails at the held stage goes straight back to available. A seat that fails at the
secured stage is released and resold.

## How the friends find out

The group already has a WhatsApp group, so BookMyShow sends a link into it rather than building a
place for them to talk. Copy link and SMS are there as fallbacks.

The link shows the movie, theatre and showtime; the exact seats with the group's marked; what this
person owes now and later; who has already paid, by first name; and a countdown.

Reminders are notifications only, never messages between people — at securing, 24 hours before the
balance deadline, 2 hours before, and a final call.

**Why not a chat inside the app.** Groups already decide in WhatsApp and will not move. Building
messaging is out of scope for the brief. And a chat would add a surface where people negotiate
instead of paying, which is the opposite of what the seat race needs. The live status view is
deliberately not a chat: it shows names, amounts and a timer, with nothing to type into.

## Where each person pays from

The link opens a BookMyShow page in the friend's browser. They do not install the app and they do
not create an account. All they give is a phone number, which BookMyShow needs anyway to deliver a
ticket. Payment options are the ones BookMyShow already offers — their own UPI app, card, or net
banking.

The money goes straight through BookMyShow's payment gateway and onto that specific booking. It is
never held as a balance, never topped up, and never spendable on anything else.

**Why this step decides whether the feature works.** Airbnb built something close to this in 2017:
an organiser held the booking and the group paid their shares, and the whole thing collapsed if they
didn't. It was later withdrawn, and the most common complaint was that every friend had to make an
account and clear identity checks before they could pay anything. Every extra step here loses a
person, and losing one person loses the booking. The target is a friend going from WhatsApp to paid
in under thirty seconds.

A prompt to install the app appears after their ticket is issued, never before.

## Hold windows

Two clocks, and keeping them separate is what makes this work: a short one for commitment, a long
one for money.

### Clock one — the securing window

How long the group gets to all pay their ₹30. Starts when the organiser pays theirs. Short, because
these are four good seats off sale.

| How full the show is | Securing window |
| --- | --- |
| Under 40% sold | 45 minutes |
| 40–75% sold | 30 minutes |
| Over 75%, or opening weekend | 15 minutes |

BookMyShow already blocks seats for 5 to 10 minutes while a single person checks out, so this is the
same mechanic with a longer leash for a group that has put money down.

### Clock two — the balance deadline

Once secured, each person has much longer to pay their balance. How long depends on how soon the
show is, because the later a seat is released the harder it is for the cinema to resell.

| Booked | Balance due |
| --- | --- |
| 3 or more days ahead | 24 hours before showtime |
| 1–2 days ahead | 6 hours before showtime |
| Same day | 2 hours after securing |

### Two rules that override everything

- Every hold expires 2 hours before showtime, whatever the table says.
- No new group holds can start within 4 hours of showtime. Late walk-up sales are the cinema's best
  money and nothing should block them.

When a group books short, the empty adjacent seats stay reserved for 20 more minutes so a latecomer
can join the same booking at the same price.

These are starting values. The securing window in particular should be set from real behaviour: ask
people how long their group takes to reply to a WhatsApp message in the evening.

## The money

### How much the hold is

**10% of your own share, rounded to the nearest ₹5, minimum ₹20, maximum ₹100.**

| Tier | Ticket | Your share | Hold now | Balance |
| --- | --- | --- | --- | --- |
| Silver | ₹150 | ₹177.61 | ₹20 *(floor)* | ₹157.61 |
| Gold | ₹200 | ₹236.82 | ₹25 | ₹211.82 |
| Platinum | ₹250 | ₹296.02 | ₹30 | ₹266.02 |
| Recliner | ₹2,000 | ₹2,368.16 | ₹100 *(cap)* | ₹2,268.16 |

A percentage, because the seats people fight over are the expensive ones and holding those should
cost more. A floor, because ₹15 deters nobody. A cap, because asking ₹236 a head on premium seats
would bring the fronting problem back at an individual level.

On opening weekend the rate rises to 25%, still capped at ₹100. On the very hottest shows, group
holds are switched off entirely.

### What happens to the hold money

| Outcome | The hold money |
| --- | --- |
| Everyone pays in full | Comes off the ticket price. Nothing extra is paid. |
| Securing fails, you paid | Refunded to source |
| Securing fails, you started it | Refunded the first time, forfeited after that |
| You miss your balance deadline | Forfeited. Your seat is released and resold. |
| You cancel after paying in full | BookMyShow's existing cancellation policy, your ticket only |

Refunds go back to the original payment method in the normal 3 to 5 working days. Never as app
credit, because credit is a balance and a balance is a wallet.

### Why the hold is not simply refundable

A hold that is always refunded is a free hold with extra steps. A bot takes the best seats, lets the
timer run out, gets its money back and repeats, at no cost. That is the exact abuse the brief warns
about.

But forfeiting from everyone is worse in a different way, because the friends who did pay lose money
through no fault of theirs, and those are the people who never use the feature again.

So the cost falls on the person who started a hold and wasted it, not on the people who turned up.
Their first failure is forgiven, because real groups do fall apart once. Repeat failures are not.

### The honest limit of this

The hold amount is a speed bump, not a wall. Someone making ₹2,000 a ticket on resale will happily
pay ₹100. The money stops casual waste and forces a commitment signal. Stopping a determined
attacker is the job of the limits below, not the price.

## Edge cases and failure states

| Situation | What the system does |
| --- | --- |
| Friend has no BookMyShow account | Nothing changes. Phone number and pay. Ticket arrives by SMS and WhatsApp. |
| Friend's payment fails | They stay unpaid, the timer keeps running, they can retry. One failure does not end the hold. |
| Timer ends with 3 of 4 paid | Organiser is offered: book for 3, or let it go. The 4th seat stays warm 20 minutes. |
| Seats taken while choosing | Caught before payment, not after. Next best block together is offered. |
| Organiser pays then disappears | Timer runs out on its own. Everyone who paid is refunded. Nobody has to chase him. |
| Someone wants out after paying the hold | They can leave. Refunded if not yet secured, forfeited if secured. Seat frees up. |
| Someone never pays their balance | At the deadline their seat alone is released and resold. Their hold is forfeited. The group keeps its other seats. |
| Group wants different seats after 2 have paid | Moving seats needs everyone who paid to agree. Simpler: cancel, refund, start again. |
| Theatre cancels the show | Every hold and every full payment is refunded. Standard rules. |
| Price changes during the hold | Price is locked when the hold starts. BookMyShow absorbs a rise within the window. |
| More people tap the link than there are seats | First come, first served. Once 4 have paid, the link shows the group as full. |
| Someone pays twice | Second payment auto-refunded within the hour. |
| Link shared outside the group | Anyone with it can pay and take a seat. The organiser sees every payer by name and can lock the link. |
| Refund itself fails | Flagged to support within 24 hours, not left to the user to notice. |
| Person joins after the group booked short | Takes a warm seat at the original price, added to the same booking. |

**The case worth designing most carefully** is someone never paying their balance. It is the most
likely failure, it happens late, and it costs the cinema a seat it can barely resell. Three things
soften it: reminders that start a day early, the option for the group to cover the seat and settle
privately, and a deadline that tightens the closer the show gets.

## Business guardrails

### Revenue

The gain is not the hold fee. It is the bookings that die today. A group that stalls currently earns
BookMyShow nothing, and the brief says these stall often. Converting a share of them into completed
bookings, plus partial bookings that used to be total losses, is where the money is. Forfeited holds
are incidental and should never become a revenue target — that would mean designing for groups to
fail.

### The cinema's inventory

The cinema owns the seats, not BookMyShow, and an unsold held seat at showtime is worth nothing to
them.

- Every held seat has real money behind it. There is no free hold anywhere in this design.
- Hold windows shorten automatically as a show fills up.
- All holds die 2 hours before showtime, and none can start within 4 hours of it.
- A cap on how many seats in any one show may sit secured but unpaid at the same time, so a popular
  show cannot end up half-reserved on 10% payment.

### Fraud and abuse

The money is a speed bump. These limits are the actual defence:

- One active hold per account
- A cap on seats per hold, matching the existing per-booking ticket limit
- A cooldown after a failed hold, so holds cannot be cycled back to back
- Verified phone number and a traceable payment instrument behind every hold
- Group holds disabled entirely on the highest-demand shows
- Repeat failed holds forfeit the money and eventually lose access to the feature

This matters more than usual here. BookMyShow's chief executive said publicly after the Coldplay
sale that they were underprepared for the bots, and there is an open Economic Offences Wing
complaint alleging manipulated queues. Any feature that lets people take good seats off sale will be
read against that history, so the limits belong in the pitch, not in a footnote.

### Operations and support

Three new ticket types will appear: *where is my refund*, *why did I lose my seat*, and *my friend
paid but I did not get a ticket*. Reduce them at the source.

- State refund timing in words before anyone pays, not after they ask
- Send a notification when a refund is issued, not only when it lands
- Give support one view of a group booking showing every person, payment and deadline
- Automatically flag failed refunds within 24 hours instead of waiting for a complaint

## Staying inside the brief

| Constraint | How this respects it |
| --- | --- |
| No discovery, home feed, theatre listings or showtime browsing | Untouched. The flow starts on the seat map, the screen the user is already on. |
| No food and beverage, offers or loyalty | None appear. The hold is part of the ticket price, not a discount or reward. |
| No standalone chat, social network or wallet | The group talks in WhatsApp. The status view has no text input. Money passes through to one booking and is never stored as a balance. |
| Only touch an adjacent screen if necessary | Two touched. The seat map gains one button. The ticket screen shows who still owes. |

### Why this is a part-payment and not a wallet

A wallet is money sitting in the app as a balance you top up and spend on whatever you like. A
payment is money passing through to buy one specific thing.

The ₹30 is attached to one booking, for one show, on one date. It becomes part of that ticket or it
goes back to the card or account it came from. There is no balance screen, no top-up, and no
carrying it to next week's film.

The one real cost: between securing and full payment, BookMyShow is holding ₹120 of other people's
money against an unfinished booking, and a collapse means four small refunds. That is a genuine
liability. It is much smaller than refunding ₹296 each, but it is not zero and should be stated
rather than argued away.

## Trade-offs

| Decision | Chosen because | What it costs |
| --- | --- | --- |
| Part-payment rather than freezing money through UPI | Runs on existing checkout, no bank or gateway dependency, far easier to explain in four seconds | Freezing a full share deters an attacker more than taking ₹30 does |
| Everyone pays their own hold, not the organiser paying all | Without this, the organiser still fronts the whole amount and the first line of the complaint survives | Four payments must succeed instead of one |
| Group bookings only | Matches the complaint, keeps scope tight, limits abuse | A solo user with the same problem is not served |
| Participants refunded, repeat starters forfeited | Protects honest people, prices out repeat waste | Small refund load on every failed group |
| Long balance window | Matches how groups actually behave | An unpaid seat returns late, which is the cinema's problem, not the user's |
| Unpaid seat, not locked ticket | Honest, and avoids a rule that cannot be enforced at the door | Slightly less pressure to pay |

### Rejected, and why

- **Split the bill after booking.** The obvious answer. It fixes the chasing and leaves the organiser
  out of pocket with the good seats already gone. It solves the second half of the complaint and
  ignores the first.
- **Free seat holds for groups.** The brief names this as a trap, and it is. On a busy show it is a
  bot's best tool.
- **Locking a friend's ticket until they pay.** A good instinct about social pressure, but
  unenforceable. You cannot stop an unpaid friend walking in beside three people holding valid
  tickets.

### What to build next

- **Hold the row, not the seat.** Lock four seats together in rows E to H rather than G5 to G8, and
  assign exact seats on confirmation. Much cheaper for the cinema, because it never strands single
  seats nobody will buy.
- **Group pre-booking before the sale opens.** Exactly what Rohan asked for. Held back because it
  reads as a fast lane, which is dangerous while the scalping complaints are live.
- **Standing permission for regular groups.** One setup, then no approvals at all. Powerful for
  groups who go every month, useless for a first booking.
