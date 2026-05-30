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

## Cross Roads Tarot Reference Tables

> **Card notation**: A=Ace, 2–13 (13=King). Suits: R=Rams, t=Tomes, c=Crows, M=Masks.

### Station Card

| Card | Station | Station Skill | Station Fate |
|---|---|---|---|
| Red Joker | Neverborn Stolen | Counter-Spelling | and you will die. |
| AR | Convict | Shotgun | and you will hear the whispers beyond. |
| 2R | Cook | Culinary | and you will forget yourself. |
| 3R | Laborer | Athletics | and you will kiss the crown. |
| 4R | Servant | Stealth | and you cleave the sky in vain. |
| 5R | Shopkeep | Barter | and your heart will stop on the thirteenth chime. |
| 6R | Blacksmith | Blacksmithing | and she will turn from you, forever. |
| 7R | Reporter | Scrutiny | and the arches will crumble. |
| 8R | Trapper | Track | and he will be paid his price. |
| 9R | Barrister | Bureaucracy | and you take the last step. |
| 10R | Enforcer | Intimidate | and it dreams of you. |
| 11R | Administrator | Leadership | and she is part gore and part kin. |
| 12R | Academic | Literacy | and the motion stutters and shudders. |
| 13R | Ortega | Pistol | and he will watch you drink the venom. |
| At | Miner | Explosives | and you cannot remove the red. |
| 2t | Archeologist | History | and it will herald the sinister revolution. |
| 3t | Magewright | Enchanting | and she will mourn you all of her days. |
| 4t | Accountant | Mathematics | and the torch will sputter into darkness. |
| 5t | Bookbinder | Printing | and it will be the feast of ages. |
| 6t | Manufacturing | Pneumatic | and you will thrice damn him. |
| 7t | Caretaker | Notice | and it cackles from the locket. |
| 8t | Alchemist | Alchemistry | and she bears the fruit of your absolution. |
| 9t | Performer | Acrobatics | and only your brothers will stand at your side. |
| 10t | Constable | Melee | and he is to you as the hermit is to the forest. |
| 11t | Engineer | Engineering | and you will drive the chariot of winter. |
| 12t | Mad Scientist | Artefacting | and it is the Emperor who will bring the gift. |
| 13t | Arcanist | Sorcery | and she will kiss the hanged man's lips. |
| Ac | Undead | Centering | and you will call upon the crow. |
| 2c | Orphan | Evade | and the end will come to all. |
| 3c | Dabbler | Prestidigitation | and you will be maimed. |
| 4c | Soldier | Heavy Guns | and the mage's knee bends before your river. |
| 5c | Hermit | Wilderness | and the noose will snap like thunder. |
| 6c | Mortuary Staff | Stitching | and with a whisper you will sunder the walls. |
| 7c | Outlaw | Toughness | and the penny paid is thrice earned. |
| 8c | Mercenary | Athletics | and you will burn the oldest page. |
| 9c | Veterinary | Husbandry | and the crime that you hide will destroy you. |
| 10c | Assassin | Long Arms | and you are a breeze unto the leaves. |
| 11c | Artist | Art | and you will let your blood run cold. |
| 12c | Medical | Doctor | and you seek the sound of your last breath. |
| 13c | Graverobber | Necromancy | and you stumble upon the line of life and death. |
| AM | Hustler | Forgery | and obliteration's touch will be gentle. |
| 2M | Harlot | Bewitch | and so the circle will be completed. |
| 3M | Busker | Music | and you will risk everything to roll the dice. |
| 4M | Settler | Homesteading | and you will splinter the white door. |
| 5M | Thief | Pick Pocket | and you will fall. |
| 6M | Sailor | Stitching | and the joy of madness will claim you. |
| 7M | Hawker | Barter | and you will unshackle the prisoner. |
| 8M | Cartographer | Wilderness | and the willful earns his due. |
| 9M | Burglar | Lockpicking | and you will deal with the devil. |
| 10M | Infiltrator | Deceive | and you will murder the deserving. |
| 11M | Sharp | Gambling | and it shoulders aside the guardian. |
| 12M | Politician | Convince | and the eyes in the darkness change you. |
| 13M | Ten Thunders | Martial Arts | and the Empress will know the traitor. |
| Black Joker | Bayou Born | Carouse | and you will be unmade. |

---

### Body Card

Physical Aspects are listed as four values to freely assign to `Might`, `Grace`, `Speed`, `Resilience`.

| Card | Physical Aspects | Body Fate |
|---|---|---|
| Red Joker | -1/-1/-1/+3 | Then, in the middle of none, there was one |
| AR | -3/-1/+1/+3 | At last you give yourself up to the pyres |
| 2R | -2/-2/+2/+2 | You turn the wheel and move the stone |
| 3R | -2/-1/+1/+2 | Hence, the dried lands are watered with the blood of sinners |
| 4R | -2/0/0/+2 | The ravens will bless your children |
| 5R | -2/0/+1/+1 | At last, you will sacrifice her on the altars of desperation |
| 6R | -2/-1/0/+2 | You will hold the myth of life in your hands |
| 7R | -1/-1/-1/+3 | He tightens the strings and tugs at the rivets |
| 8R | -2/-1/+1/+2 | The games you play are more deadly than she wishes |
| 9R | -2/0/0/+2 | The other place beckons with the voice of oblivion |
| 10R | -1/-1/-1/+2 | You will watch as they fall one by one to the ground |
| 11R | 0/0/0/0 | The shards you pass through leave a bloody trail |
| 12R | -1/0/0/+1 | The light fades as the final feast begins |
| 13R | -1/0/0/+1 | The circle will bind as well as the grave |
| At | -3/0/0/+3 | The grave spirit will call to you on a spring song |
| 2t | -3/-1/+2/+2 | The end will find him in the garden |
| 3t | -2/-2/+2/+2 | The pale-faced innocent will drown in bile |
| 4t | -2/-1/+1/+2 | You will shatter the hourglass |
| 5t | -1/-1/0/+2 | You will step through the looking glass |
| 6t | -3/0/+1/+2 | The dogs in the vineyard bellow for you to hunt |
| 7t | -1/-1/+1/+1 | Only the penitent shall tread the winding path |
| 8t | -1/0/0/+1 | The empty mind will know the lie from the judgment |
| 9t | -1/-1/0/+2 | The reflection in the water shows the truth |
| 10t | -1/-1/+1/+1 | The end's a miracle that you dare to dream |
| 11t | -1/0/0/+1 | She will search for the lion of the valley |
| 12t | -3/0/0/+3 | Lunatics fear where you will stalk |
| 13t | -2/0/0/+2 | Worlds of marble turn flesh again |
| Ac | -3/0/0/+3 | Denying the battle will win the war |
| 2c | -3/0/+1/+2 | The mask donned for peace will blind you to bloodshed |
| 3c | -2/-1/+1/+2 | The song will end beyond the thrice knocked wall |
| 4c | -2/-1/0/+2 | The chime of your blunder will ring through the village |
| 5c | -2/0/0/+2 | Only in death will the pilgrim be free |
| 6c | -2/0/+1/+1 | The sands of waters will make you clean |
| 7c | -1/-1/0/+2 | Poison will be the cure |
| 8c | -2/-1/0/+2 | The blind woman must lead the seeker |
| 9c | -1/-1/+1/+1 | The blood-stained cheeks will weave the grasses |
| 10c | -1/-1/0/+2 | Frozen hearths crawl along the stone |
| 11c | -1/0/0/+1 | The leaves will whisper your name |
| 12c | -1/0/0/+1 | All of the screams will lead you home |
| 13c | -2/+1/+1/+1 | The mute man must cry out for the wolf |
| AM | -3/-1/+1/+3 | Spirits run sour in your veins |
| 2M | -2/-2/+2/+2 | She drinks only blood |
| 3M | -2/-1/+1/+2 | Love knows not the heart but the bosom |
| 4M | -2/0/0/+2 | Sinister and black beneath the rain |
| 5M | -3/0/+1/+2 | The red woman will light the path |
| 6M | -2/-1/0/+2 | The reflection in the water shows the truth |
| 7M | -1/-1/-1/+3 | An abyss opens beneath your cradle |
| 8M | -1/-1/0/+2 | They sing for laughter, tears, and tomorrow |
| 9M | -1/-1/0/+2 | The deaf man must hear the owl's warning |
| 10M | -1/-1/-1/+2 | Burlap and steel are bound in darkness |
| 11M | 0/0/0/0 | The grave did not hold her |
| 12M | -1/0/0/+1 | The halo slips around your throat like a noose |
| 13M | -2/0/+1/+1 | The sisters will show the way |
| Black Joker | -2/-2/-2/+4 | You will carry the seed of a thousand-fold damnations |

---

### Root Card

Skill values are a pool of ranks freely assigned to any Skills (childhood learning).

| Card | Skill Ranks | Root Fate |
|---|---|---|
| Red Joker | 3,3,3 | and upon wings of fear you will approach the tower. |
| AR | 3,3,2,1 | but the people in the windows will greet you with terror. |
| 2R | 3,3,1,1,1 | for the gloom will deny that it knows you. |
| 3R | 3,3,1,1,1 | but fear the shadow cast by no man. |
| 4R | 3,2,2,1 | and the sullen stars align for you. |
| 5R | 3,2,2,1 | but welcome the song of frozen winter. |
| 6R | 3,2,1,1,1,1 | but the gathering will mock your gift. |
| 7R | 3,2,1,1,1,1 | for the coldest court will bow to their king. |
| 8R | 3,1,1,1,1,1,1 | and the moon shines upon the forgotten forest. |
| 9R | 3,1,1,1,1,1,1 | and you will come to fear the red letter. |
| 10R | 2,2,2,2,1 | and you will drown in the sorrow of yesterday. |
| 11R | 2,2,2,2,1 | and there will be naught but ashes upon your tongue. |
| 12R | 2,2,2,1,1,1 | for you know that a long life is a hundred curses. |
| 13R | 2,2,2,1,1,1 | and she knows. |
| At | 3,3,2,1 | but your misfortune will not be your own. |
| 2t | 3,2,2,2,1 | as the witless man fears the child. |
| 3t | 3,2,2,2,1 | for the hunter shall lay down to sleep upon the lilies. |
| 4t | 3,3,2,1,1 | and the forgotten shall be recalled. |
| 5t | 3,3,2,1,1 | but his smile shall never fade. |
| 6t | 3,2,2,1 | as the jester dances where he will. |
| 7t | 3,2,2,1 | for your secrets are not yours alone. |
| 8t | 3,2,1,1,1,1 | and the page turned is empty of promises. |
| 9t | 3,2,1,1,1,1 | but heed the cripple who speaks for the coin. |
| 10t | 3,1,1,1,1,1,1 | as the dead rise by your fist. |
| 11t | 3,1,1,1,1,1,1 | for you will be reborn in soot and flames. |
| 12t | 2,2,2,1,1,1 | but you know this has all happened before. |
| 13t | 2,2,2,1,1,1 | and the lost will drag you into the depths. |
| Ac | 3,3,2,1 | for you must dredge the waters until the just give up their dead. |
| 2c | 3,3,1,1,1 | and the wolf will howl at the door. |
| 3c | 3,3,1,1,1 | but everything rots away in the end. |
| 4c | 3,2,2,1 | and you will leave her hanging. |
| 5c | 3,2,2,1 | but there is no mercy in her heart. |
| 6c | 3,2,1,1,1,1 | and time waits for no man but you. |
| 7c | 3,2,1,1,1,1 | but love was left behind. |
| 8c | 3,1,1,1,1,1,1 | and you will read the horror in the clouds below. |
| 9c | 3,1,1,1,1,1,1 | for not all treasures glimmer in the light. |
| 10c | 2,2,2,2,1 | and the reaper walks the path alongside you. |
| 11c | 2,2,2,2,1 | but the witch grows weary of your follies. |
| 12c | 2,2,2,1,1,1 | and wonders will surround your waking echoes. |
| 13c | 2,2,2,1,1,1 | for the stars illuminate your path. |
| AM | 3,3,2,1 | and you will be repaid thrice for the sins you have sold. |
| 2M | 3,2,1,1,1 | but there are dragons here. |
| 3M | 3,2,1,1,1 | and the living shall wither from your grasp. |
| 4M | 3,2,2,1 | for new enemies are made from old allies. |
| 5M | 3,2,2,1 | and you will pan the gutter's glitter. |
| 6M | 3,2,1,1,1,1 | and you will upset the delicate balance of lies. |
| 7M | 3,2,1,1,1,1 | and your steed will take you into the jousts of war. |
| 8M | 3,1,1,1,1,1,1 | for the silence brings inspiration at the door. |
| 9M | 3,1,1,1,1,1,1 | and you will find the other lands on the day she dies. |
| 10M | 2,2,2,2,1 | and you will leave your mark in many woes. |
| 11M | 2,2,2,2,1 | and you will remember the mirror and shatter the stream. |
| 12M | 2,2,2,1,1,1 | and the witches will wait for you at the crossroads. |
| 13M | 2,2,2,1,1,1 | but you are safe beneath the ice. |
| Black Joker | 2,2,2,2,2,2 | and your blood will run black. |

---

### Mind Card

Mental Aspects are listed as four values to freely assign to `Charm`, `Cunning`, `Intellect`, `Tenacity`.

| Card | Mental Aspects | Mind Fate |
|---|---|---|
| Red Joker | -1/-1/-1/+3 | your deeds will be undone before the thirteenth step |
| AR | -3/-1/+1/+3 | you will make dust of the ram's horns |
| 2R | -2/-2/+2/+2 | you will be bold when it is needed most |
| 3R | -2/-1/+1/+2 | your journey will never begin |
| 4R | -2/0/0/+2 | you will wait when you should act |
| 5R | -2/0/+1/+1 | the ground will rise to offer you upward |
| 6R | -2/-1/0/+2 | you will be the uninvited |
| 7R | -1/-1/-1/+3 | you will find the answer you cannot speak |
| 8R | -2/-1/+1/+2 | the melody will be lost within the gutters |
| 9R | -2/0/0/+2 | your shame will be as beaten as the hooves |
| 10R | -1/-1/-1/+2 | the cauldron-spawn will crawl to your birth |
| 11R | 0/0/0/0 | you will be the grape that sours the wine |
| 12R | -1/0/0/+1 | you will return with the balm for all ills |
| 13R | -1/0/0/+1 | you will invite him in |
| At | -3/0/0/+3 | the wondering hour will settle upon your hearth |
| 2t | -3/-1/+2/+2 | she will sit alone amongst your misery |
| 3t | -2/-2/+2/+2 | you will refuse the call |
| 4t | -2/-1/+1/+2 | an exception will corrupt the rule |
| 5t | -1/-1/0/+2 | your dance will draw the sleeping eye |
| 6t | -3/0/+1/+2 | the mud flows like a river into the sky |
| 7t | -1/-1/+1/+1 | you will bathe in the waters of rage |
| 8t | -1/0/0/+1 | she must lurk within your joyless paradise |
| 9t | -1/-1/0/+2 | the gloom will know you as a brother |
| 10t | -1/-1/+1/+1 | your eyes will be open unto the abyss |
| 11t | -1/0/0/+1 | you will fall from grace |
| 12t | -3/0/0/+3 | he will trust your falsehoods |
| 13t | -2/0/0/+2 | she strikes with daggers battered from your shield |
| Ac | -3/0/0/+3 | you will not be deceived by the ghosts of the tower |
| 2c | -3/0/+1/+2 | the sleeper dreams of your tomorrow |
| 3c | -2/-1/+1/+2 | you will be reborn of flesh and redemption |
| 4c | -2/-1/0/+2 | you will refuse to open the tome |
| 5c | -2/0/0/+2 | you will not heed the mentor |
| 6c | -2/0/+1/+1 | an open door will let him into the red chapel |
| 7c | -1/-1/0/+2 | your relic will rush and gleam |
| 8c | -2/-1/0/+2 | the sting of a single wasp will light the agony |
| 9c | -1/-1/+1/+1 | she will sicken to the blessed touch |
| 10c | -1/-1/0/+2 | an anvil of the horde will ring with war |
| 11c | -1/0/0/+1 | your chime of warning will be drowned in voices |
| 12c | -1/0/0/+1 | you will run from the melancholy light |
| 13c | -2/+1/+1/+1 | you will shatter the stone |
| AM | -3/-1/+1/+3 | you will lead the children through the valley |
| 2M | -2/-2/+2/+2 | he will shade your tired eyes |
| 3M | -2/-1/+1/+2 | she is unknown to your memories |
| 4M | -2/0/0/+2 | the dusk of a new sun will light your steps into the cave |
| 5M | -3/0/+1/+2 | the peer of a thousand faces will weep |
| 6M | -2/-1/0/+2 | you will be asked three times and deny each |
| 7M | -1/-1/-1/+3 | you will take up the sword of your father |
| 8M | -1/-1/0/+2 | you will refuse deserved love |
| 9M | -1/0/0/+2 | he will abandon you at the moment of tragedy |
| 10M | -1/-1/-1/+2 | an empty grave will fill with melody |
| 11M | 0/0/0/0 | your ruination will hound your desperate exodus |
| 12M | -1/0/0/+1 | the last man will speak the lies of your glory |
| 13M | -2/0/+1/+1 | you will take an eye for the eye was taken |
| Black Joker | -2/-2/-2/+4 | your every breath will be as your last |

---

### Endeavor Card

Skill values are a pool of ranks freely assigned to Skills the character does not already possess (adult self-directed learning).

| Card | Skill Ranks | Endeavor Fate |
|---|---|---|
| Red Joker | 3,3,3 | Once you witness your golden sunset |
| AR | 3,3,2,1 | Should you choose to leave the coins behind |
| 2R | 3,3,1,1,1 | If you ignore the rope in the trees |
| 3R | 3,3,1,1,1 | When the seven gifts are opened |
| 4R | 3,2,2,1 | After the quiet of a thousand nights falls upon your ears |
| 5R | 3,2,2,1 | As upon your back you carry the brightest star into the shadows |
| 6R | 3,2,1,1,1,1 | Once you rise from the ashes |
| 7R | 3,2,1,1,1,1 | When your shadow is cast upon the wall |
| 8R | 3,1,1,1,1,1,1 | After the echoes of your laughter die |
| 9R | 3,1,1,1,1,1,1 | If you take oblivion's hand despite the warning |
| 10R | 2,2,2,2,1 | If you run when you should walk |
| 11R | 2,2,2,2,1 | As you walk backwards through the knife |
| 12R | 2,2,2,1,1,1 | If you choose to see no evil in the chiming of the hour |
| 13R | 2,2,2,1,1,1 | When you sup upon your pride and dance with cadavers |
| At | 3,3,2,1 | When the gears turn upon the story best forgotten |
| 2t | 3,2,2,2,1 | If you find the patience to spin silver thread into gold |
| 3t | 3,2,2,2,1 | If you refuse the hero's call |
| 4t | 3,3,2,1,1 | After the branch snaps beneath your sorrow |
| 5t | 3,3,2,1,1 | When you wake from the dream of ancestors |
| 6t | 3,2,2,1 | As your hands of flesh touch feet of steel |
| 7t | 3,2,2,1 | When you've traded away your beloved |
| 8t | 3,2,1,1,1,1 | Once your strangers travel in three |
| 9t | 3,2,1,1,1,1 | When you open the dead man's eyes |
| 10t | 3,1,1,1,1,1,1 | After you have seen the forever |
| 11t | 3,1,1,1,1,1,1 | Once you cross the bloody threshold |
| 12t | 2,2,2,1,1,1 | If justice finds you guilty of the only crime |
| 13t | 2,2,2,1,1,1 | As you walk the lonely road |
| Ac | 3,3,2,1 | Once the first has been last and the last has been first |
| 2c | 3,3,1,1,1 | When you accept your fates on the river |
| 3c | 3,3,1,1,1 | If you open the gate of wonder in the wall of lies |
| 4c | 3,2,2,1 | If you are unmourned by the father |
| 5c | 3,2,2,1 | After what is dead has died |
| 6c | 3,2,1,1,1,1 | Once your stains have been bound within |
| 7c | 3,2,1,1,1,1 | If you open the box best left closed |
| 8c | 3,1,1,1,1,1,1 | When at last you look upon your beating heart |
| 9c | 3,1,1,1,1,1,1 | As the hunter watches you swallow the maggots |
| 10c | 2,2,2,2,1 | If you allow the hands to pull you down |
| 11c | 2,2,2,2,1 | After you bleed the coal from the bones |
| 12c | 2,2,2,1,1,1 | As you strain to see through the high noon veil |
| 13c | 2,2,2,1,1,1 | When your death rattles at the door |
| AM | 3,3,2,1 | As the crimson writhes upon the belly of the fallen |
| 2M | 3,2,1,1,1 | If the autumn bridge shakes beneath your step |
| 3M | 3,2,1,1,1 | Should your power drown in the waters of deceit |
| 4M | 3,2,2,1 | Once the nemesis has become the mother |
| 5M | 3,2,2,1 | As the watcher awaits your cry of vengeance |
| 6M | 3,2,1,1,1,1 | When you are a stranger to yourself |
| 7M | 3,2,1,1,1,1 | After the reaper has come for innocence |
| 8M | 3,1,1,1,1,1,1 | Once your vendetta is nigh upon the mountains |
| 9M | 3,1,1,1,1,1,1 | When you choose between the quill or the blade |
| 10M | 2,2,2,2,1 | After you don the crimson silks |
| 11M | 2,2,2,2,1 | If you know the dimming of the lanterns |
| 12M | 2,2,2,1,1,1 | As the bell tolls for judgment |
| 13M | 2,2,2,1,1,1 | When hope drowns in but three tears |
| Black Joker | 2,2,2,2,2,2 | Once your soul has been stained by silence |

---

## Station Descriptions

Brief background descriptions for each Station. Use to inform character backstory.

| Station | Description |
|---|---|
| Academic | Parents were part of the intellectual elite: university professors, research scientists, or renowned scholars. |
| Accountant | Family earned its living in finance — working for a bank or serving as analysts for a wealthy patron or company. |
| Administrator | One or both parents managed operations for affluent and powerful people at sites removed from their patron's seat of power. |
| Alchemist | Family contained at least one talented alchemist who made a living creating complex medicines beyond simple herbal remedies. |
| Arcanist | One or both parents were secret members of the Arcanist organization, most likely involved in Earthside smuggling operations. |
| Archeologist | Childhood spent traveling between archaeological dig sites; little time for friends, but saw the world and learned about ancient civilizations. |
| Artist | Youth spent helping mix paint, tighten canvas, or prepare stone for chiseling; family contained at least one practicing artist. |
| Assassin | One parent was often away for long periods, always sending money home — until one day you learned why. |
| Barrister | One parent had a deep understanding of the legal system, arguing law in court rooms or board rooms. |
| Bayou Born | Raised by drunken, reckless Gremlins; probably no older than a teenager, or pulled through a small portal years before the Breach reopened. |
| Blacksmith | Youth spent helping a parent on the forge in a city, town, or large ranch. |
| Bookbinder | Family of ink-stained urban workers; comfortable income despite significant labor demands. |
| Burglar | Family (or at least one parent) specialized in robbing locations clean before disappearing into the night. |
| Busker | Family worked in groups entertaining crowds on busy streets for tips. |
| Caretaker | Calm childhood tending to gardens and homes of the affluent alongside a parent who was a gardener or butler. |
| Cartographer | One or both parents were mapmakers; childhood spent charting distances and transforming terrain into maps. |
| Constable | Parent enforced laws for a town, city, or government body; often taught children basic self-defense due to the dangers of the work. |
| Convict | Parents spent their lives cycling through the legal system — each release just another opportunity to commit another crime. |
| Cook | One parent worked in a high-society household or operated a small restaurant; childhood spent preparing and serving meals. |
| Dabbler | Family secretly traded in magical arts and esoteric tomes; you glimpsed snippets of power over your parents' shoulders. |
| Enforcer | Parent worked as brutal muscle for a powerful business or criminal organization. |
| Engineer | Parent designed bridges, buildings, and clockwork devices; well paid enough to afford educated children. |
| Graverobber | Family made its living robbing the graves of the wealthy dead; kept everyone fed and clothed. |
| Harlot | Parent turned to prostitution to keep the family fed. |
| Hawker | Family were traveling peddlers providing convenient if shady goods; many worked with street urchins for greater profit. |
| Hermit | Parents chose to live away from civilization; little social contact but a thorough education in wilderness survival. |
| Hustler | Family of confident tricksters who ran short and long grifts both on the road and in large cities. |
| Infiltrator | Family of spies; children trained to lie from a young age, the last to be suspected when espionage was discovered. |
| Laborer | Family worked long hours as common laborers — a hard life, but one some found dignity in. |
| Mad Scientist | Parent was wildly eccentric; childhood spent around odd machinery and listening to esoteric educational rants. |
| Magewright | Parent had minor magical talent and worked in a Guild enchanting factory, spending ten hours daily producing trinkets. |
| Manufacturing | Family employed in a large factory assembling mechanical components day in and day out; children assigned the smallest pieces. |
| Medical | One parent was a medical professional tending the sick and injured; family was likely well respected. |
| Mercenary | One or both parents were sell-swords providing military services for pay; you may have traveled with them or stayed behind. |
| Miner | Family worked powerful mining operations; children used to reach tight spots impossible for adults. Survival was not guaranteed. |
| Mortuary Staff | Running a mortuary as a family affair; children raised to take over the macabre but necessary business. |
| Neverborn Stolen | Childhood spent playing in the nightmares of other children with an animated teddy, until your dreams became reality and you were unleashed into Malifaux for some dark purpose. |
| Orphan | No family; childhood spent in city work houses or dodging truancy officials on the streets. |
| Ortega | Member of the extended Ortega family of Neverborn hunters; years of learning to spot Neverborn influence and cooperate on hunts. |
| Outlaw | Family roamed the wilderness between towns, robbing travelers and evading the law. |
| Performer | Family made its living singing, dancing, acting, and performing entertaining feats on stage or on the road. |
| Politician | One parent was a powerful political figure — senator, industrialist, or even royalty. |
| Reporter | One or both parents were journalists investigating powerful individuals or strange events, sometimes putting the family in danger. |
| Sailor | Childhood spent at sea with parents ferrying goods and passengers; exciting life with many ports of call. |
| Servant | Family served a wealthier household as maids and field labor; youth spent working alongside other servant children. |
| Settler | Family migrated to the wilderness and forged a homestead; stern but independent and proud parents. |
| Sharp | One parent made their living at card tables, either as a dealer or a player — on the road or in a single saloon. |
| Shopkeep | Family owned a shop of any kind; parents were respected in the community and the upbringing was comfortable. |
| Soldier | One or both parents were enlisted military; grew up in a fiercely patriotic and strict household. |
| Ten Thunders | Raised in a secretive clan of infiltrators and criminals; family practiced martial techniques from the Three Kingdoms. |
| Thief | One parent was an exceptionally skilled thief who was never caught — either through untraceable methods or sheer skill. |
| Trapper | Parents tracked animals for their pelts and set traps; childhood education in reading tracks and finding game trails. |
| Undead | Parents were dead but still present; odd childhood spent keeping the family secret. |
| Veterinary | Parent was a skilled veterinarian; summers spent helping birth calves and calming injured animal patients. |

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
