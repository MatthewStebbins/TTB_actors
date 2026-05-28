# Chapter 3: Character Creation

## Overview

A **Fated** character is the player character type in Through the Breach. Each Fated has glimpsed their destiny and follows a 14-step card-based creation process using a **Fate Deck** (standard 52-card deck + Red Joker + Black Joker = 54 cards).

---

## Aspects

Each character has **8 Aspects** (range: typically -5 to +5; 0 = human average).

### Physical Aspects

| Aspect | Description |
|---|---|
| `Might` | Raw strength and prowess |
| `Grace` | Accuracy and fluidity |
| `Speed` | Swiftness of action |
| `Resilience` | Resistance to damage and disease |

### Mental Aspects

| Aspect | Description |
|---|---|
| `Charm` | Likability and trustworthiness |
| `Cunning` | Shrewdness and quick thinking |
| `Intellect` | Logical thought and learning |
| `Tenacity` | Raw willpower and confidence |

---

## Skills

- Range: **0** (no skill) to **5** (master)
- Added to Aspects when resolving actions
- At **3+ ranks** in a Skill, the character may choose a **Trigger** for it

## Talents

- **Pursuit Talents**: gained only through Pursuit advancement
- **General Talents**: available to any character meeting prerequisites

---

## 14-Step Character Creation Process

### Step 1 — Concept

Develop a general character idea. Discuss with Fatemaster and other players.

- **Action**: Shuffle Fate Deck **7 times**, then have Fatemaster cut it.
- No mechanical output; narrative/concept only.

---

### Step 2 — Station

**Flip** the top card of the Fate Deck → **Station Card**.

- Consult Cross Roads Tarot Reference Table (pp. 82–83)
- Record the **Station** on the character sheet
- Each Station is linked to a specific **Station Skill** (used in Step 7)

#### Station Jokers

| Joker | Station |
|---|---|
| Red Joker | Neverborn Stolen |
| Black Joker | Bayou Born |

> Characters with Joker Stations grew up in Malifaux (likely teenagers, ~10 years old max given the Second Breach opened in 1897).

---

### Step 3 — Body

**Flip** the top card → **Body Card** (placed left of Station Card).

- Each Body Card provides **4 values** (can be negative)
- Assign each value freely to one Physical Aspect: `Might`, `Grace`, `Speed`, `Resilience`
- No value may be assigned to the same Aspect twice

---

### Step 4 — Root Skills

**Flip** the top card → **Root Card** (placed above Station Card).

- Each Root Card provides **a set of skill rank values**
- Assign freely to any **Skills** in the game
- Represents childhood learning (chosen by parents/caregivers, not the character)

---

### Step 5 — Mind

**Flip** the top card → **Mind Card** (placed right of Station Card).

- Each Mind Card provides **4 values** (can be negative)
- Assign each value freely to one Mental Aspect: `Charm`, `Cunning`, `Intellect`, `Tenacity`
- No value may be assigned to the same Aspect twice

---

### Step 6 — Endeavor Skills

**Flip** the top card → **Endeavor Card** (placed below Station Card).

- Each Endeavor Card provides **a set of skill rank values**
- Assign freely to any **Skills the character does not already possess**
- Represents adult, self-directed learning

---

### Step 7 — Station Skills

Look up the **Station Skill** linked to the character's Station (from Step 2).

- If character has **0 ranks** in the Station Skill → gain **1 rank** in it
- If character has **1+ ranks** already → gain **1 rank** in a different Skill the character does not possess

---

### Step 8 — Modify

The character receives **2 points** to spend (each point used independently):

| Option | Effect | Limit |
|---|---|---|
| Increase an Aspect | +1 to any Aspect | Cannot raise above **+3** via this step |
| Gain Skill ranks | +2 ranks in a Skill not already possessed | — |

---

### Step 9 — Divining Fate

Each Tarot card has a **Destiny phrase**. Read cards in this order to form the Destiny:

1. Endeavor Card
2. Mind Card
3. Root Card
4. Body Card
5. Station Card *(always last)*

- Record each phrase as a **Destiny Step** on the character sheet
- The Fatemaster weaves this into the campaign narrative

#### Languages

- All characters speak **English** (required by the Guild)
- Characters also speak **1 native language** from their homeland
- Each rank in the **Literacy** Skill grants **1 additional language** (Earth languages only)

---

### Step 10 — Pursuit

Choose a **Pursuit** — the character's general approach to problems. Grants a **Starting Bonus**.

> Pursuits can be changed at the start of each game session.

#### Basic Pursuits

| Pursuit | Summary |
|---|---|
| Academic | Learned individuals with broad knowledge |
| Criminal | Experts at getting what they want (sometimes legally) |
| Dabbler | Sorcery-focused spellcasters |
| Drudge | Tireless laborers; endure great punishment |
| Graverobber | Necromancy-focused spellcasters |
| Guard | Tough, resilient defensive combatants |
| Gunfighter | Masters of the pistol |
| Mercenary | Hired guns who know the value of money |
| Overseer | Skilled managers of multiple workers |
| Performer | Showmanship and misdirection experts |
| Pioneer | Hardy adventurers; survive in any environment |
| Scrapper | Fearless melee combatants |
| Tinkerer | Construct-creation spellcasters |
| Wastrel | Gamblers who can gamble with their own fate |

---

### Step 11 — Derived Aspects

Calculate from Aspects and Skills. These stats **rarely increase** during play.

| Derived Aspect | Formula |
|---|---|
| `Defense` | `2 + max(Evade Skill, Speed Aspect)` — minimum 2 |
| `Willpower` | `2 + max(Centering Skill, Tenacity Aspect)` — minimum 2 |
| `Initiative` | `Speed Aspect + Notice Skill ranks` *(added to Initiative flip)* |
| `Wounds` | `4 + Toughness Skill + ceil(Resilience / 2)` *(only if Resilience > 0)* |
| `Walk` | `4 + round_toward_character(Speed Aspect / 2)` |
| `Charge` | `max(Walk, 4 + Speed Aspect)` |
| `Height` | `2` *(fixed for adult human characters)* |
| `Characteristics` | `Living`, `Fated` |

> **Derived Aspects and Skill Suits**: If a Skill (e.g., Evade or Centering) is used to derive an Aspect, any **suit** associated with that Skill is also included in the Derived Aspect. However, bonus flips (+) to the Skill do **not** carry over to the Derived Aspect.

---

### Step 12 — Talent

The character gains **1 General Talent** (from Chapter 6 or Fatemaster-approved source).

---

### Step 13 — Equipment

- Start with **10 Guild Scrip (§)**
- Spend on equipment from Chapter 7 or approved expansion books
- Ranged weapon purchases include: **ammo for 5 full reloads or 10 rounds** (whichever is greater)
- Pursuit Starting Bonus may provide additional equipment
  - If Starting Bonus includes a **Grimoire**: must also choose a **Magical Theory** and the Grimoire's **Magia and Immuto**
- Character also has: lodging, food, clothing (narrative; no scrip cost)

---

### Step 14 — Twist Deck

A Twist Deck is the character's personal deck of **13 cards** used to alter Fate.

- All **4 suits must be represented**: Rams, Crows, Tomes, Masks

#### Suit Meanings

| Suit | Symbol | Represents | Associated Faction |
|---|---|---|---|
| Rams | R | Order, active force, sustained effort | Guild |
| Crows | C | Entropy, decay, corruption | Resurrectionists |
| Tomes | t | Learning, understanding, knowledge | Arcanists |
| Masks | M | Deception, trickery, madness, secrets | Neverborn |

#### Suit Roles and Cards Added

| Role | Cards Added (values) |
|---|---|
| **Defining Suit** | 1, 5, 9, 13 |
| **Ascendant Suit** | 4, 8, 12 |
| **Center Suit** | 3, 7, 11 |
| **Descendant Suit** | 2, 6, 10 |

> Assign each of the 4 suits to exactly one role. Twist Decks do not change as the character advances. Spellcasters should consider which suits are required by their intended Magia.

---

## Cross Roads Tarot — Card Layout

During creation, cards are placed in a cross pattern:

```
        [Root Card]
           (top)
[Body]  [Station]  [Mind]
(left)  (center)  (right)
       [Endeavor]
        (bottom)
```

Destiny is read in this order: Endeavor → Mind → Root → Body → Station.

---

## Example Character: Brett Pembleton

| Step | Card Flipped | Result |
|---|---|---|
| Station | 4♦ (Tome) | Accountant; Station Skill = Mathematics |
| Body | 6♣ (Crow) | -2/0/+1/+1 → Grace=-2, Speed=0, Might=+1, Resilience=+1 |
| Root Skills | 10♥ (Ram) | 2,2,2,2,1 → History 2, Literacy 2, Intimidate 2, Pugilism 2, Athletics 1 |
| Mind | 10♠ (Mask) | -1/-1/-1/+2 → Tenacity=+2, Charm=-1, Cunning=-1, Intellect=-1 |
| Endeavor Skills | 6♠ (Mask) | 3,2,1,1,1,1 → Toughness 3, Carouse 2, Centering 1, Heavy Melee 1, Notice 1, Explosives 1 |
| Station Skills | — | Mathematics 1 (no prior ranks) |
| Modify | — | Cunning raised from -1 to +1 (2 points spent: +1 twice) |
| Pursuit | — | Drudge; Starting Bonus = pneumatic limb |
| Talent | — | Armor Training (negates Defense penalty from pneumatic limb armor) |
| Equipment | — | Rail Hammer (Mining Pick flavor) — 6§ spent |
| Twist Deck | — | Rams=Defining, Crows=Ascendant, Masks=Center, Tomes=Descendant |

### Brett's Derived Aspects

| Stat | Value | Calculation |
|---|---|---|
| Defense | 2 | 2 + max(Evade=0, Speed=0) |
| Willpower | 4 | 2 + max(Centering=1, Tenacity=2) |
| Initiative | 1 | Speed(0) + Notice(1) |
| Wounds | 8 | 4 + Toughness(3) + ceil(Resilience(1)/2)=1 |
| Walk | 4 | 4 + floor(Speed(0)/2) |
| Charge | 4 | max(Walk=4, 4+Speed(0)=4) |
| Height | 2 | Fixed for adult humans |
