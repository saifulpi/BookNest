import { Book } from '../types/book';

export const SAMPLE_BOOKS: Book[] = [
  {
    id: 'pride-and-prejudice',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A masterpiece of romantic wit, societal manners, and character evolution between Elizabeth Bennet and Mr. Fitzwilliam Darcy in Regency England.',
    format: 'builtin',
    coverUrl: '/src/assets/images/cover_pride_prejudice_1793370332865.jpg',
    genre: 'Fiction',
    collectionId: 'classics',
    addedAt: Date.now() - 86400000 * 7,
    lastReadAt: Date.now() - 3600000 * 2,
    currentPage: 1,
    totalPages: 32,
    readingTimeSeconds: 2420,
    isCompleted: false,
    chapters: [
      {
        id: 'pap-ch-1',
        title: 'Chapter I',
        content: `It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.

However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered as the rightful property of some one or other of their daughters.

"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?"

Mr. Bennet replied that he had not.

"But it is," returned she; "for Mrs. Long has just been here, and she told me all about it."

Mr. Bennet made no answer.

"Do you not want to know who has taken it?" cried his wife impatiently.

"You want to tell me, and I have no objection to hearing it."

This was invitation enough.

"Why, my dear, you must know, Mrs. Long says that Netherfield is taken by a young man of large fortune from the north of England; that he came down on Monday in a chaise and four to see the place, and was so much delighted with it, that he agreed with Mr. Morris immediately; that he is to take possession before Michaelmas, and some of his servants are to be in the house by the end of next week."

"What is his name?"

"Bingley."

"Is he married or single?"

"Oh! Single, my dear, to be sure! A single man of large fortune; four or five thousand a year. What a fine thing for our girls!"

"How so? How can it affect them?"

"My dear Mr. Bennet," replied his wife, "how can you be so tiresome! You must know that I am thinking of his marrying one of them."`
      },
      {
        id: 'pap-ch-2',
        title: 'Chapter II',
        content: `Mr. Bennet was among the earliest of those who waited on Mr. Bingley. He had always intended to visit him, though to the last always assuring his wife that he should not go; and till the evening after the visit was paid she had no knowledge of it.

It was then disclosed in the following manner. Observing his second daughter employed in trimming a hat, he suddenly addressed her with:

"I hope Mr. Bingley will like it, Lizzy."

"We are not in a way to know what Mr. Bingley likes," said her mother resentfully, "since we are not to visit."

"But you forget, mamma," said Elizabeth, "that we shall meet him at the assemblies, and that Mrs. Long promised to introduce him."

"I do not believe Mrs. Long will do any such thing. She has two nieces of her own. She is a selfish, hypocritical woman, and I have no opinion of her."

"No more have I," said Mr. Bennet; "and I am glad to find that you do not depend on her serving you."

Mrs. Bennet deigned not to make any reply, but, unable to contain herself, began scolding one of her daughters.

"Don't keep coughing so, Kitty, for heaven's sake! Have a little compassion on my nerves. You tear them to pieces."

"Kitty has no discretion in her coughs," said her father; "she times them ill."

"I do not cough for my own amusement," replied Kitty fretfully. "When is your next ball to be, Lizzy?"

"To-morrow fortnight."

"Aye, so it is," cried her mother, "and Mrs. Long does not come back till the day before; so it will be impossible for her to introduce him, for she will not know him herself."

"Then, my dear, you may have the advantage of your friend, and introduce Mr. Bingley to her."

"Impossible, Mr. Bennet, impossible, when I am not acquainted with him myself; how can you be so teasing?"`
      },
      {
        id: 'pap-ch-3',
        title: 'Chapter III',
        content: `Not all that Mrs. Bennet, however, with the assistance of her five daughters, could ask on the subject, was sufficient to draw from her husband any satisfactory description of Mr. Bingley. They attacked him in various ways—with barefaced questions, ingenious suppositions, and distant surmises; but he eluded the skill of them all, and they were at last obliged to accept the second-hand intelligence of their neighbour, Lady Lucas.

Her report was highly favourable. Sir William had been delighted with him. He was quite young, wonderfully handsome, extremely agreeable, and, to crown the whole, he meant to be at the next assembly with a large party. Nothing could be more delightful! To be fond of dancing was a certain step towards falling in love; and very lively hopes of Mr. Bingley's heart were entertained.

The assembly at Meryton was crowded. Mr. Bingley was good-looking and gentlemanlike; he had a pleasant countenance, and easy, unaffected manners. His sisters were fine women, with an air of decided fashion. His brother-in-law, Mr. Hurst, merely looked the gentleman; but his friend Mr. Darcy soon drew the attention of the room by his fine, tall person, handsome features, noble mien, and the report which was in general circulation within five minutes after his entrance, of his having ten thousand a year.

The gentlemen pronounced him to be a fine figure of a man, the ladies declared he was much handsomer than Mr. Bingley, and he was looked at with great admiration for about half the evening, till his manners gave a disgust which turned the tide of his popularity; for he was discovered to be proud; to be above his company, and above being pleased; and not all his large estate in Derbyshire could then save him from having a most forbidding, disagreeable countenance, and being unworthy to be compared with his friend.`
      }
    ]
  },
  {
    id: 'the-great-gatsby',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A dazzling tale of the Roaring Twenties, unrequited love, the illusion of the American Dream, and the tragic mystery of Jay Gatsby.',
    format: 'builtin',
    coverUrl: '/src/assets/images/cover_great_gatsby_1793370333408.jpg',
    genre: 'Fiction',
    collectionId: 'favorites',
    addedAt: Date.now() - 86400000 * 5,
    lastReadAt: Date.now() - 3600000 * 18,
    currentPage: 4,
    totalPages: 28,
    readingTimeSeconds: 1850,
    isCompleted: false,
    chapters: [
      {
        id: 'gatsby-ch-1',
        title: 'Chapter 1',
        content: `In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.

"Whenever you feel like criticizing any one," he told me, "just remember that all the people in this world haven't had the advantages that you've had."

He didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I'm inclined to reserve all judgements, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.

Reserving judgements is a matter of infinite hope. I am still a little afraid of missing something if I forget that, as my father snobbishly suggested, and I snobbishly repeat, a sense of the fundamental decencies is parcelled out unequally at birth.

And, after boasting this way of my tolerance, I come to the admission that it has a limit. Conduct may be founded on the hard rock or the wet marshes, but after a certain point I don't care what it's founded on. When I came back from the East last autumn I felt that I wanted the world to be in uniform and at a sort of moral attention forever; I wanted no more riotous excursions with privileged glimpses into the human heart.

Only Gatsby, the man who gives his name to this book, was exempt from my reaction—Gatsby, who represented everything for which I have an unaffected scorn. If personality is an unbroken series of successful gestures, then there was something gorgeous about him, some heightened sensitivity to the promises of life, as if he were related to one of those intricate machines that register earthquakes ten thousand miles away.`
      },
      {
        id: 'gatsby-ch-2',
        title: 'Chapter 2',
        content: `About half-way between West Egg and New York the motor road hastily joins the railroad and runs beside it for a quarter of a mile, so as to shrink away from a certain desolate area of land. This is a valley of ashes—a fantastic farm where ashes grow like wheat into ridges and hills and grotesque gardens; where ashes take the forms of houses and chimneys and rising smoke and, finally, with a transcendent effort, of men who move dimly and already crumbling through the powdery air.

Occasionally a line of gray cars crawls along an invisible track, gives out a ghastly creak, and comes to rest, and immediately the ash-gray men swarm up with leaden spades and stir up an impenetrable cloud, which screens their obscure operations from your sight.

But above the gray land and the spasms of bleak dust which drift endlessly over it, you perceive, after a moment, the eyes of Doctor T. J. Eckleburg. The eyes of Doctor T. J. Eckleburg are blue and gigantic—their irises are one yard high. They look out of no face, but, instead, from a pair of enormous yellow spectacles which pass over a non-existent nose. Evidently some wild wag of an oculist set them there to fatten his practice in the borough of Queens, and then sank down himself into eternal blindness, or forgot them and moved away.`
      }
    ]
  },
  {
    id: 'meditations-marcus-aurelius',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    description: 'Private spiritual and philosophical reflections of the Roman Emperor on duty, resilience, reason, humility, and the quiet harmony of the cosmos.',
    format: 'builtin',
    coverUrl: '/src/assets/images/cover_meditations_1793370334389.jpg',
    genre: 'Philosophy',
    collectionId: 'philosophy',
    addedAt: Date.now() - 86400000 * 12,
    lastReadAt: Date.now() - 86400000 * 1,
    currentPage: 8,
    totalPages: 24,
    readingTimeSeconds: 3100,
    isCompleted: false,
    chapters: [
      {
        id: 'med-book-1',
        title: 'Book I – Debts and Lessons',
        content: `From my grandfather Verus: I learned to relish all that was good in his character and to follow the example of his mild and calm temper.

From my mother: piety, and beneficence, and abstinence, not only from evil deeds, but even from evil thoughts; and further, simplicity in my way of living, far removed from the habits of the rich.

From my great-grandfather: not to have frequented public schools, and to have had good teachers at home, and to know that on such things a man should spend liberally.

From my governor: to be neither of the green nor of the blue faction at the games in the Circus, nor a partizan either of the Parmularius or the Scutarius at the gladiators' fights; from him too I learned endurance of labour, and to want little, and to work with my own hands, and not to meddle with other people's affairs, and not to be ready to listen to slander.

From Diognetus: not to busy myself about trifling things, and not to give credit to what was said by miracle-workers and jugglers about incantations and the driving away of daemons and such things; and not to breed quails for fighting, nor to give myself up to such passions.`
      },
      {
        id: 'med-book-2',
        title: 'Book II – Morning Contemplation',
        content: `When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly. They are like this because they cannot distinguish good from evil.

But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own—not of the same blood or birth, but the same mind, and possessing a share of the divine. And so none of them can hurt me. No one can implicate me in ugliness. Nor can I feel angry at my relative, or hate him. We were made to work together like feet, hands, and eyes, like the two rows of teeth, upper and lower. To obstruct each other is unnatural. To feel anger at someone, to turn your back on him: these are obstructions.

Whatever this is that I am, it is a little flesh and breath, and the ruling part. Despise the flesh: blood and bones and a network, a jumble of nerves, veins, and arteries. Consider the breath: wind, constantly changing, expelled and sucked back again. The third part is the ruling power. Put away your books; distract yourself no longer; they are not allowed. As one already dying, think: You are an old man; do not let this any longer be a slave, or pulled about by selfish impulse, or fret at your present lot, or shrink from the future.`
      }
    ]
  },
  {
    id: 'frankenstein-shelley',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    description: 'The pioneering gothic science fiction classic exploring ambition, creation, isolation, and humanity through Victor Frankenstein and his sentient creation.',
    format: 'builtin',
    coverUrl: '/src/assets/images/cover_frankenstein_1793370335365.jpg',
    genre: 'Fiction',
    collectionId: 'classics',
    addedAt: Date.now() - 86400000 * 20,
    lastReadAt: Date.now() - 86400000 * 3,
    currentPage: 15,
    totalPages: 36,
    readingTimeSeconds: 4200,
    isCompleted: false,
    chapters: [
      {
        id: 'frank-letter-1',
        title: 'Letter I – St. Petersburgh',
        content: `To Mrs. Saville, England.
Dec. 11th, 17—

You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.

I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. Do you understand this feeling? This breeze, which has travelled from the regions towards which I am advancing, gives me a foretaste of those icy climes. Inspirited by this wind of promise, my daydreams become more fervent and vivid.

I try in vain to be persuaded that the pole is the seat of frost and desolation; it ever presents itself to my imagination as the region of beauty and delight. There, Margaret, the sun is for ever visible, its broad disk just skirting the horizon and diffusing a perpetual splendour. There—for with your leave, my sister, I will put some trust in preceding navigators—there snow and frost are banished; and, sailing over a calm sea, we may be wafted to a land surpassing in wonders and in beauty every region hitherto discovered on the habitable globe.`
      },
      {
        id: 'frank-ch-4',
        title: 'Chapter IV – The Spark of Being',
        content: `It was on a dreary night of November that I beheld the accomplishment of my toils. With an anxiety that almost amounted to agony, I collected the instruments of life around me, that I might infuse a spark of being into the lifeless thing that lay at my feet. It was already one in the morning; the rain pattered dismally against the panes, and my candle was nearly burnt out, when, by the glimmer of the half-extinguished light, I saw the dull yellow eye of the creature open; it breathed hard, and a convulsive motion agitated its limbs.

How can I describe my emotions at this catastrophe, or how delineate the wretch whom with such infinite pains and care I had endeavoured to form? His limbs were in proportion, and I had selected his features as beautiful. Beautiful! Great God! His yellow skin scarcely covered the work of muscles and arteries beneath; his hair was of a lustrous black, and flowing; his teeth of a pearly whiteness; but these luxuriances only formed a more horrid contrast with his watery eyes, that seemed almost of the same colour as the dun-white sockets in which they were set, his shrivelled complexion and straight black lips.`
      }
    ]
  }
];

export const INITIAL_COLLECTIONS = [
  { id: 'all', name: 'All Books', isSystem: true },
  { id: 'favorites', name: 'Personal Favorites', description: 'Curated gems you love to reread' },
  { id: 'classics', name: 'Classics & Fiction', description: 'Timeless literary masterworks' },
  { id: 'philosophy', name: 'Philosophy & Wisdom', description: 'Stoic thought, ethics, and non-fiction' },
  { id: 'completed', name: 'Completed', isSystem: true }
];
