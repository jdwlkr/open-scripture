import { OKFCrossRefEdge } from '../types/okf';

export const INITIAL_CROSS_REFERENCES: OKFCrossRefEdge[] = [
  // Creation & Creation in Christ / Genesis 1:1 connections
  {
    id: 'ref-1',
    sourceVerseId: 'GEN.1.1',
    targetVerseId: 'JHN.1.1',
    category: 'direct_quote',
    weight: 5,
    note: '"In the beginning" direct parallel establishing Christ as the divine Word present at creation.'
  },
  {
    id: 'ref-2',
    sourceVerseId: 'GEN.1.1',
    targetVerseId: 'JHN.1.3',
    category: 'parallel_account',
    weight: 5,
    note: 'Creation by God through the Word: "All things were made by him."'
  },
  {
    id: 'ref-3',
    sourceVerseId: 'GEN.1.1',
    targetVerseId: 'HEB.1.2',
    category: 'topical_echo',
    weight: 4,
    note: 'God created the worlds through His Son.'
  },
  {
    id: 'ref-4',
    sourceVerseId: 'GEN.1.1',
    targetVerseId: 'REV.4.11',
    category: 'topical_echo',
    weight: 4,
    note: 'Worship of God the Creator who created all things for His pleasure.'
  },

  // Genesis 1:3 & Light
  {
    id: 'ref-5',
    sourceVerseId: 'GEN.1.3',
    targetVerseId: '2CO.4.6',
    category: 'direct_quote',
    weight: 5,
    note: 'Paul quotes God commanding light to shine out of darkness to describe spiritual regeneration.'
  },
  {
    id: 'ref-6',
    sourceVerseId: 'GEN.1.3',
    targetVerseId: 'JHN.1.4',
    category: 'topical_echo',
    weight: 4,
    note: 'The Life was the light of men.'
  },

  // Messianic Virgin Birth Prophecy: Isaiah 7:14 -> Matthew 1:23
  {
    id: 'ref-7',
    sourceVerseId: 'ISA.7.14',
    targetVerseId: 'MAT.1.23',
    category: 'prophecy_fulfillment',
    weight: 5,
    note: 'Direct fulfillment of the prophecy of the virgin birth and Immanuel.'
  },
  {
    id: 'ref-8',
    sourceVerseId: 'ISA.7.14',
    targetVerseId: 'LUK.1.31',
    category: 'prophecy_fulfillment',
    weight: 5,
    note: 'Gabriel announces the miraculous birth of Jesus to Mary.'
  },

  // Suffering Servant Prophecy: Isaiah 53 -> Gospels & Epistles
  {
    id: 'ref-9',
    sourceVerseId: 'ISA.53.5',
    targetVerseId: '1PE.2.24',
    category: 'direct_quote',
    weight: 5,
    note: '"By whose stripes ye were healed" quoted by Peter regarding Christ bearing our sins.'
  },
  {
    id: 'ref-10',
    sourceVerseId: 'ISA.53.6',
    targetVerseId: '1PE.2.25',
    category: 'topical_echo',
    weight: 4,
    note: 'Wandering like sheep returned unto the Shepherd and Bishop of our souls.'
  },

  // Divine Name: Exodus 3:14 -> John 8:58
  {
    id: 'ref-11',
    sourceVerseId: 'EXO.3.14',
    targetVerseId: 'JHN.8.58',
    category: 'direct_quote',
    weight: 5,
    note: 'Jesus claims the divine name "I AM" (Ego Eimi) before Abraham was.'
  },

  // Psalm 110:1 Messianic King -> Matthew 22:44 & Hebrews 1:13
  {
    id: 'ref-12',
    sourceVerseId: 'PSA.110.1',
    targetVerseId: 'MAT.22.44',
    category: 'direct_quote',
    weight: 5,
    note: 'Jesus quotes David calling the Messiah "Lord" to confound the Pharisees.'
  },
  {
    id: 'ref-13',
    sourceVerseId: 'PSA.110.1',
    targetVerseId: 'HEB.1.13',
    category: 'direct_quote',
    weight: 5,
    note: 'The Father exalting the Son to His right hand above angels.'
  },

  // Alpha and Omega: Revelation 1:8 -> Isaiah 44:6 & Revelation 22:13
  {
    id: 'ref-14',
    sourceVerseId: 'REV.1.8',
    targetVerseId: 'ISA.44.6',
    category: 'parallel_account',
    weight: 5,
    note: '"I am the first and I am the last; and beside me there is no God."'
  },
  {
    id: 'ref-15',
    sourceVerseId: 'REV.1.8',
    targetVerseId: 'REV.22.13',
    category: 'parallel_account',
    weight: 5,
    note: 'Christ reiterates "I am Alpha and Omega, the beginning and the end, the first and the last."'
  },

  // New Creation: Genesis 1:1 -> Revelation 21:1
  {
    id: 'ref-16',
    sourceVerseId: 'GEN.1.1',
    targetVerseId: 'REV.21.1',
    category: 'parallel_account',
    weight: 5,
    note: 'Bookend of Scripture: Original creation of heaven/earth and the New Heaven & New Earth.'
  }
];
