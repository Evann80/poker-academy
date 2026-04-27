/* ============================================================
   POKER ACADEMY — Shared JavaScript
   ============================================================ */

// ---- Subtab switching (used in cbet page) ----
function showSubtab(btn, id) {
  const parent = btn.closest('.card');
  parent.querySelectorAll('.subtabs button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  parent.querySelectorAll('.subtab-content').forEach(c => c.classList.remove('active'));
  parent.querySelector('#' + id).classList.add('active');
}

// ============================================================
// HAND / RANGE HELPERS
// ============================================================
const RANKS = ['A','K','Q','J','T','9','8','7','6','5','4','3','2'];

function handAt(r, c) {
  if (r === c) return RANKS[r] + RANKS[c];
  if (r < c) return RANKS[r] + RANKS[c] + 's';
  return RANKS[c] + RANKS[r] + 'o';
}

function expandPairs(min) {
  const idx = RANKS.indexOf(min);
  const pairs = [];
  for (let i = 0; i <= idx; i++) pairs.push(RANKS[i]+RANKS[i]);
  return pairs;
}

// ============================================================
// RANGE DATA
// ============================================================
const RANGES = {
  '6max': {
    rfi: {
      'UTG': {
        raise: new Set([
          ...expandPairs('6'),
          ...'ATs,AJs,AQs,AKs,KTs,KJs,KQs,QTs,QJs,JTs,T9s,98s,87s,76s'.split(','),
          'ATo','AJo','AQo','AKo','KJo','KQo','QJo'
        ])
      },
      'HJ': {
        raise: new Set([
          ...expandPairs('5'),
          ...'A2s,A3s,A4s,A5s,A6s,A7s,A8s,A9s,ATs,AJs,AQs,AKs'.split(','),
          ...'K8s,K9s,KTs,KJs,KQs'.split(','),
          ...'Q9s,QTs,QJs,J9s,JTs,T9s,98s,87s,76s'.split(','),
          'ATo','AJo','AQo','AKo','KTo','KJo','KQo','QTo','QJo','JTo'
        ])
      },
      'CO': {
        raise: new Set([
          ...expandPairs('4'),
          ...'A2s,A3s,A4s,A5s,A6s,A7s,A8s,A9s,ATs,AJs,AQs,AKs'.split(','),
          ...'K5s,K6s,K7s,K8s,K9s,KTs,KJs,KQs'.split(','),
          ...'Q7s,Q8s,Q9s,QTs,QJs,J8s,J9s,JTs,T8s,T9s,97s,98s,87s,76s,65s'.split(','),
          'A8o','A9o','ATo','AJo','AQo','AKo','KTo','KJo','KQo','QTo','QJo','JTo'
        ])
      },
      'BTN': {
        raise: new Set([
          ...expandPairs('2'),
          ...'A2s,A3s,A4s,A5s,A6s,A7s,A8s,A9s,ATs,AJs,AQs,AKs'.split(','),
          ...'K2s,K3s,K4s,K5s,K6s,K7s,K8s,K9s,KTs,KJs,KQs'.split(','),
          ...'Q4s,Q5s,Q6s,Q7s,Q8s,Q9s,QTs,QJs'.split(','),
          ...'J6s,J7s,J8s,J9s,JTs,T6s,T7s,T8s,T9s'.split(','),
          ...'96s,97s,98s,86s,87s,75s,76s,65s,54s'.split(','),
          ...'A4o,A5o,A6o,A7o,A8o,A9o,ATo,AJo,AQo,AKo'.split(','),
          'K8o','K9o','KTo','KJo','KQo','Q9o','QTo','QJo','J9o','JTo','T9o'
        ])
      },
      'SB': {
        raise: new Set([
          ...expandPairs('3'),
          ...'A2s,A3s,A4s,A5s,A6s,A7s,A8s,A9s,ATs,AJs,AQs,AKs'.split(','),
          ...'K4s,K5s,K6s,K7s,K8s,K9s,KTs,KJs,KQs'.split(','),
          ...'Q6s,Q7s,Q8s,Q9s,QTs,QJs,J7s,J8s,J9s,JTs'.split(','),
          ...'T7s,T8s,T9s,97s,98s,87s,76s,65s'.split(','),
          'A7o','A8o','A9o','ATo','AJo','AQo','AKo','KTo','KJo','KQo','QTo','QJo','JTo'
        ])
      }
    },
    bbdef: {
      'vs UTG': {
        raise: new Set(['AA','KK','QQ','JJ','AKs','AKo','AQs']),
        call: new Set([
          'TT','99','88','77','66','55',
          ...'AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s'.split(','),
          'AQo','AJo',
          ...'KQs,KJs,KTs,K9s,K8s,K7s'.split(','),
          'KQo','KJo',
          ...'QJs,QTs,Q9s'.split(','),
          'QJo',
          ...'JTs,J9s'.split(','),
          ...'T9s,T8s'.split(','),
          ...'98s,97s'.split(','),
          ...'87s,86s'.split(','),
          '76s','65s','54s'
        ])
      },
      'vs HJ': {
        raise: new Set(['AA','KK','QQ','JJ','TT','AKs','AKo','AQs','AJs','A5s','A4s']),
        call: new Set([
          '99','88','77','66','55','44',
          ...'ATs,A9s,A8s,A7s,A6s,A3s,A2s'.split(','),
          'AQo','AJo','ATo',
          ...'KQs,KJs,KTs,K9s,K8s,K7s,K6s'.split(','),
          'KQo','KJo',
          ...'QJs,QTs,Q9s,Q8s'.split(','),
          'QJo',
          ...'JTs,J9s,J8s'.split(','),
          ...'T9s,T8s'.split(','),
          ...'98s,97s'.split(','),
          ...'87s,86s'.split(','),
          '76s','75s','65s','64s','54s','53s','43s'
        ])
      },
      'vs CO': {
        raise: new Set(['AA','KK','QQ','JJ','TT','99','AKs','AKo','AQs','AQo','AJs','KQs','A5s','A4s','A3s']),
        call: new Set([
          '88','77','66','55','44','33',
          ...'ATs,A9s,A8s,A7s,A6s,A2s'.split(','),
          'AJo','ATo','A9o',
          ...'KJs,KTs,K9s,K8s,K7s,K6s,K5s'.split(','),
          'KQo','KJo','KTo',
          ...'QJs,QTs,Q9s,Q8s,Q7s'.split(','),
          'QJo','QTo',
          ...'JTs,J9s,J8s,J7s'.split(','),
          'JTo',
          ...'T9s,T8s,T7s'.split(','),
          ...'98s,97s,96s'.split(','),
          ...'87s,86s,85s'.split(','),
          '76s','75s','65s','64s','54s','53s','43s'
        ])
      },
      'vs BTN': {
        raise: new Set([
          'AA','KK','QQ','JJ','TT','99','88',
          ...'AKs,AKo,AQs,AQo,AJs,AJo,ATs,A9s,A8s,A5s,A4s,A3s,A2s'.split(','),
          'KQs','KQo','KJs','KTs','QJs','Q9s','J9s','T9s'
        ]),
        call: new Set([
          '77','66','55','44','33','22',
          ...'A7s,A6s'.split(','),
          'ATo','A9o','A8o','A7o',
          ...'K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s'.split(','),
          'KJo','KTo','K9o',
          ...'QTs,Q8s,Q7s,Q6s,Q5s'.split(','),
          'QJo','QTo','Q9o',
          ...'JTs,J8s,J7s,J6s'.split(','),
          'JTo','J9o',
          ...'T8s,T7s,T6s'.split(','),
          'T9o',
          ...'98s,97s,96s,95s'.split(','),
          ...'87s,86s,85s'.split(','),
          ...'76s,75s,74s'.split(','),
          '65s','64s','54s','53s','43s'
        ])
      },
      'vs SB': {
        raise: new Set([
          'AA','KK','QQ','JJ','TT','99','88','77',
          ...'AKs,AKo,AQs,AQo,AJs,AJo,ATs,ATo,A9s,A8s,A5s,A4s,A3s,A2s'.split(','),
          'KQs','KQo','KJs','KJo','KTs','K9s',
          'QJs','QTs','Q9s',
          'JTs','J9s','T9s','98s'
        ]),
        call: new Set([
          '66','55','44','33','22',
          ...'A7s,A6s'.split(','),
          'A9o','A8o','A7o','A6o','A5o',
          ...'K8s,K7s,K6s,K5s,K4s,K3s,K2s'.split(','),
          'KTo','K9o','K8o',
          ...'Q8s,Q7s,Q6s,Q5s,Q4s'.split(','),
          'QJo','QTo','Q9o',
          ...'J8s,J7s,J6s,J5s'.split(','),
          'JTo','J9o',
          ...'T8s,T7s,T6s'.split(','),
          'T9o','T8o',
          ...'97s,96s,95s'.split(','),
          '98o',
          ...'86s,85s,84s'.split(','),
          '87o',
          ...'75s,74s'.split(','),
          '76o',
          '65s','64s','63s','54s','53s','43s'
        ])
      }
    },
    '3bet': {
      'vs UTG': {
        raise: new Set(['AA','KK','QQ','JJ','AKs','AKo','AQs']),
        call: new Set([
          ...expandPairs('T').filter(p => !['AA','KK','QQ','JJ'].includes(p)),
          'AJs','ATs','KQs','QJs','JTs','T9s','98s','87s','76s'
        ])
      },
      'vs HJ': {
        raise: new Set(['AA','KK','QQ','JJ','TT','AKs','AKo','AQs','AJs']),
        call: new Set(['99','88','77','66','ATs','A5s','A4s','KQs','KJs','QJs','JTs','T9s','98s','87s','76s'])
      },
      'vs CO': {
        raise: new Set(['AA','KK','QQ','JJ','TT','AKs','AKo','AQs','AQo','AJs','KQs','A5s','A4s']),
        call: new Set(['99','88','77','66','55','ATs','A9s','A8s','KJs','KTs','QJs','QTs','JTs','T9s','98s','87s','76s','65s'])
      },
      'vs BTN': {
        raise: new Set(['AA','KK','QQ','JJ','TT','99','AKs','AKo','AQs','AQo','AJs','AJo','ATs','KQs','KQo','KJs','QJs','A5s','A4s','A3s']),
        call: new Set(['88','77','66','55','44','A9s','A8s','A7s','A6s','KTs','K9s','QTs','JTs','T9s','98s','87s','76s','65s','54s'])
      }
    },
    vs3bet: {
      'UTG open': {
        raise: new Set(['AA','KK','QQ','AKs']),
        call: new Set(['JJ','TT','99','AKo','AQs','AJs','KQs'])
      },
      'HJ open': {
        raise: new Set(['AA','KK','QQ','AKs']),
        call: new Set(['JJ','TT','99','88','AKo','AQs','AQo','AJs','ATs','KQs','QJs','JTs'])
      },
      'CO open': {
        raise: new Set(['AA','KK','QQ','AKs','AKo']),
        call: new Set(['JJ','TT','99','88','77','AQs','AQo','AJs','ATs','A5s','KQs','KJs','QJs','JTs','T9s','98s'])
      },
      'BTN open': {
        raise: new Set(['AA','KK','QQ','JJ','AKs','AKo','A5s']),
        call: new Set(['TT','99','88','77','66','AQs','AQo','AJs','AJo','ATs','A4s','A3s','KQs','KQo','KJs','KTs','QJs','QTs','JTs','T9s','98s','87s','76s'])
      }
    }
  },

  '8max': {
    rfi: {
      'UTG': {
        raise: new Set([
          ...expandPairs('7'),
          ...'ATs,AJs,AQs,AKs,KJs,KQs,JTs'.split(','),
          'AJo','AQo','AKo','KQo'
        ])
      },
      'UTG+1': {
        raise: new Set([
          ...expandPairs('6'),
          ...'A9s,ATs,AJs,AQs,AKs,KTs,KJs,KQs,QTs,QJs,JTs,T9s,98s'.split(','),
          'ATo','AJo','AQo','AKo','KJo','KQo'
        ])
      },
      'HJ': {
        raise: new Set([
          ...expandPairs('5'),
          ...'A2s,A3s,A4s,A5s,A6s,A7s,A8s,A9s,ATs,AJs,AQs,AKs'.split(','),
          ...'K8s,K9s,KTs,KJs,KQs'.split(','),
          ...'Q9s,QTs,QJs,J9s,JTs,T9s,98s,87s,76s'.split(','),
          'ATo','AJo','AQo','AKo','KTo','KJo','KQo','QTo','QJo','JTo'
        ])
      },
      'CO': {
        raise: new Set([
          ...expandPairs('4'),
          ...'A2s,A3s,A4s,A5s,A6s,A7s,A8s,A9s,ATs,AJs,AQs,AKs'.split(','),
          ...'K5s,K6s,K7s,K8s,K9s,KTs,KJs,KQs'.split(','),
          ...'Q7s,Q8s,Q9s,QTs,QJs,J8s,J9s,JTs,T8s,T9s,97s,98s,87s,76s,65s'.split(','),
          'A8o','A9o','ATo','AJo','AQo','AKo','KTo','KJo','KQo','QTo','QJo','JTo'
        ])
      },
      'BTN': {
        raise: new Set([
          ...expandPairs('2'),
          ...'A2s,A3s,A4s,A5s,A6s,A7s,A8s,A9s,ATs,AJs,AQs,AKs'.split(','),
          ...'K2s,K3s,K4s,K5s,K6s,K7s,K8s,K9s,KTs,KJs,KQs'.split(','),
          ...'Q4s,Q5s,Q6s,Q7s,Q8s,Q9s,QTs,QJs'.split(','),
          ...'J6s,J7s,J8s,J9s,JTs,T6s,T7s,T8s,T9s'.split(','),
          ...'96s,97s,98s,86s,87s,75s,76s,65s,54s'.split(','),
          ...'A4o,A5o,A6o,A7o,A8o,A9o,ATo,AJo,AQo,AKo'.split(','),
          'K8o','K9o','KTo','KJo','KQo','Q9o','QTo','QJo','J9o','JTo','T9o'
        ])
      },
      'SB': {
        raise: new Set([
          ...expandPairs('3'),
          ...'A2s,A3s,A4s,A5s,A6s,A7s,A8s,A9s,ATs,AJs,AQs,AKs'.split(','),
          ...'K4s,K5s,K6s,K7s,K8s,K9s,KTs,KJs,KQs'.split(','),
          ...'Q6s,Q7s,Q8s,Q9s,QTs,QJs,J7s,J8s,J9s,JTs'.split(','),
          ...'T7s,T8s,T9s,97s,98s,87s,76s,65s'.split(','),
          'A7o','A8o','A9o','ATo','AJo','AQo','AKo','KTo','KJo','KQo','QTo','QJo','JTo'
        ])
      }
    },
    bbdef: {
      'vs UTG': {
        raise: new Set(['AA','KK','QQ','AKs']),
        call: new Set([
          'JJ','TT','99','88','77','66',
          ...'AQs,AJs,ATs,A9s,A8s,A5s,A4s'.split(','),
          'AKo','AQo',
          ...'KQs,KJs,KTs'.split(','),
          'KQo',
          ...'QJs,QTs'.split(','),
          ...'JTs,J9s'.split(','),
          ...'T9s,98s'.split(','),
          ...'87s,86s'.split(','),
          '76s','65s','54s'
        ])
      },
      'vs UTG+1': {
        raise: new Set(['AA','KK','QQ','JJ','AKs','AKo','AQs']),
        call: new Set([
          'TT','99','88','77','66','55',
          ...'AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s'.split(','),
          'AQo','AJo',
          ...'KQs,KJs,KTs,K9s,K8s'.split(','),
          'KQo','KJo',
          ...'QJs,QTs'.split(','),
          ...'JTs,J9s'.split(','),
          ...'T9s,T8s'.split(','),
          ...'98s,97s'.split(','),
          ...'87s,86s'.split(','),
          '76s','65s','54s'
        ])
      },
      'vs HJ': {
        raise: new Set(['AA','KK','QQ','JJ','TT','AKs','AKo','AQs','AJs','A5s','A4s']),
        call: new Set([
          '99','88','77','66','55','44',
          ...'ATs,A9s,A8s,A7s,A6s,A3s,A2s'.split(','),
          'AQo','AJo','ATo',
          ...'KQs,KJs,KTs,K9s,K8s,K7s,K6s'.split(','),
          'KQo','KJo',
          ...'QJs,QTs,Q9s,Q8s'.split(','),
          'QJo',
          ...'JTs,J9s,J8s'.split(','),
          ...'T9s,T8s'.split(','),
          ...'98s,97s'.split(','),
          ...'87s,86s'.split(','),
          '76s','75s','65s','64s','54s','53s','43s'
        ])
      },
      'vs CO': {
        raise: new Set(['AA','KK','QQ','JJ','TT','99','AKs','AKo','AQs','AQo','AJs','KQs','A5s','A4s','A3s']),
        call: new Set([
          '88','77','66','55','44','33',
          ...'ATs,A9s,A8s,A7s,A6s,A2s'.split(','),
          'AJo','ATo','A9o',
          ...'KJs,KTs,K9s,K8s,K7s,K6s,K5s'.split(','),
          'KQo','KJo','KTo',
          ...'QJs,QTs,Q9s,Q8s,Q7s'.split(','),
          'QJo','QTo',
          ...'JTs,J9s,J8s,J7s'.split(','),
          'JTo',
          ...'T9s,T8s,T7s'.split(','),
          ...'98s,97s,96s'.split(','),
          ...'87s,86s,85s'.split(','),
          '76s','75s','65s','64s','54s','53s','43s'
        ])
      },
      'vs BTN': {
        raise: new Set([
          'AA','KK','QQ','JJ','TT','99','88',
          ...'AKs,AKo,AQs,AQo,AJs,AJo,ATs,A9s,A8s,A5s,A4s,A3s,A2s'.split(','),
          'KQs','KQo','KJs','KTs','QJs','Q9s','J9s','T9s'
        ]),
        call: new Set([
          '77','66','55','44','33','22',
          ...'A7s,A6s'.split(','),
          'ATo','A9o','A8o','A7o',
          ...'K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s'.split(','),
          'KJo','KTo','K9o',
          ...'QTs,Q8s,Q7s,Q6s,Q5s'.split(','),
          'QJo','QTo','Q9o',
          ...'JTs,J8s,J7s,J6s'.split(','),
          'JTo','J9o',
          ...'T8s,T7s,T6s'.split(','),
          'T9o',
          ...'98s,97s,96s,95s'.split(','),
          ...'87s,86s,85s'.split(','),
          ...'76s,75s,74s'.split(','),
          '65s','64s','54s','53s','43s'
        ])
      },
      'vs SB': {
        raise: new Set([
          'AA','KK','QQ','JJ','TT','99','88','77',
          ...'AKs,AKo,AQs,AQo,AJs,AJo,ATs,ATo,A9s,A8s,A5s,A4s,A3s,A2s'.split(','),
          'KQs','KQo','KJs','KJo','KTs','K9s',
          'QJs','QTs','Q9s',
          'JTs','J9s','T9s','98s'
        ]),
        call: new Set([
          '66','55','44','33','22',
          ...'A7s,A6s'.split(','),
          'A9o','A8o','A7o','A6o','A5o',
          ...'K8s,K7s,K6s,K5s,K4s,K3s,K2s'.split(','),
          'KTo','K9o','K8o',
          ...'Q8s,Q7s,Q6s,Q5s,Q4s'.split(','),
          'QJo','QTo','Q9o',
          ...'J8s,J7s,J6s,J5s'.split(','),
          'JTo','J9o',
          ...'T8s,T7s,T6s'.split(','),
          'T9o','T8o',
          ...'97s,96s,95s'.split(','),
          '98o',
          ...'86s,85s,84s'.split(','),
          '87o',
          ...'75s,74s'.split(','),
          '76o',
          '65s','64s','63s','54s','53s','43s'
        ])
      }
    },
    '3bet': {
      'vs UTG': {
        raise: new Set(['AA','KK','QQ','JJ','AKs','AKo','AQs']),
        call: new Set([
          'TT','99','88','77','66',
          'AJs','ATs','KQs','QJs','JTs','T9s','98s','87s','76s'
        ])
      },
      'vs UTG+1': {
        raise: new Set(['AA','KK','QQ','JJ','TT','AKs','AKo','AQs','AJs']),
        call: new Set(['99','88','77','66','ATs','A5s','A4s','KQs','KJs','QJs','JTs','T9s','98s','87s','76s'])
      },
      'vs HJ': {
        raise: new Set(['AA','KK','QQ','JJ','TT','AKs','AKo','AQs','AJs']),
        call: new Set(['99','88','77','66','ATs','A5s','A4s','KQs','KJs','QJs','JTs','T9s','98s','87s','76s'])
      },
      'vs CO': {
        raise: new Set(['AA','KK','QQ','JJ','TT','AKs','AKo','AQs','AQo','AJs','KQs','A5s','A4s']),
        call: new Set(['99','88','77','66','55','ATs','A9s','A8s','KJs','KTs','QJs','QTs','JTs','T9s','98s','87s','76s','65s'])
      },
      'vs BTN': {
        raise: new Set(['AA','KK','QQ','JJ','TT','99','AKs','AKo','AQs','AQo','AJs','AJo','ATs','KQs','KQo','KJs','QJs','A5s','A4s','A3s']),
        call: new Set(['88','77','66','55','44','A9s','A8s','A7s','A6s','KTs','K9s','QTs','JTs','T9s','98s','87s','76s','65s','54s'])
      }
    },
    vs3bet: {
      'UTG open': {
        raise: new Set(['AA','KK','QQ','AKs']),
        call: new Set(['JJ','TT','99','AKo','AQs'])
      },
      'UTG+1 open': {
        raise: new Set(['AA','KK','QQ','AKs']),
        call: new Set(['JJ','TT','99','88','AKo','AQs','AQo','AJs','ATs','KQs'])
      },
      'HJ open': {
        raise: new Set(['AA','KK','QQ','AKs']),
        call: new Set(['JJ','TT','99','88','AKo','AQs','AQo','AJs','ATs','KQs','QJs','JTs'])
      },
      'CO open': {
        raise: new Set(['AA','KK','QQ','AKs','AKo']),
        call: new Set(['JJ','TT','99','88','77','AQs','AQo','AJs','ATs','A5s','KQs','KJs','QJs','JTs','T9s','98s'])
      },
      'BTN open': {
        raise: new Set(['AA','KK','QQ','JJ','AKs','AKo','A5s']),
        call: new Set(['TT','99','88','77','66','AQs','AQo','AJs','AJo','ATs','A4s','A3s','KQs','KQo','KJs','KTs','QJs','QTs','JTs','T9s','98s','87s','76s'])
      }
    }
  },

  '5max': {
    rfi: {
      'HJ': {
        raise: new Set([
          'AA','KK','QQ','JJ','TT','99','88','77','66',
          'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','QJs','T9s','98s','87s',
          'AKo','AQo','AJo','KQo'
        ]),
        looseRaise: new Set([
          '55','44','33','22',
          'KTs','QTs','JTs','76s',
          'ATo'
        ]),
        notes: ''
      },
      'CO': {
        raise: new Set([
          'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
          'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','QJs','QTs','Q9s','JTs','J9s','T9s','98s','87s','76s',
          'AKo','AQo','AJo','ATo','KQo','KJo','KTo','QJo','QTo','JTo'
        ]),
        looseRaise: new Set([
          'K8s','Q8s','J8s','T8s','97s','86s','75s','65s',
          'A9o','A8o','A5o'
        ]),
        notes: ''
      },
      'BTN': {
        raise: new Set([
          'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
          'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s','K4s','K3s','K2s','QJs','QTs','Q9s','Q8s','Q7s','Q6s','Q5s','JTs','J9s','J8s','J7s','J6s','T9s','T8s','T7s','T6s','98s','97s','96s','87s','86s','85s','76s','75s','74s','65s','64s','54s','43s',
          'AKo','AQo','AJo','ATo','A9o','A8o','A7o','A5o','A4o','A3o','KQo','KJo','KTo','K9o','K8o','QJo','QTo','Q9o','JTo','J9o','T9o','98o'
        ]),
        looseRaise: new Set([
          'Q4s','Q3s','Q2s','J5s','95s','84s','73s','63s','53s',
          'A6o','A2o','K7o','Q8o','J8o','T8o','87o','76o','65o'
        ]),
        notes: ''
      },
      'SB': {
        raise: new Set([
          'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
          'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s','K4s','K3s','K2s','QJs','QTs','Q9s','Q8s','Q7s','Q6s','Q5s','JTs','J9s','J8s','J7s','T9s','T8s','T7s','98s','97s','87s','86s','76s','75s','65s',
          'AKo','AQo','AJo','ATo','A9o','A8o','A7o','A5o','A4o','A3o','KQo','KJo','KTo','K9o','K8o','QJo','QTo','Q9o','JTo','J9o','T9o','98o','87o'
        ]),
        looseRaise: new Set([
          'Q4s','Q3s','Q2s','J6s','J5s','T6s','96s','85s','74s','64s','63s','54s','53s','43s',
          'A6o','A2o','76o'
        ]),
        notes: ''
      }
    },
    '3bet': {
      'CO vs HJ': {
        raise: new Set([
          'AA','KK','QQ','JJ',
          'AKs','AQs','AJs','A5s','A4s','KQs','JTs','T9s','98s',
          'AKo'
        ]),
        notes: 'On évite de 5bet QQ contre des joueurs qui 4bet très très peu.\nA5s en 5bet bluff contre joueur qui 4bet beaucoup.\n'
      },
      'BTN vs HJ': {
        raise: new Set([
          'AA','KK','QQ','JJ',
          'AKs','AQs','AJs','ATs','A5s','A4s','A3s','KQs','JTs','T9s','98s','87s',
          'AKo'
        ]),
        notes: 'On évite de 5bet QQ contre des joueurs qui 4bet très très peu.\nA5s en 5bet bluff contre joueur qui 4bet beaucoup.\n'
      },
      'BTN vs CO': {
        raise: new Set([
          'AA','KK','QQ','JJ','TT',
          'AKs','AQs','AJs','ATs','A9s','A5s','A4s','A3s','A2s','KQs','KJs','QJs','JTs','T9s','98s','87s','76s',
          'AKo','AQo','KQo'
        ]),
        notes: 'On évite de 5bet QQ contre des joueurs qui 4bet très très peu.\nA5s en 5bet bluff contre joueur qui 4bet beaucoup.\n'
      },
      'SB vs HJ': {
        raise: new Set([
          'AA','KK','QQ','JJ',
          'AKs','AQs','AJs','A5s','A4s','JTs','T9s',
          'AKo'
        ]),
        notes: ''
      },
      'SB vs CO': {
        raise: new Set([
          'AA','KK','QQ','JJ','TT',
          'AKs','AQs','AJs','ATs','A5s','A4s','A3s','KQs','QJs','JTs','T9s',
          'AKo','AQo'
        ]),
        notes: 'AXs à éviter si on a vraiment du mal'
      },
      'SB vs BTN': {
        raise: new Set([
          'AA','KK','QQ','JJ','TT','99',
          'AKs','AQs','AJs','ATs','A9s','A5s','A4s','A3s','KQs','KJs','KTs','QJs','JTs','T9s','98s','87s',
          'AKo','AQo','AJo','KQo'
        ]),
        notes: 'AXs à éviter si on a vraiment du mal'
      }
    },
    vs3bet: {
      'HJ open': {
        raise: new Set([
          'AA','KK',
          'AKs','A6s','A2s',
          'AKo'
        ]),
        call: new Set([
          'QQ','JJ','TT','99','88',
          'AQs','AJs','ATs','KQs','KJs','QJs','JTs',
          'AKo'
        ]),
        notes: '4bet:\nA6s et A2s en bluff uniquement contre un adversaire qui fold beaucoup sur 4bet, à utiliser avec parcimonie (je la connais bien).\nContre un adversaire susceptible de call plus souvent un 4bet, on va plutôt 4bet A5s pour faire quinte de temps en temps.\n\nCall 3bet: on call quasi toutes les pocket pairs si sizing petit, sinon à partir de 88'
      },
      'CO open': {
        raise: new Set([
          'AA','KK','QQ',
          'AKs','A7s','A6s','A2s',
          'AKo'
        ]),
        call: new Set([
          'QQ','JJ','TT','99','88','77',
          'AQs','AJs','ATs','A5s','A4s','KQs','KJs','KTs','QJs','JTs','T9s','98s','87s',
          'AQo'
        ]),
        notes: ''
      },
      'BTN open': {
        raise: new Set([
          'AA','KK','QQ','JJ',
          'AKs','A7s','A6s','A3s','A2s',
          'AKo'
        ]),
        call: new Set([
          'JJ','TT','99','88','77','66',
          'AQs','AJs','ATs','A9s','A5s','A4s','KQs','KJs','KTs','K9s','QJs','QTs','Q9s','JTs','J9s','T9s','98s','87s','76s',
          'AQo','AJo','KQo'
        ]),
        notes: 'On va call 3bet A9s et A8s si on se sent à l\'aise'
      },
      'SB open': {
        raise: new Set([
          'AA','KK','QQ','JJ',
          'AKs','A5s','A4s','A3s','A2s',
          'AKo'
        ]),
        call: new Set([
          'TT','99','88','77',
          'AQs','AJs','ATs','KQs','KJs','KTs','QJs','QTs','JTs','T9s','98s','87s','76s',
          'AQo','AJo','KQo'
        ]),
        notes: 'Ajouter des pocket pairs si sizing adverse petit'
      }
    },
    bbdef: {
      'vs HJ': {
        raise: new Set([
          'AA','KK','QQ','JJ',
          'AKs','AQs','A5s',
          'AKo'
        ]),
        call: new Set([
          'JJ','TT','99','88','77','66','55','44','33','22',
          'AJs','ATs','A9s','A8s','A7s','A6s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','K8s','K7s','QJs','QTs','Q9s','Q8s','JTs','J9s','J8s','T9s','T8s','98s','97s','87s','86s','76s','75s','65s','64s','54s',
          'AQo','AJo','ATo','KQo','KJo','QJo'
        ]),
        notes: ''
      },
      'vs CO': {
        raise: new Set([
          'AA','KK','QQ','JJ','TT',
          'AKs','AQs','AJs','ATs','A5s','A4s','KQs','KJs','JTs','T9s','98s',
          'AKo','AQo','KQo'
        ]),
        call: new Set([
          '99','88','77','66','55','44','33','22',
          'ATs','A9s','A8s','A7s','A6s','A4s','A3s','A2s','KJs','KTs','K9s','K8s','K7s','K6s','K5s','K4s','K3s','K2s','QJs','QTs','Q9s','Q8s','Q7s','Q6s','Q5s','J9s','J8s','J7s','T9s','T8s','T7s','98s','97s','96s','87s','86s','85s','76s','75s','74s','65s','64s','63s','54s','53s','43s',
          'AQo','AJo','ATo','A9o','A8o','A7o','A6o','A5o','KQo','KJo','KTo','K9o','QJo','QTo','Q9o','JTo','J9o','T9o','98o'
        ]),
        notes: 'C\'est un peu loose, on peut commencer par restreindre un peu puis élargir une fois à l\'aise.\nImportant de défendre tous ses AXs quand même'
      },
      'vs BTN': {
        raise: new Set([
          'AA','KK','QQ','JJ','TT','99',
          'AKs','AQs','AJs','ATs','A5s','A4s','KQs','KJs','KTs','QJs','JTs','T9s','98s','87s','76s',
          'AKo','AQo','AJo','KQo'
        ]),
        call: new Set([
          '99','88','77','66','55','44','33','22',
          'A9s','A8s','A7s','A6s','A3s','A2s','KTs','K9s','K8s','K7s','K6s','K5s','K4s','K3s','K2s','QJs','QTs','Q9s','Q8s','Q7s','Q6s','Q5s','Q4s','Q3s','Q2s','J9s','J8s','J7s','J6s','J5s','J4s','T8s','T7s','T6s','98s','97s','96s','95s','87s','86s','85s','76s','75s','74s','65s','64s','63s','54s','53s','43s',
          'AQo','AJo','ATo','A9o','A8o','A7o','A6o','A5o','A4o','A3o','A2o','KQo','KJo','KTo','K9o','QJo','QTo','Q9o','JTo','J9o','T9o','98o','87o','76o','65o'
        ]),
        notes: 'C\'est un peu loose, on peut commencer par restreindre un peu puis élargir une fois à l\'aise.\nImportant de défendre tous ses AXs quand même'
      },
      'vs SB': {
        raise: new Set([
          'AA','KK','QQ','JJ','TT','99','88',
          'AKs','AQs','AJs','ATs','A5s','A4s','KQs','KJs','KTs','QJs','JTs','T9s','98s',
          'AKo','AQo','AJo','KQo'
        ]),
        call: new Set([
          '88','77','66','55','44','33','22',
          'A9s','A8s','A7s','A6s','A3s','A2s','KTs','K9s','K8s','K7s','K6s','K5s','K4s','K3s','K2s','QJs','QTs','Q9s','Q8s','Q7s','Q6s','Q5s','Q4s','Q3s','Q2s','J9s','J8s','J7s','J6s','J5s','T8s','T7s','T6s','98s','97s','96s','95s','87s','86s','85s','84s','76s','75s','74s','73s','65s','64s','63s','54s','53s','43s',
          'ATo','A9o','A8o','A7o','A6o','A5o','A4o','A3o','A2o','KQo','KJo','KTo','K9o','K8o','QJo','QTo','Q9o','Q8o','JTo','J9o','J8o','T9o','T8o','98o','87o','76o'
        ]),
        notes: 'C\'est un peu loose, on peut commencer par restreindre un peu puis élargir une fois à l\'aise.\nImportant de défendre tous ses AXs quand même'
      }
    }
  },

  'fr': {
    bbdef: {
      'vs UTG': {
        raise: new Set(['AA','KK','QQ','AKs']),
        call: new Set([
          'JJ','TT','99','88','77','66',
          ...'AQs,AJs,ATs,A9s,A8s,A7s,A5s,A4s'.split(','),
          'AKo','AQo','AJo',
          ...'KQs,KJs,KTs,K9s'.split(','),
          'KQo',
          ...'QJs,QTs,Q9s'.split(','),
          ...'JTs,J9s'.split(','),
          'T9s','98s','87s','76s','65s','54s'
        ])
      },
      'vs UTG+1': {
        raise: new Set(['AA','KK','QQ','JJ','AKs','AKo','AQs']),
        call: new Set([
          'TT','99','88','77','66','55',
          ...'AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s'.split(','),
          'AQo','AJo',
          ...'KQs,KJs,KTs,K9s,K8s'.split(','),
          'KQo','KJo',
          ...'QJs,QTs,Q9s'.split(','),
          'QJo',
          ...'JTs,J9s'.split(','),
          ...'T9s,T8s'.split(','),
          '98s','97s','87s','86s','76s','65s','54s'
        ])
      },
      'vs MP': {
        raise: new Set(['AA','KK','QQ','JJ','TT','AKs','AKo','AQs','AJs','A5s']),
        call: new Set([
          '99','88','77','66','55','44',
          ...'ATs,A9s,A8s,A7s,A6s,A4s,A3s,A2s'.split(','),
          'AQo','AJo','ATo',
          ...'KQs,KJs,KTs,K9s,K8s,K7s'.split(','),
          'KQo','KJo',
          ...'QJs,QTs,Q9s,Q8s'.split(','),
          'QJo',
          ...'JTs,J9s,J8s'.split(','),
          ...'T9s,T8s'.split(','),
          '98s','97s','87s','86s','76s','75s','65s','64s','54s','43s'
        ])
      },
      'vs CO': {
        raise: new Set(['AA','KK','QQ','JJ','TT','99','AKs','AKo','AQs','AQo','AJs','KQs','A5s','A4s','A3s']),
        call: new Set([
          '88','77','66','55','44','33',
          ...'ATs,A9s,A8s,A7s,A6s,A2s'.split(','),
          'AJo','ATo','A9o',
          ...'KJs,KTs,K9s,K8s,K7s,K6s,K5s'.split(','),
          'KQo','KJo','KTo',
          ...'QJs,QTs,Q9s,Q8s,Q7s'.split(','),
          'QJo','QTo',
          ...'JTs,J9s,J8s,J7s'.split(','),
          'JTo',
          ...'T9s,T8s,T7s'.split(','),
          '98s','97s','96s','87s','86s','85s','76s','75s','65s','64s','54s','53s','43s'
        ])
      },
      'vs BTN': {
        raise: new Set([
          'AA','KK','QQ','JJ','TT','99','88',
          ...'AKs,AKo,AQs,AQo,AJs,AJo,ATs,A9s,A8s,A5s,A4s,A3s,A2s'.split(','),
          'KQs','KQo','KJs','KTs','QJs','Q9s','J9s','T9s'
        ]),
        call: new Set([
          '77','66','55','44','33','22',
          ...'A7s,A6s'.split(','),
          'ATo','A9o','A8o','A7o',
          ...'K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s'.split(','),
          'KJo','KTo','K9o',
          ...'QTs,Q8s,Q7s,Q6s,Q5s'.split(','),
          'QJo','QTo','Q9o',
          ...'JTs,J8s,J7s,J6s'.split(','),
          'JTo','J9o',
          ...'T8s,T7s,T6s'.split(','),
          'T9o',
          '98s','97s','96s','95s','87s','86s','85s','76s','75s','74s','65s','64s','54s','53s','43s'
        ])
      },
      'vs SB': {
        raise: new Set([
          'AA','KK','QQ','JJ','TT','99','88','77',
          ...'AKs,AKo,AQs,AQo,AJs,AJo,ATs,ATo,A9s,A8s,A5s,A4s,A3s,A2s'.split(','),
          'KQs','KQo','KJs','KJo','KTs','K9s',
          'QJs','QTs','Q9s',
          'JTs','J9s','T9s','98s'
        ]),
        call: new Set([
          '66','55','44','33','22',
          ...'A7s,A6s'.split(','),
          'A9o','A8o','A7o','A6o','A5o',
          ...'K8s,K7s,K6s,K5s,K4s,K3s,K2s'.split(','),
          'KTo','K9o','K8o',
          ...'Q8s,Q7s,Q6s,Q5s,Q4s'.split(','),
          'QJo','QTo','Q9o',
          ...'J8s,J7s,J6s,J5s'.split(','),
          'JTo','J9o',
          ...'T8s,T7s,T6s'.split(','),
          'T9o','T8o',
          '97s','96s','95s','98o','86s','85s','84s','87o','75s','74s','76o',
          '65s','64s','63s','54s','53s','43s'
        ])
      }
    },
    rfi: {
      'UTG': {
        raise: new Set([
          ...expandPairs('8'),
          ...'ATs,AJs,AQs,AKs,KJs,KQs,QJs,JTs'.split(','),
          'AJo','AQo','AKo','KQo'
        ])
      },
      'UTG+1': {
        raise: new Set([
          ...expandPairs('7'),
          ...'A9s,ATs,AJs,AQs,AKs,KTs,KJs,KQs,QJs,QTs,JTs,T9s'.split(','),
          'ATo','AJo','AQo','AKo','KJo','KQo'
        ])
      },
      'MP': {
        raise: new Set([
          ...expandPairs('6'),
          ...'A8s,A9s,ATs,AJs,AQs,AKs,K9s,KTs,KJs,KQs,Q9s,QTs,QJs,J9s,JTs,T9s,98s'.split(','),
          'ATo','AJo','AQo','AKo','KJo','KQo','QJo'
        ])
      },
      'LJ': {
        raise: new Set([
          ...expandPairs('5'),
          ...'A5s,A6s,A7s,A8s,A9s,ATs,AJs,AQs,AKs'.split(','),
          ...'K8s,K9s,KTs,KJs,KQs,Q9s,QTs,QJs,J9s,JTs,T9s,98s,87s'.split(','),
          'ATo','AJo','AQo','AKo','KTo','KJo','KQo','QJo'
        ])
      },
      'HJ': {
        raise: new Set([
          ...expandPairs('4'),
          ...'A2s,A3s,A4s,A5s,A6s,A7s,A8s,A9s,ATs,AJs,AQs,AKs'.split(','),
          ...'K7s,K8s,K9s,KTs,KJs,KQs,Q8s,Q9s,QTs,QJs'.split(','),
          ...'J8s,J9s,JTs,T8s,T9s,97s,98s,87s,76s'.split(','),
          'ATo','AJo','AQo','AKo','KTo','KJo','KQo','QTo','QJo','JTo'
        ])
      },
      'CO': {
        raise: new Set([
          ...expandPairs('3'),
          ...'A2s,A3s,A4s,A5s,A6s,A7s,A8s,A9s,ATs,AJs,AQs,AKs'.split(','),
          ...'K4s,K5s,K6s,K7s,K8s,K9s,KTs,KJs,KQs'.split(','),
          ...'Q6s,Q7s,Q8s,Q9s,QTs,QJs,J7s,J8s,J9s,JTs'.split(','),
          ...'T7s,T8s,T9s,97s,98s,87s,76s,65s'.split(','),
          'A8o','A9o','ATo','AJo','AQo','AKo','KTo','KJo','KQo','QTo','QJo','JTo'
        ])
      },
      'BTN': {
        raise: new Set([
          ...expandPairs('2'),
          ...'A2s,A3s,A4s,A5s,A6s,A7s,A8s,A9s,ATs,AJs,AQs,AKs'.split(','),
          ...'K2s,K3s,K4s,K5s,K6s,K7s,K8s,K9s,KTs,KJs,KQs'.split(','),
          ...'Q4s,Q5s,Q6s,Q7s,Q8s,Q9s,QTs,QJs'.split(','),
          ...'J6s,J7s,J8s,J9s,JTs,T6s,T7s,T8s,T9s'.split(','),
          ...'96s,97s,98s,85s,86s,87s,75s,76s,64s,65s,54s'.split(','),
          ...'A4o,A5o,A6o,A7o,A8o,A9o,ATo,AJo,AQo,AKo'.split(','),
          'K8o','K9o','KTo','KJo','KQo','Q9o','QTo','QJo','J9o','JTo','T9o'
        ])
      },
      'SB': {
        raise: new Set([
          ...expandPairs('4'),
          ...'A2s,A3s,A4s,A5s,A6s,A7s,A8s,A9s,ATs,AJs,AQs,AKs'.split(','),
          ...'K5s,K6s,K7s,K8s,K9s,KTs,KJs,KQs'.split(','),
          ...'Q7s,Q8s,Q9s,QTs,QJs,J8s,J9s,JTs,T8s,T9s,98s,87s,76s'.split(','),
          'A9o','ATo','AJo','AQo','AKo','KTo','KJo','KQo','QJo'
        ])
      }
    },
    '3bet': {
      'vs UTG': {
        raise: new Set(['AA','KK','QQ','AKs']),
        call: new Set(['JJ','TT','99','88','AKo','AQs','KQs','JTs','T9s','98s','87s','76s'])
      },
      'vs MP': {
        raise: new Set(['AA','KK','QQ','JJ','AKs','AKo','AQs']),
        call: new Set(['TT','99','88','77','AJs','ATs','KQs','KJs','QJs','JTs','T9s','98s','87s','76s'])
      },
      'vs CO': {
        raise: new Set(['AA','KK','QQ','JJ','TT','AKs','AKo','AQs','AQo','AJs','KQs','A5s','A4s']),
        call: new Set(['99','88','77','66','55','ATs','A9s','KJs','KTs','QJs','QTs','JTs','T9s','98s','87s','76s','65s'])
      },
      'vs BTN': {
        raise: new Set(['AA','KK','QQ','JJ','TT','99','AKs','AKo','AQs','AQo','AJs','AJo','ATs','KQs','KQo','KJs','QJs','A5s','A4s','A3s']),
        call: new Set(['88','77','66','55','44','A9s','A8s','A7s','A6s','KTs','K9s','QTs','JTs','T9s','98s','87s','76s','65s','54s'])
      }
    },
    vs3bet: {
      'UTG open': {
        raise: new Set(['AA','KK','QQ','AKs']),
        call: new Set(['JJ','TT','AKo','AQs'])
      },
      'MP open': {
        raise: new Set(['AA','KK','QQ','AKs']),
        call: new Set(['JJ','TT','99','AKo','AQs','AJs','KQs'])
      },
      'CO open': {
        raise: new Set(['AA','KK','QQ','AKs','AKo']),
        call: new Set(['JJ','TT','99','88','AQs','AQo','AJs','ATs','A5s','KQs','KJs','QJs','JTs','T9s'])
      },
      'BTN open': {
        raise: new Set(['AA','KK','QQ','JJ','AKs','AKo','A5s']),
        call: new Set(['TT','99','88','77','66','AQs','AQo','AJs','AJo','ATs','A4s','A3s','KQs','KQo','KJs','KTs','QJs','QTs','JTs','T9s','98s','87s','76s'])
      }
    }
  }
};

// ============================================================
// CONTEXTUAL NOTES PER POSITION / SITUATION
// ============================================================
const RANGE_NOTES = {
  '6max': {
    rfi: {
      'UTG': {
        tips: [
          "Range la plus tight de la table (~15%). Tu parles en premier, 4 joueurs peuvent te sur-relancer.",
          "Les suited connectors (76s-T9s) sont inclus pour l'équilibre et la jouabilité, mais tu peux les retirer si la table 3-bet beaucoup."
        ],
        widen: "Si les blinds sont très tight (fold > 80% au steal) et que personne ne 3-bet, tu peux ajouter A9s, A8s, K9s et 55.",
        tighten: "Si la table est agressive avec beaucoup de 3-bets, retire les suited connectors bas (76s, 87s) et les Axo les plus faibles (ATo)."
      },
      'HJ': {
        tips: [
          "Un peu plus large qu'UTG car un joueur de moins peut agir derrière toi.",
          "Tu ouvres maintenant tous les Axs — ces mains ont du potentiel de nut flush."
        ],
        widen: "Si le CO, BTN et les blinds sont passifs, ajoute K7s, Q8s et 65s.",
        tighten: "Si le BTN ou le CO 3-bet fréquemment (> 10%), retire les broadways offsuit les plus faibles (QTo, JTo)."
      },
      'CO': {
        tips: [
          "Le CO est la première vraie position de « steal ». Tu n'as que le BTN et les blinds derrière.",
          "Tu peux commencer à ouvrir des mains offsuit plus larges (A8o+) et des suited gappers."
        ],
        widen: "Si le BTN fold beaucoup et les blinds ne défendent pas, ajoute K4s, J7s, A7o, 54s.",
        tighten: "Si le BTN squeeze souvent, resserre vers un range HJ-like et privilégie les mains qui supportent un 3-bet (call ou 4-bet)."
      },
      'BTN': {
        tips: [
          "Le bouton est la position la plus profitable au poker. Tu as la position sur tout le monde post-flop.",
          "C'est normal d'ouvrir ~40% de tes mains ici. Beaucoup de ces mains gagnent grâce à la position et à la fold equity.",
          "Les petites paires (22-55) se jouent principalement en set mining — toucher un brelan pour gagner un gros pot."
        ],
        widen: "Si les blinds overfold (ne défendent que 20-30%), tu peux ouvrir jusqu'à 50%+ : ajoute K2o-K7o, Q8o, J8o, T8o et tous les suited restants.",
        tighten: "Si la SB ou BB 3-bet agressivement (> 12%), retire les mains offsuit les plus faibles (T9o, J9o, K8o) et les suited avec peu de jouabilité (Q4s, J6s)."
      },
      'SB': {
        tips: [
          "Stratégie simplifiée NL2 : raise ou fold, pas de limp. Tu seras OOP (hors position) contre la BB sur tous les streets.",
          "En théorie GTO, la SB peut aussi avoir une range de limp vs BB. Mais en NL2, simplifier en raise/fold est plus efficace et plus facile à exécuter."
        ],
        widen: "Si la BB fold beaucoup au steal (> 65%), élargis avec plus d'Axo (A5o, A6o), K9o, Q9o et des suited gappers (53s, 64s).",
        tighten: "Si la BB défend très large et 3-bet souvent, joue seulement les mains que tu es prêt à jouer face à un 3-bet (resserrer à ~25%)."
      }
    },
    bbdef: {
      'vs UTG': {
        tips: [
          "Le range d'open UTG est très fort (~15%). Défends plus tight qu'ailleurs, mais tu as la cote du pot pour caller large.",
          "Tes 3-bets value sont restreints (QQ+, AKs, AQs). N'ajoute pas de 3-bet bluff vs UTG en NL2 — les joueurs ne foldent pas assez.",
          "Les petites paires (55-77) se callent pour le set mining : tu gagnes un gros pot ~12% du temps."
        ],
        widen: "Si le joueur UTG ouvre trop large (> 20%), il a un range plus faible que la normale — tu peux défendre plus de broadways offsuit et 3-bet un peu plus.",
        tighten: "Si l'UTG est un nit (ouvre < 12%), resserre ta défense. Fold les Axs faibles (A2s-A6s), les suited connectors bas et les petites paires."
      },
      'vs HJ': {
        tips: [
          "Le HJ ouvre un peu plus large que l'UTG, tu peux donc défendre un peu plus.",
          "A5s et A4s sont de bons candidats de 3-bet bluff : ils bloquent AA/AK et ont du potentiel de nut flush.",
          "Les mains suited à trou (Q8s, J8s) se défendent bien grâce aux implied odds en position fermée."
        ],
        widen: "Si le HJ ouvre > 25% (trop large pour la position), ajoute plus de 3-bet bluffs (K9s, Q9s) et call plus de mains offsuit.",
        tighten: "Si le HJ est tight (< 18%), c'est comme défendre vs UTG. Retire les suited connectors bas et les broadways offsuit faibles."
      },
      'vs CO': {
        tips: [
          "Le CO ouvre ~27%, ton range de défense s'élargit nettement.",
          "Tu commences à 3-bet plus de mains pour value (99+, AJs+) et à ajouter des 3-bet bluffs.",
          "Les paires moyennes (77-99) deviennent des 3-bet pour value en NL2 — les adversaires callent trop souvent avec des mains dominées."
        ],
        widen: "Si le CO est un joueur récréatif qui ouvre très large (> 35%), défends presque tout ce qui a un minimum de jouabilité. Value bet gros post-flop.",
        tighten: "Si le BTN squeeze souvent (cold-call dans un pot à 3 joueurs est risqué), 3-bet plus et call moins pour éviter les pots multiway OOP."
      },
      'vs BTN': {
        tips: [
          "Le BTN ouvre ~40% — c'est un range large avec beaucoup de mains faibles. Ta défense est très large.",
          "Tu vas jouer un gros volume de mains ici, donc c'est le spot le plus important à bien maîtriser.",
          "3-bet tes bonnes mains + des bluffs (Axs, Kxs, suited connectors). Call le reste de ta range de défense.",
          "Attention : tu seras toujours OOP. Privilégie les mains avec de bonnes nut possibilités (flush draw, straights)."
        ],
        widen: "Si le BTN ouvre > 50% ou ne 4-bet presque jamais, 3-bet plus agressivement et call plus de trash suited.",
        tighten: "Si le BTN est tight (ouvre < 35%) ou 4-bet beaucoup, réduis tes 3-bet bluffs et ne défends que les mains avec un vrai potentiel."
      },
      'vs SB': {
        tips: [
          "La SB ouvre ~35% mais tu as la POSITION post-flop. C'est le spot où tu défends le plus large.",
          "Tu as le dernier mot sur chaque street — cet avantage positionnel compense la qualité inférieure de ta main.",
          "3-bet large pour value ET en bluff : la SB est dans la pire position de la table si elle call.",
          "Quand tu call, tu vois le flop en heads-up en position — situation idéale même avec des mains marginales."
        ],
        widen: "Si la SB limp souvent au lieu de raiser, raise ses limps très large (65%+). Les limpers SB en NL2 sont souvent des joueurs faibles.",
        tighten: "Si la SB ne raise que des mains premium (< 20%), traite-le comme un open UTG et resserre ta défense en conséquence."
      }
    },
    '3bet': {
      'vs UTG': {
        tips: [
          "3-bet principalement pour value. L'UTG a un range fort, tes bluffs ne passeront pas assez souvent en NL2.",
          "Les paires TT-77 callent pour set mining plutôt que 3-bet, car 3-bet/fold ces mains face à un 4-bet est coûteux."
        ],
        widen: "Si l'UTG fold > 60% aux 3-bet (rare en NL2, mais possible), tu peux ajouter des 3-bet bluffs avec A5s, A4s, KQo.",
        tighten: "Si l'UTG ne fold jamais au 3-bet (call ou 4-bet systématiquement), 3-bet uniquement QQ+ et AKs. Tout le reste est call ou fold."
      },
      'vs HJ': {
        tips: [
          "Tu élargis un peu ton range de 3-bet value (ajout de TT et AJs).",
          "A5s et A4s sont tes premiers 3-bet bluffs : bons blockers sur AA/AK et potentiel nut flush."
        ],
        widen: "Si le HJ ouvre trop large et fold souvent au 3-bet, ajoute KJs, K9s et les Axs restants comme bluffs.",
        tighten: "Si le HJ 4-bet souvent ou ne fold jamais, retire les bluffs et garde uniquement la value pure (QQ+, AK)."
      },
      'vs CO': {
        tips: [
          "Le CO ouvre large, tes 3-bets deviennent plus profitables.",
          "AQo rejoint la range de 3-bet value. Les Axs bas sont de bons bluffs (blockers + equity).",
          "Depuis le BTN, ta position post-flop rend les 3-bets encore plus profitables."
        ],
        widen: "Si le CO fold beaucoup aux 3-bet ou ouvre très large, ajoute QJs, KTs et quelques suited connectors comme bluffs.",
        tighten: "Si le CO flat tes 3-bets et joue bien post-flop, privilégie les mains à forte equity qui dominent son range de call (AQo+, TT+)."
      },
      'vs BTN': {
        tips: [
          "Depuis les blinds, tu 3-bet le plus large ici. Le BTN ouvre ~40% de mains faibles.",
          "99 rejoint la value. Les Axs, KJs, et des suited connectors sont de bons bluffs.",
          "En NL2, les joueurs callent trop de 3-bets avec le BTN — value bet fort post-flop dans les pots 3-bet."
        ],
        widen: "Si le BTN ne 4-bet jamais et fold souvent au 3-bet, ta range de 3-bet peut monter à 15%+ avec plus de suited connectors.",
        tighten: "Si le BTN 4-bet light ou call et joue bien IP, limite-toi à la value forte et réduis les bluffs marginaux."
      }
    },
    vs3bet: {
      'UTG open': {
        tips: [
          "Tu as open UTG avec un range fort, mais face à un 3-bet tu dois resserrer beaucoup. Seules les meilleures mains continuent.",
          "4-bet uniquement AA, KK, QQ, AKs. Le reste est call ou fold.",
          "En NL2, les 3-bets sont souvent orientés value — les joueurs ne 3-bet bluffent pas assez. Fold plus que ce que le GTO suggère."
        ],
        widen: "Si le 3-betteur est un joueur agressif identifié qui 3-bet > 10%, tu peux call plus large (88, ATs, KJs) et 4-bet avec AKo.",
        tighten: "Si le 3-bet vient d'un joueur passif qui ne 3-bet presque jamais (< 4%), il a presque toujours une main premium. Fold tout sauf AA-QQ."
      },
      'HJ open': {
        tips: [
          "Même logique qu'UTG mais un peu plus large car ton open range initial est déjà plus large.",
          "88 rejoint le range de call. En NL2, call les paires moyennes pour set miner dans les pots 3-bet."
        ],
        widen: "Ajoute JJ au range de 4-bet et ATs, KJs au call si le 3-betteur est large et agressif.",
        tighten: "Face à un 3-bet d'un joueur tight, même approche : fold tout sauf les premiums."
      },
      'CO open': {
        tips: [
          "Ton range d'open CO est plus large, donc tu as plus de mains à défendre face au 3-bet.",
          "AKo rejoint le 4-bet range. Les paires 77+ et les bonnes suited se callent.",
          "A5s est un bon candidat de 4-bet bluff : il bloque AA et A5, et a de l'equity si call."
        ],
        widen: "Si le 3-betteur au BTN squeeze light, 4-bet plus (JJ, AQo) et call plus de suited.",
        tighten: "Si le 3-bet vient des blinds (SB ou BB), ils ont généralement un range plus fort. Fold les mains marginales."
      },
      'BTN open': {
        tips: [
          "Tu as le range d'open le plus large, donc tu dois défendre le plus. Mais tu gardes la position !",
          "JJ rejoint le 4-bet range. A5s est un 4-bet bluff standard.",
          "L'avantage positionnel post-flop compense la faiblesse relative de certaines mains — call plus large qu'en OOP."
        ],
        widen: "Si les blinds squeeze systématiquement (> 12%), 4-bet plus pour les punir et call moins (évite les pots OOP en calling).",
        tighten: "Si le squeeze vient d'un joueur très tight ou passif, donne du crédit à sa main et fold les marginales."
      }
    }
  },
  '8max': {
    rfi: {
      'UTG': {
        tips: [
          "Position la plus tight en 8-max : 6 joueurs peuvent agir derrière toi.",
          "Range similaire à l'UTG+1 en full ring — seulement les mains premium et quelques suited connectors."
        ],
        widen: "Table passive sans 3-bet ? Ajoute 66, A9s, K9s.",
        tighten: "Table agressive ? Joue seulement TT+, AQs+, AKo."
      },
      'UTG+1': {
        tips: [
          "Un peu plus large qu'UTG, mais toujours serré. 5 joueurs restent derrière.",
          "Les suited connectors (T9s, 98s) entrent pour la jouabilité."
        ],
        widen: "Peu de résistance ? Ajoute 55, A8s, K9s.",
        tighten: "Beaucoup de 3-bet ? Retire les suited connectors et QJo."
      },
      'HJ': {
        tips: [
          "Le HJ en 8-max est similaire au HJ en 6-max. Tu ouvres tous les Axs.",
          "Les broadway offsuit (KTo, QTo, JTo) sont jouables ici."
        ],
        widen: "Si CO et BTN foldent souvent, ajoute K7s, Q8s, 65s.",
        tighten: "Si les positions tardives 3-bet beaucoup (>10%), retire les broadway offsuit faibles."
      },
      'CO': {
        tips: [
          "Même range qu'en 6-max CO — la dynamique est identique avec BTN + blinds derrière."
        ],
        widen: "BTN tight ? Joue comme un BTN 6-max.",
        tighten: "BTN qui squeeze ? Resserre vers un range HJ."
      },
      'BTN': {
        tips: [
          "Range identique au BTN 6-max : position la plus profitable, ouvre très large (~40%)."
        ],
        widen: "Blinds tight ? Ouvre > 50%.",
        tighten: "Blinds agressives ? Resserre à 35%."
      },
      'SB': {
        tips: [
          "Raise ou fold, comme en 6-max. Pas de limp."
        ],
        widen: "BB tight ? Steal large.",
        tighten: "BB agressive ? Resserre à ~25%."
      }
    },
    bbdef: {
      'vs UTG': {
        tips: [
          "L'UTG 8-max ouvre ~13% — range très fort. Défends tight.",
          "3-bet uniquement QQ+ et AKs pour value. Pas de 3-bet bluff.",
          "Petites paires pour set mining, broadways suited pour implied odds."
        ],
        widen: "UTG ouvre > 18% ? Élargis avec plus de suited connectors.",
        tighten: "UTG nit (< 10%) ? Fold presque tout sauf JJ+ et AKs."
      },
      'vs UTG+1': {
        tips: [
          "UTG+1 ouvre ~17%. Légèrement plus large que vs UTG.",
          "JJ et AQs deviennent des 3-bet value."
        ],
        widen: "Joueur large ? Traite comme vs HJ.",
        tighten: "Joueur tight ? Traite comme vs UTG."
      },
      'vs HJ': {
        tips: [
          "Le HJ ouvre ~21%. Défense similaire au 6-max vs HJ.",
          "A5s et A4s sont de bons 3-bet bluffs : blockers sur AA/AK."
        ],
        widen: "HJ trop large ? 3-bet plus et call plus.",
        tighten: "HJ tight ? Traite comme vs UTG+1."
      },
      'vs CO': {
        tips: [
          "Identique au 6-max vs CO. Le CO ouvre ~27%.",
          "3-bet plus de mains pour value (99+, AJs+)."
        ],
        widen: "CO récréatif ? Défends très large.",
        tighten: "BTN squeeze souvent ? 3-bet plus, call moins."
      },
      'vs BTN': {
        tips: [
          "Identique au 6-max. Le BTN ouvre ~40% — ta défense est très large.",
          "Spot le plus fréquent — maîtrise-le en priorité."
        ],
        widen: "BTN ouvre > 50% ? Défends > 60%.",
        tighten: "BTN tight ou 4-bet souvent ? Réduis tes 3-bet bluffs."
      },
      'vs SB': {
        tips: [
          "Tu as la position ! Défends très large contre la SB.",
          "3-bet agressivement — la SB est OOP si elle call."
        ],
        widen: "SB qui limp ? Raise très large (70%+).",
        tighten: "SB tight ? Traite comme un open EP."
      }
    },
    '3bet': {
      'vs UTG': {
        tips: [
          "3-bet principalement pour value. L'UTG 8-max a un range très fort.",
          "Les paires TT-77 callent pour set mining."
        ],
        widen: "UTG fold > 60% aux 3-bet ? Ajoute A5s, A4s comme bluffs.",
        tighten: "UTG ne fold jamais ? 3-bet uniquement QQ+ et AKs."
      },
      'vs UTG+1': {
        tips: [
          "Légèrement plus large que vs UTG. TT et AJs rejoignent la value.",
          "A5s/A4s sont les premiers bluffs."
        ],
        widen: "UTG+1 large ? Ajoute KJs, K9s comme bluffs.",
        tighten: "UTG+1 tight ? QQ+ et AK seulement."
      },
      'vs HJ': {
        tips: [
          "Tu élargis un peu ton range de 3-bet value (ajout de TT et AJs).",
          "A5s et A4s sont tes premiers 3-bet bluffs : bons blockers sur AA/AK et potentiel nut flush."
        ],
        widen: "Si le HJ ouvre trop large et fold souvent au 3-bet, ajoute KJs, K9s et les Axs restants comme bluffs.",
        tighten: "Si le HJ 4-bet souvent ou ne fold jamais, retire les bluffs et garde uniquement la value pure (QQ+, AK)."
      },
      'vs CO': {
        tips: [
          "Le CO ouvre large, tes 3-bets deviennent plus profitables.",
          "AQo rejoint la range de 3-bet value. Les Axs bas sont de bons bluffs (blockers + equity).",
          "Depuis le BTN, ta position post-flop rend les 3-bets encore plus profitables."
        ],
        widen: "Si le CO fold beaucoup aux 3-bet ou ouvre très large, ajoute QJs, KTs et quelques suited connectors comme bluffs.",
        tighten: "Si le CO flat tes 3-bets et joue bien post-flop, privilégie les mains à forte equity qui dominent son range de call (AQo+, TT+)."
      },
      'vs BTN': {
        tips: [
          "Depuis les blinds, tu 3-bet le plus large ici. Le BTN ouvre ~40% de mains faibles.",
          "99 rejoint la value. Les Axs, KJs, et des suited connectors sont de bons bluffs.",
          "En NL2, les joueurs callent trop de 3-bets avec le BTN — value bet fort post-flop dans les pots 3-bet."
        ],
        widen: "Si le BTN ne 4-bet jamais et fold souvent au 3-bet, ta range de 3-bet peut monter à 15%+ avec plus de suited connectors.",
        tighten: "Si le BTN 4-bet light ou call et joue bien IP, limite-toi à la value forte et réduis les bluffs marginaux."
      }
    },
    vs3bet: {
      'UTG open': {
        tips: [
          "Face au 3-bet après open UTG 8-max, tu as le range le plus tight. 4-bet seulement AA-QQ et AKs.",
          "En NL2, un 3-bet vs UTG est presque toujours premium."
        ],
        widen: "3-betteur agressif ? Call AKo et JJ.",
        tighten: "3-betteur tight ? Fold tout sauf AA-KK."
      },
      'UTG+1 open': {
        tips: [
          "Même logique qu'UTG mais un peu plus large.",
          "88 et ATs rejoignent le call range."
        ],
        widen: "Ajoute JJ au 4-bet et ATs au call si 3-betteur large.",
        tighten: "Face à un tight, fold tout sauf les premiums."
      },
      'HJ open': {
        tips: [
          "Tu élargis un peu ton range de 4-bet (ajout de TT).",
          "A5s est un 4-bet bluff standard."
        ],
        widen: "Si le 3-betteur fold beaucoup, ajoute plus de bluffs (KJs, K9s).",
        tighten: "Si le 3-betteur ne fold jamais, concentre-toi sur la value pure."
      },
      'CO open': {
        tips: [
          "Tu commences à 4-bet plus de mains pour value — la range du CO est large.",
          "JJ rejoint le 4-bet range. AQo est un 4-bet value."
        ],
        widen: "Si le 3-betteur fold beaucoup, 4-bet plus large.",
        tighten: "Si le 3-betteur call tes 4-bets et joue bien, concentre-toi sur les mains premium (QQ+, AK)."
      },
      'BTN open': {
        tips: [
          "Tu as le range d'open le plus large, donc tu dois défendre le plus. Mais tu gardes la position !",
          "JJ rejoint le 4-bet range. A5s est un 4-bet bluff standard.",
          "L'avantage positionnel post-flop compense la faiblesse relative de certaines mains — call plus large qu'en OOP."
        ],
        widen: "Si les blinds squeeze systématiquement (> 12%), 4-bet plus pour les punir et call moins (évite les pots OOP en calling).",
        tighten: "Si le squeeze vient d'un joueur très tight ou passif, donne du crédit à sa main et fold les marginales."
      }
    }
  },
  '5max': {
    rfi: {
      'HJ': {
        tips: [
          "En 5-max, le HJ est la première position. Ton range est similaire au HJ en 6-max.",
          "Pas d'UTG devant toi, mais 3 joueurs restent — joue serré mais pas autant qu'UTG 6-max."
        ],
        widen: "Si la table est passive avec peu de 3-bet, ajoute K7s, 65s et A9o.",
        tighten: "Si les joueurs derrière sont agressifs, joue comme un UTG 6-max."
      },
      'CO': {
        tips: [
          "Position intermédiaire, tu commences à ouvrir plus large qu'en 6-max CO car il y a un joueur de moins.",
          "Les suited gappers et les petites paires sont profitables ici."
        ],
        widen: "Si le BTN fold beaucoup, tu peux jouer pratiquement comme un BTN 6-max.",
        tighten: "Si le BTN 3-bet souvent, resserre vers un range HJ-like."
      },
      'BTN': {
        tips: [
          "Encore plus large qu'en 6-max BTN — moins de joueurs = plus d'opportunités de voler les blinds.",
          "Tu peux ouvrir presque toutes les mains suited et beaucoup d'offsuit."
        ],
        widen: "Contre des blinds tight, ouvre > 50% et profite de la fold equity massive.",
        tighten: "Si les blinds défendent très large, joue plus tight et concentre-toi sur la value post-flop."
      },
      'SB': {
        tips: [
          "Même principe qu'en 6-max : raise ou fold, pas de limp.",
          "En 5-max, la dynamique SB vs BB est la même — tu es toujours OOP."
        ],
        widen: "BB très tight ? Raise plus large pour voler.",
        tighten: "BB agressive ? Resserre et ne raise que ce que tu es prêt à défendre face au 3-bet."
      }
    },
    bbdef: {
      'vs HJ': {
        tips: [
          "Le HJ en 5-max ouvre comme le HJ 6-max. Défends de manière similaire.",
          "Les Axs faibles se défendent bien en call pour les implied odds et le nut flush draw."
        ],
        widen: "Si le HJ ouvre trop large, 3-bet plus et call plus.",
        tighten: "Si le HJ est tight, traite-le comme un UTG 6-max."
      },
      'vs CO': {
        tips: [
          "Le CO en 5-max est légèrement plus large qu'en 6-max. Défends en conséquence.",
          "Les paires moyennes (66-99) se défendent très bien pour le set mining."
        ],
        widen: "CO très large ? Augmente tes 3-bets et élargis ta défense de call.",
        tighten: "Si le BTN squeeze beaucoup, 3-bet plus et call moins."
      },
      'vs BTN': {
        tips: [
          "Le BTN en 5-max ouvre encore plus large qu'en 6-max (~45-50%). Ta défense est très large.",
          "C'est le spot principal de volume — maîtrise cette situation en priorité.",
          "3-bet large pour value et en bluff, car le BTN a beaucoup de mains faibles."
        ],
        widen: "BTN trop large ? Défends > 60% et punit post-flop.",
        tighten: "BTN serré ou qui 4-bet souvent ? Réduis tes 3-bet bluffs."
      },
      'vs SB': {
        tips: [
          "Tu as la position sur la SB — avantage massif. Défends très large.",
          "3-bet plus agressivement car la SB sera toujours OOP si elle call."
        ],
        widen: "SB qui limp souvent ? Raise ses limps très agressivement (65%+).",
        tighten: "SB tight qui ne raise que des premiums ? Traite comme un open UTG."
      }
    },
    '3bet': {
      'vs HJ': {
        tips: [
          "3-bet pour value avec TT+, AKs/o, AQs, AJs.",
          "A5s et A4s sont les bluffs standards : blockers sur AA/AK."
        ],
        widen: "HJ ouvre trop large ? Ajoute des 3-bet bluffs (K9s, Q9s, suited connectors).",
        tighten: "HJ tight ? 3-bet uniquement QQ+ et AK."
      },
      'vs CO': {
        tips: [
          "Le CO 5-max est plus large qu'en 6-max — tes 3-bets sont plus profitables.",
          "AQo est un 3-bet value standard ici."
        ],
        widen: "Si le CO fold beaucoup au 3-bet, élargis tes bluffs (KTs, QTs, 87s).",
        tighten: "Si le CO flat tout et joue bien post-flop, limite tes bluffs."
      },
      'vs BTN': {
        tips: [
          "Spot le plus large pour 3-bet. 99 et ATs sont de la value pure.",
          "Le BTN a un range très large — tes 3-bets ont une fold equity maximale."
        ],
        widen: "BTN qui fold trop au 3-bet ? Monte à 14-16% de 3-bet avec plus de suited connectors.",
        tighten: "BTN qui call tout ? Réduis les bluffs et value bet gros post-flop."
      }
    },
    vs3bet: {
      'HJ open': {
        tips: [
          "4-bet QQ+, AKs uniquement. Call JJ, TT et les bons suited.",
          "En NL2, les 3-bets sont rarement des bluffs — respecte-les."
        ],
        widen: "3-betteur agressif identifié ? Call plus large et 4-bet AKo.",
        tighten: "3-betteur passif/tight ? Fold tout sauf AA-QQ."
      },
      'CO open': {
        tips: [
          "AKo devient un 4-bet. Paires moyennes et suited se callent.",
          "La position post-flop te donne de l'equity de réalisation supplémentaire."
        ],
        widen: "Squeeze light ? 4-bet JJ et call 66-77.",
        tighten: "3-bet de joueur tight ? Même resserrement que vs UTG."
      },
      'BTN open': {
        tips: [
          "Tu défends le plus large ici grâce à la position.",
          "JJ 4-bet, A5s en 4-bet bluff standard. Call tout le range moyen."
        ],
        widen: "Blinds squeeze trop ? 4-bet plus et call moins.",
        tighten: "Squeeze rare et fort ? Respect et fold les marginales."
      }
    }
  },
  'fr': {
    rfi: {
      'UTG': {
        tips: [
          "Position la plus tight en full ring : 8 joueurs peuvent agir après toi.",
          "Seulement les grosses paires (88+), les broadways suited et les meilleurs offsuit."
        ],
        widen: "Table très passive sans 3-bet ? Ajoute 77, A9s, KTs.",
        tighten: "Table agressive ? Joue seulement TT+, AQs+, AKo."
      },
      'UTG+1': {
        tips: [
          "Un joueur de moins, mais toujours très serré. 7 joueurs restent.",
          "Les suited connectors (T9s) commencent à être jouables."
        ],
        widen: "Peu de résistance ? Ajoute 66, A8s, K9s.",
        tighten: "Beaucoup de 3-bet ? Retire T9s, QTs et les offsuit les plus faibles."
      },
      'MP': {
        tips: [
          "Tu commences à élargir. Les paires moyennes (66+) et les suited broadways entrent.",
          "Le gap entre FR-MP et 6max-UTG est petit — range similaire."
        ],
        widen: "Si les positions tardives foldent souvent, ajoute 55, A7s, K8s.",
        tighten: "Table agressive ? Joue comme UTG+1."
      },
      'LJ': {
        tips: [
          "Équivalent du HJ en 6-max. Les Axs entrent et les suited connectors (87s).",
          "Tu peux ouvrir les broadways offsuit plus larges (QJo, KTo)."
        ],
        widen: "Table passive ? Ajoute A4s-A2s, K7s, 76s.",
        tighten: "Si le HJ ou CO 3-bet beaucoup, retire les mains marginales."
      },
      'HJ': {
        tips: [
          "Range similaire au CO en 6-max. Bon équilibre entre steal et protection.",
          "Tous les Axs sont jouables, les suited gappers aussi."
        ],
        widen: "Peu de résistance des positions tardives ? Ajoute K6s, Q7s, 65s.",
        tighten: "CO ou BTN très agressifs ? Resserre vers un range LJ."
      },
      'CO': {
        tips: [
          "Première vraie position de steal en full ring. Tu n'as que BTN + blinds derrière.",
          "Tu ouvres presque comme en 6-max CO — l'absence de joueurs devant ne change pas ta stratégie ici."
        ],
        widen: "BTN tight et blinds passives ? Ouvre comme un BTN 6-max.",
        tighten: "BTN qui squeeze ? Joue plus serré et choisit des mains qui supportent un 3-bet."
      },
      'BTN': {
        tips: [
          "Range quasi identique au BTN 6-max : tu ouvres large (~40%) pour la position.",
          "En full ring, les blinds sont souvent plus tight qu'en 6-max — plus de fold equity."
        ],
        widen: "Blinds très tight ? Ouvre jusqu'à 50%+ avec tous les suited et beaucoup d'offsuit.",
        tighten: "Blinds agressives ? Resserre vers 35% en retirant les offsuit et suited les plus faibles."
      },
      'SB': {
        tips: [
          "Raise ou fold, comme en 6-max. La position OOP rend le limp perdant.",
          "Range plus tight qu'en 6-max SB si les joueurs restants sont plus nombreux à avoir foldé (ils ont « filtré » le field)."
        ],
        widen: "BB qui fold beaucoup ? Steal plus large.",
        tighten: "BB qui défend très large ou 3-bet souvent ? Resserre à ~25%."
      }
    },
    bbdef: {
      'vs UTG': {
        tips: [
          "L'UTG full ring ouvre ~10% — le range le plus fort possible. Défends très tight.",
          "3-bet uniquement AA-QQ et AKs pour value. Pas de 3-bet bluff.",
          "Call les paires pour set mining et les broadways suited pour les implied odds."
        ],
        widen: "UTG ouvre trop large (> 15%) ? Tu peux élargir ta défense avec plus de suited connectors.",
        tighten: "UTG nit (< 8%) ? Fold presque tout sauf TT+ et AKs."
      },
      'vs UTG+1': {
        tips: [
          "Range légèrement plus large que vs UTG mais toujours tight.",
          "JJ et AQs deviennent des 3-bet value. Les suited connectors se callent."
        ],
        widen: "Joueur large ? Traite comme un vs MP.",
        tighten: "Joueur tight ? Traite comme un vs UTG."
      },
      'vs MP': {
        tips: [
          "Le MP ouvre ~15-18%. Tu commences à élargir ta défense.",
          "A5s peut devenir un 3-bet bluff occasionnel. Les paires 44+ se callent."
        ],
        widen: "MP qui ouvre > 22% ? Défends comme vs CO en 6-max.",
        tighten: "MP tight ? Reste sur une défense serrée style vs UTG+1."
      },
      'vs CO': {
        tips: [
          "Identique au vs CO en 6-max. Le CO full ring ouvre un range similaire (~25-28%).",
          "3-bet plus de mains pour value (99+, AJs+) et ajoute des bluffs."
        ],
        widen: "CO récréatif ? Défends très large et punit post-flop.",
        tighten: "BTN qui cold-call souvent ? 3-bet plus, call moins pour éviter le multiway OOP."
      },
      'vs BTN': {
        tips: [
          "Le BTN ouvre ~40% en FR comme en 6-max. Ta défense est très large.",
          "C'est le spot le plus fréquent et le plus important — maîtrise-le en priorité.",
          "3-bet wide (88+, Axs, broadways) et call le reste de la défense."
        ],
        widen: "BTN qui ouvre > 50% ? Défends > 60% et 3-bet agressivement.",
        tighten: "BTN tight ou qui 4-bet beaucoup ? Réduis tes 3-bet bluffs et call plus."
      },
      'vs SB': {
        tips: [
          "Tu as la position ! Défends très large contre la SB.",
          "3-bet agressivement — la SB est dans la pire situation si elle call.",
          "Même des mains offsuit faibles peuvent se call si la SB ouvre large."
        ],
        widen: "SB qui limp ? Raise ses limps très large (70%+) — gros edge positionnel.",
        tighten: "SB tight qui ne raise que des premiums ? Traite comme un open EP et resserre."
      }
    },
    '3bet': {
      'vs UTG': {
        tips: [
          "Full ring UTG est le range le plus fort. 3-bet uniquement AA-QQ et AKs.",
          "Les joueurs NL2 ne 3-bet bluffent presque jamais vs UTG, et c'est correct."
        ],
        widen: "UTG ouvre large ? Ajoute JJ et AKo au 3-bet.",
        tighten: "UTG nit ? Seuls AA et KK justifient un 3-bet."
      },
      'vs MP': {
        tips: [
          "JJ rejoint le 3-bet value. AKo et AQs aussi.",
          "Les set miners (TT-77) se callent pour les implied odds."
        ],
        widen: "MP trop large ? Ajoute AJs, KQs au 3-bet.",
        tighten: "MP très tight ? Même approche que vs UTG."
      },
      'vs CO': {
        tips: [
          "Le CO ouvre large — tes 3-bets sont plus profitables.",
          "TT est un 3-bet value. A5s/A4s sont les bluffs standards."
        ],
        widen: "CO très large ? Ajoute 99, KJs, QJs aux 3-bet value/bluff.",
        tighten: "CO tight ? Resserre vers une range vs MP."
      },
      'vs BTN': {
        tips: [
          "Spot de 3-bet le plus large. 99+ est de la value, Axs et suited connectors sont des bluffs.",
          "En FR les blinds sont souvent plus tight — tu auras plus de heads-up vs BTN si tu 3-bet."
        ],
        widen: "BTN trop large et fold au 3-bet ? Monte à 14%+ de 3-bet.",
        tighten: "BTN qui call tout ? Value only, pas de bluffs."
      }
    },
    vs3bet: {
      'UTG open': {
        tips: [
          "Face au 3-bet après un open UTG FR, tu as le range le plus tight. 4-bet seulement AA-QQ et AKs.",
          "En NL2, un 3-bet face à ton open UTG est presque toujours une main premium. Respecte-le."
        ],
        widen: "3-betteur identifié comme agressif ? Call AKo et JJ.",
        tighten: "3-betteur tight ou inconnu ? Fold tout sauf AA-KK."
      },
      'MP open': {
        tips: [
          "Même chose qu'UTG mais un poil plus large. JJ et AKo peuvent call.",
          "Les 3-bets en FR sont encore plus orientés value qu'en 6-max."
        ],
        widen: "3-betteur agressif ? Call TT, AQs, KQs.",
        tighten: "3-betteur inconnu/tight ? Même range que vs UTG."
      },
      'CO open': {
        tips: [
          "AKo devient un 4-bet. Les paires moyennes et suited se callent.",
          "Attention au squeeze : si le BTN ou les blinds squeeze, c'est souvent fort en NL2."
        ],
        widen: "Squeeze light identifié ? 4-bet JJ et call 66-77.",
        tighten: "3-bet de joueur tight ? Fold tout sauf QQ+ et AKs."
      },
      'BTN open': {
        tips: [
          "Tu défends le plus large ici. JJ est un 4-bet, A5s en 4-bet bluff.",
          "Tu as la position si la SB ou BB 3-bet — gros avantage pour flat."
        ],
        widen: "Blinds qui squeeze light ? 4-bet plus large et call moins.",
        tighten: "3-bet rare de joueur tight ? Fold les marginales sans hésiter."
      }
    }
  }
};

// ============================================================
// RANGE RENDERING
// ============================================================
let currentFormat = '6max';
let currentSituation = 'rfi';

function setFormat(f) {
  currentFormat = f;
  document.querySelectorAll('#btn-6max,#btn-5max,#btn-8max,#btn-fr').forEach(b => b.classList.remove('btn-active'));
  document.getElementById('btn-' + f).classList.add('btn-active');
  renderRanges();
}

function setSituation(s) {
  currentSituation = s;
  document.querySelectorAll('#btn-rfi,#btn-vs3bet,#btn-3bet,#btn-bbdef').forEach(b => b.classList.remove('btn-active'));
  document.getElementById('btn-' + s).classList.add('btn-active');
  renderRanges();
}

function renderRanges() {
  const container = document.getElementById('range-display');
  if (!container) return;
  const statsContainer = document.getElementById('range-stats-display');
  container.innerHTML = '';
  if (statsContainer) statsContainer.innerHTML = '';

  const data = RANGES[currentFormat][currentSituation];
  if (!data) {
    container.innerHTML = '<p style="text-align:center">Données non disponibles pour cette combinaison.</p>';
    return;
  }

  Object.keys(data).forEach(pos => {
    const wrapper = document.createElement('div');
    wrapper.className = 'range-wrapper';
    wrapper.innerHTML = `<h4>${pos}</h4>`;

    const grid = document.createElement('div');
    grid.className = 'range-grid';

    const posData = data[pos];
    const raiseSet = posData.raise || new Set();
    const callSet  = posData.call  || new Set();
    const looseSet = posData.looseRaise || new Set();
    let raiseCount = 0, callCount = 0, looseCount = 0;

    for (let r = 0; r < 13; r++) {
      for (let c = 0; c < 13; c++) {
        const hand = handAt(r, c);
        const cell = document.createElement('div');
        cell.className = 'range-cell';
        cell.textContent = hand;
        cell.title = hand;

        const combos = (r === c) ? 6 : (r < c) ? 4 : 12;

        if (raiseSet.has(hand)) {
          cell.classList.add(currentSituation === 'rfi' ? 'raise' : 'threebet');
          raiseCount += combos;
        } else if (looseSet.has(hand)) {
          cell.classList.add('loose');
          looseCount += combos;
        } else if (callSet.has(hand)) {
          cell.classList.add('call');
          callCount += combos;
        } else {
          cell.classList.add('fold');
        }
        grid.appendChild(cell);
      }
    }

    wrapper.appendChild(grid);

    const stats = document.createElement('div');
    stats.className = 'range-stats';
    const raisePct = ((raiseCount / 1326) * 100).toFixed(1);
    const callPct  = ((callCount / 1326) * 100).toFixed(1);
    const loosePct = ((looseCount / 1326) * 100).toFixed(1);
    const totalPct = (((raiseCount + callCount + looseCount) / 1326) * 100).toFixed(1);

    const raiseLabel = currentSituation === '3bet' ? '3-Bet'
      : currentSituation === 'vs3bet' ? '4-Bet'
      : currentSituation === 'bbdef' ? '3-Bet'
      : 'Open';
    const raiseColor = currentSituation === 'rfi' ? 'var(--red)' : 'var(--purple)';

    stats.innerHTML = `
      <div class="range-stat"><div class="val">${totalPct}%</div><div class="lbl">Total</div></div>
      <div class="range-stat"><div class="val" style="color:${raiseColor}">${raisePct}%</div><div class="lbl">${raiseLabel}</div></div>
      ${looseCount > 0 ? `<div class="range-stat"><div class="val" style="color:var(--loose)">${loosePct}%</div><div class="lbl">Loose</div></div>` : ''}
      ${callCount > 0 ? `<div class="range-stat"><div class="val" style="color:var(--call)">${callPct}%</div><div class="lbl">Call</div></div>` : ''}
    `;
    wrapper.appendChild(stats);

    // --- Personal notes from poker-tracker ---
    if (posData.notes && posData.notes.trim()) {
      const personalNotes = document.createElement('div');
      personalNotes.className = 'range-notes range-notes-personal';
      const escaped = posData.notes
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
      personalNotes.innerHTML = `<div class="range-note-personal-title">Notes perso</div><div>${escaped}</div>`;
      wrapper.appendChild(personalNotes);
    }

    // --- Contextual notes ---
    const notesData = RANGE_NOTES[currentFormat]?.[currentSituation]?.[pos];
    if (notesData) {
      const notesDiv = document.createElement('div');
      notesDiv.className = 'range-notes';
      let notesHTML = '';
      if (notesData.tips) {
        notesHTML += notesData.tips.map(t => `<div class="range-note-tip">${t}</div>`).join('');
      }
      if (notesData.widen) {
        notesHTML += `<div class="range-note-widen"><strong>&#9650; Élargir :</strong> ${notesData.widen}</div>`;
      }
      if (notesData.tighten) {
        notesHTML += `<div class="range-note-tighten"><strong>&#9660; Resserrer :</strong> ${notesData.tighten}</div>`;
      }
      notesDiv.innerHTML = notesHTML;
      wrapper.appendChild(notesDiv);
    }

    container.appendChild(wrapper);
  });
}

// ============================================================
// POT ODDS CALCULATOR
// ============================================================
function calcPotOdds() {
  const pot  = parseFloat(document.getElementById('calc-pot')?.value)  || 0;
  const bet  = parseFloat(document.getElementById('calc-bet')?.value)  || 0;
  const outs = parseInt(document.getElementById('calc-outs')?.value)   || 0;
  const street = document.getElementById('calc-street')?.value || 'flop';
  const resultEl = document.getElementById('calc-result');
  if (!resultEl) return;

  if (bet === 0) { resultEl.innerHTML = '<p>Entre une mise adverse pour calculer.</p>'; return; }

  const totalPot = pot + bet + bet;
  const potOdds  = (bet / totalPot * 100);
  const multiplier = street === 'flop' ? 4 : 2;
  const approxEquity = outs * multiplier;
  const profitable = approxEquity >= potOdds;

  resultEl.innerHTML = `
    <div style="display:flex;gap:30px;justify-content:center;flex-wrap:wrap">
      <div><div class="big">${potOdds.toFixed(1)}%</div><div style="color:var(--text2);font-size:0.85rem">Pot Odds (tu dois gagner)</div></div>
      <div><div class="big" style="color:${profitable ? 'var(--call)' : 'var(--red)'}">${approxEquity.toFixed(1)}%</div><div style="color:var(--text2);font-size:0.85rem">Ton equity (${outs} outs × ${multiplier})</div></div>
    </div>
    <div style="margin-top:14px;font-size:1rem;color:${profitable ? 'var(--call)' : 'var(--red)'}">
      <strong>${profitable ? '&#10004; CALL profitable' : '&#10008; FOLD (sauf bonnes implied odds)'}</strong>
    </div>
    <div style="margin-top:8px;color:var(--text2);font-size:0.8rem">
      Pot total après call : ${totalPot.toFixed(2)}€ — Cotes : ${(1/potOdds*100).toFixed(1)}:1
    </div>`;
}

// ============================================================
// QUIZ
// ============================================================
const QUIZ_DATA = [
  { q:"Tu es au Bouton avec A♠ J♦. Tout le monde a foldé. Que fais-tu ?", opts:["Fold","Limp (call la BB)","Raise 2.5 BB","Raise 5 BB"], correct:2, explain:"AJo est clairement dans ta range d'open au bouton. Tu raises 2.5 BB (ou 3 BB en NL2). Ne jamais limp en first in !" },
  { q:"Tu es UTG en 6-max avec 8♠ 7♠. Que fais-tu ?", opts:["Raise 2.5 BB","Limp","Fold"], correct:2, explain:"87s est trop faible pour ouvrir UTG en 6-max. Même si c'est suited, la position est trop précoce. Garde cette main pour le CO/BTN." },
  { q:"Le pot fait 0.20€, ton adversaire mise 0.10€. Tu as un tirage couleur (9 outs) au flop. Que fais-tu ?", opts:["Fold — trop cher","Call — les cotes sont bonnes","Raise all-in"], correct:1, explain:"Pot odds = 0.10 / (0.20 + 0.10 + 0.10) = 25%. Ton equity avec 9 outs au flop ≈ 36% (9×4). 36% > 25%, le call est clairement profitable." },
  { q:"Tu as open au CO, le joueur au BTN te 3-bet. Tu as K♠ Q♠. Que fais-tu ?", opts:["Fold","Call","4-bet all-in"], correct:1, explain:"KQs est une main trop forte pour folder face à un 3-bet quand tu as ouvert au CO, mais pas assez forte pour 4-bet. Le call est la bonne option." },
  { q:"Tu as c-bet le flop (A♠ 7♦ 2♣) avec K♦ Q♦ et ton adversaire a call. La turn est le 4♣. Que fais-tu ?", opts:["Double barrel (2nd bet)","Check","Check-raise si l'adversaire mise"], correct:1, explain:"En NL2, quand un joueur call ton c-bet sur un flop A-high, il a souvent un As. Le 4♣ n'améliore pas ton range. Sans equity, c'est un check." },
  { q:"Tu as un set de 7 sur un board 7♥ 8♠ 9♠ au flop. Quel sizing de c-bet ?", opts:["25% du pot (petit)","66-75% du pot (gros)","Check pour slowplay"], correct:1, explain:"Le board est très drawy (tirages couleur et quinte possibles). Tu dois bet gros pour refuser les bonnes cotes aux tirages." },
  { q:"Tu as perdu 3 buy-ins en 30 minutes. Que fais-tu ?", opts:["Continuer — la variance va se retourner","Monter de limite pour se refaire","Arrêter la session, faire une pause","Ajouter des tables"], correct:2, explain:"C'est ton stop-loss ! Après 3 buy-ins de perte, arrête la session. Tu es probablement en tilt et tes décisions seront moins bonnes." },
  { q:"En SB, tout le monde a foldé jusqu'à toi. Tu as J♦ 8♣. Que fais-tu ?", opts:["Limp pour voir le flop","Raise 2.5-3 BB","Fold"], correct:2, explain:"J8o est trop faible pour la stratégie SB simplifiée en NL2 (raise ou fold). Tu seras hors position tout le coup. Fold." },
  { q:"Quel VPIP/PFR cible en 6-max NL2 ?", opts:["12/10 — très tight","20-24 / 17-21 — TAG","35/30 — LAG","50/15 — loose-passive"], correct:1, explain:"Un profil TAG avec VPIP 20-24% et PFR 17-21% est optimal en NL2. L'écart VPIP-PFR doit être petit (pas de limp)." },
  { q:"Tu es au BTN avec A♠ 5♠ face à un open du CO. Que fais-tu ?", opts:["Fold","Call","3-Bet"], correct:2, explain:"A5s est un excellent candidat de 3-bet au BTN vs CO : suited avec un As (blockers), equity nut flush draw, et fold equity." }
];

let quizScore = 0;
let quizAnswered = new Set();

function renderQuiz() {
  const container = document.getElementById('quiz-container');
  if (!container) return;
  container.innerHTML = QUIZ_DATA.map((q, i) => `
    <div class="quiz-q" id="quiz-${i}">
      <h4>Question ${i+1} : ${q.q}</h4>
      ${q.opts.map((opt, j) => `<button class="quiz-option" onclick="answerQuiz(${i},${j})">${opt}</button>`).join('')}
      <div class="quiz-explain" id="quiz-explain-${i}">${q.explain}</div>
    </div>`).join('');
}

function answerQuiz(qi, oi) {
  if (quizAnswered.has(qi)) return;
  quizAnswered.add(qi);
  const q = QUIZ_DATA[qi];
  const qEl = document.getElementById('quiz-' + qi);
  qEl.querySelectorAll('.quiz-option').forEach((b, j) => {
    b.style.cursor = 'default';
    if (j === q.correct) b.classList.add('correct');
    if (j === oi && oi !== q.correct) b.classList.add('wrong');
  });
  if (oi === q.correct) quizScore++;
  const explain = document.getElementById('quiz-explain-' + qi);
  explain.className = `quiz-explain show ${oi === q.correct ? 'correct-exp' : 'wrong-exp'}`;

  document.getElementById('quiz-score').innerHTML = `
    <div style="font-size:1.2rem;color:var(--accent);font-weight:700">
      Score : ${quizScore} / ${quizAnswered.size}
      ${quizAnswered.size === QUIZ_DATA.length ? `<br><span style="font-size:1rem;color:var(--text2)">${quizScore >= 8 ? 'Excellent !' : quizScore >= 6 ? 'Bien ! Revois les concepts manqués.' : 'Continue à étudier !'}</span>` : ''}
    </div>`;
}

// ============================================================
// RANGE TRAINER
// ============================================================

// Table seat layouts for each format
const TABLE_SEATS = {
  '5max': ['CO','BTN','SB','BB','HJ'],
  '6max': ['HJ','CO','BTN','SB','BB','UTG'],
  '8max': ['UTG+1','HJ','CO','BTN','SB','BB','UTG','MP'],
  'fr':   ['UTG+1','MP','LJ','HJ','CO','BTN','SB','BB','UTG']
};

// Seat position coordinates (% of wrapper)
const SEAT_POSITIONS = {
  5: [
    { left: 50, top: 0 },
    { left: 88, top: 40 },
    { left: 72, top: 88 },
    { left: 28, top: 88 },
    { left: 8, top: 40 },
  ],
  6: [
    { left: 35, top: 0 },
    { left: 68, top: 0 },
    { left: 90, top: 45 },
    { left: 68, top: 88 },
    { left: 35, top: 88 },
    { left: 8, top: 45 },
  ],
  8: [
    { left: 50, top: 0 },
    { left: 78, top: 8 },
    { left: 92, top: 45 },
    { left: 78, top: 82 },
    { left: 50, top: 92 },
    { left: 22, top: 82 },
    { left: 8, top: 45 },
    { left: 22, top: 8 },
  ],
  9: [
    { left: 35, top: 0 },
    { left: 62, top: 0 },
    { left: 85, top: 15 },
    { left: 92, top: 50 },
    { left: 78, top: 85 },
    { left: 50, top: 92 },
    { left: 22, top: 85 },
    { left: 8, top: 50 },
    { left: 15, top: 15 },
  ]
};

const ALL_SITUATIONS = ['rfi', 'bbdef', '3bet', 'vs3bet'];
const ALL_HERO_POSITIONS = ['HJ', 'CO', 'BTN', 'SB', 'BB'];

function loadFromStorage(key, fallback, validator) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(saved) && saved.length > 0 && saved.every(validator)) return saved;
  } catch (e) {}
  return fallback;
}

let trainerState = {
  format: '5max',
  situation: null,
  currentPos: null,
  currentHand: null,
  answered: false,
  tableState: null,
  stats: { total: 0, correct: 0 },
  enabledSituations: typeof localStorage !== 'undefined'
    ? loadFromStorage('trainer-enabled-sits', [...ALL_SITUATIONS], s => ALL_SITUATIONS.includes(s))
    : [...ALL_SITUATIONS],
  enabledPositions: typeof localStorage !== 'undefined'
    ? loadFromStorage('trainer-enabled-positions', [...ALL_HERO_POSITIONS], p => ALL_HERO_POSITIONS.includes(p))
    : [...ALL_HERO_POSITIONS],
  includeLoose: (() => {
    try {
      const v = localStorage.getItem('trainer-include-loose');
      return v === null ? true : v === 'true';
    } catch (e) { return true; }
  })()
};

// Determine the hero position for a given situation + position key
function getHeroForScenario(sit, posKey) {
  if (sit === 'rfi') return posKey;
  if (sit === 'bbdef') return 'BB';
  if (sit === '3bet') {
    if (posKey.includes(' vs ')) return posKey.split(' vs ')[0];
    return null; // generic 'vs X' keys: hero is variable
  }
  if (sit === 'vs3bet') return posKey.replace(' open', '');
  return null;
}

const OPEN_SIZES = { 'HJ': 3, 'CO': 2.5, 'BTN': 2.5, 'SB': 3, 'UTG': 3, 'UTG+1': 3, 'MP': 2.5, 'LJ': 2.5 };
function openSize(pos) { return OPEN_SIZES[pos] || 2.5; }

function initTrainer() {
  const container = document.getElementById('trainer-container');
  if (!container) return;
  trainerState.stats = { total: 0, correct: 0 };
  showNextTrainerHand();
}

function getSituationLabel(sit) {
  const labels = {
    'rfi': 'Open',
    'bbdef': 'BB Défense',
    '3bet': '3-Bet (cold)',
    'vs3bet': 'Face au 3-Bet'
  };
  return labels[sit] || sit;
}

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function handToCards(hand) {
  const suits = ['♠','♥','♦','♣'];
  const rank1 = hand[0];
  const rank2 = hand[1];

  if (hand.length === 2) {
    // Pair
    return [
      { rank: rank1, suit: '♠', color: 'black' },
      { rank: rank2, suit: '♥', color: 'red' }
    ];
  } else if (hand[2] === 's') {
    // Suited
    return [
      { rank: rank1, suit: '♠', color: 'black' },
      { rank: rank2, suit: '♠', color: 'black' }
    ];
  } else {
    // Offsuit
    return [
      { rank: rank1, suit: '♠', color: 'black' },
      { rank: rank2, suit: '♥', color: 'red' }
    ];
  }
}

function getActionOrder(seats) {
  // Action order: all seats except SB/BB first, then SB, then BB
  const sbIdx = seats.indexOf('SB');
  const bbIdx = seats.indexOf('BB');
  const nonBlinds = seats.filter(s => s !== 'SB' && s !== 'BB');
  return [...nonBlinds, 'SB', 'BB'];
}

function getTableState(format, situation, heroPos) {
  const seats = TABLE_SEATS[format];
  const btnIdx = seats.indexOf('BTN');
  let heroIdx, states = [];

  if (situation === 'rfi') {
    // Hero is at heroPos, everyone before in action order folded
    heroIdx = seats.indexOf(heroPos);
    const actionOrder = getActionOrder(seats);
    const heroActionIdx = actionOrder.indexOf(heroPos);

    for (let i = 0; i < seats.length; i++) {
      const pos = seats[i];
      const actionIdx = actionOrder.indexOf(pos);
      if (pos === heroPos) {
        states.push({ pos, state: 'hero', cards: true });
      } else if (actionIdx < heroActionIdx) {
        states.push({ pos, state: 'fold' });
      } else if (pos === 'SB') {
        states.push({ pos, state: 'blind', amount: 0.5 });
      } else if (pos === 'BB') {
        states.push({ pos, state: 'blind', amount: 1 });
      } else {
        states.push({ pos, state: 'waiting' });
      }
    }
  }
  else if (situation === 'bbdef') {
    const villainPos = heroPos.replace('vs ', '');
    heroIdx = seats.indexOf('BB');
    const actionOrder = getActionOrder(seats);
    const villainActionIdx = actionOrder.indexOf(villainPos);

    for (let i = 0; i < seats.length; i++) {
      const pos = seats[i];
      const actionIdx = actionOrder.indexOf(pos);
      if (pos === 'BB') {
        states.push({ pos, state: 'hero', cards: true });
      } else if (pos === villainPos) {
        states.push({ pos, state: 'raise', amount: openSize(villainPos) });
      } else if (pos === 'SB') {
        states.push({ pos, state: 'fold' });
      } else if (actionIdx < villainActionIdx) {
        states.push({ pos, state: 'fold' });
      } else {
        states.push({ pos, state: 'fold' });
      }
    }
  }
  else if (situation === '3bet') {
    const actionOrder = getActionOrder(seats);
    let heroPosition, villainPos;
    if (heroPos.includes(' vs ')) {
      [heroPosition, villainPos] = heroPos.split(' vs ');
    } else {
      villainPos = heroPos.replace('vs ', '');
      const villainActionIdx = actionOrder.indexOf(villainPos);
      if (villainActionIdx >= actionOrder.indexOf('BTN')) heroPosition = actionOrder[actionOrder.length - 1];
      else if (villainActionIdx >= actionOrder.indexOf('CO')) heroPosition = 'BTN';
      else heroPosition = 'CO';
    }
    const villainActionIdx = actionOrder.indexOf(villainPos);
    heroIdx = seats.indexOf(heroPosition);
    const heroActionIdx = actionOrder.indexOf(heroPosition);

    for (let i = 0; i < seats.length; i++) {
      const pos = seats[i];
      const actionIdx = actionOrder.indexOf(pos);
      if (pos === heroPosition) {
        states.push({ pos, state: 'hero', cards: true });
      } else if (pos === villainPos) {
        states.push({ pos, state: 'raise', amount: openSize(villainPos) });
      } else if ((pos === 'SB' || pos === 'BB') && actionIdx > heroActionIdx) {
        states.push({ pos, state: 'blind', amount: pos === 'SB' ? 0.5 : 1 });
      } else if (actionIdx < villainActionIdx || (actionIdx > villainActionIdx && actionIdx < heroActionIdx)) {
        states.push({ pos, state: 'fold' });
      } else {
        states.push({ pos, state: 'waiting' });
      }
    }
  }
  else if (situation === 'vs3bet') {
    const heroPosition = heroPos.replace(' open', '');
    heroIdx = seats.indexOf(heroPosition);
    const actionOrder = getActionOrder(seats);
    const heroActionIdx = actionOrder.indexOf(heroPosition);

    // Pick 3-bettor among positions that act after hero
    const after = actionOrder.slice(heroActionIdx + 1).filter(p => seats.includes(p));
    const threeBettor = after.length ? pickRandom(after) : 'BB';
    const openAmt = openSize(heroPosition);
    const threeBetAmt = (threeBettor === 'SB' || threeBettor === 'BB') ? openAmt * 4 : openAmt * 3;

    for (let i = 0; i < seats.length; i++) {
      const pos = seats[i];
      if (pos === heroPosition) {
        states.push({ pos, state: 'hero-raised', cards: true, amount: openAmt });
      } else if (pos === threeBettor) {
        states.push({ pos, state: '3bet', amount: threeBetAmt });
      } else {
        states.push({ pos, state: 'fold' });
      }
    }
  }

  return { seats, states, heroIdx, btnIdx };
}

function showNextTrainerHand() {
  const fmt = trainerState.format;
  const formatData = RANGES[fmt];

  // Build flat list of (sit, posKey, hero) scenarios
  const allScenarios = [];
  for (const sit of Object.keys(formatData)) {
    for (const posKey of Object.keys(formatData[sit])) {
      allScenarios.push({ sit, posKey, hero: getHeroForScenario(sit, posKey) });
    }
  }

  // Filter by enabled situations + positions (null hero accepted only if no position filter)
  let pool = allScenarios.filter(sc =>
    trainerState.enabledSituations.includes(sc.sit) &&
    (sc.hero === null || trainerState.enabledPositions.includes(sc.hero))
  );
  if (pool.length === 0) {
    pool = allScenarios.filter(sc => trainerState.enabledSituations.includes(sc.sit));
  }
  if (pool.length === 0) pool = allScenarios;

  const chosen = pickRandom(pool);
  trainerState.situation = chosen.sit;
  trainerState.currentPos = chosen.posKey;

  // Pick random hand from all 169 combos
  const r = Math.floor(Math.random() * 13);
  const c = Math.floor(Math.random() * 13);
  trainerState.currentHand = handAt(r, c);
  trainerState.answered = false;

  // Build table state
  trainerState.tableState = getTableState(fmt, chosen.sit, chosen.posKey);

  renderPokerTable();
}

function buildScenarioText() {
  const sit = trainerState.situation;
  const pos = trainerState.currentPos;
  const hand = trainerState.currentHand;
  if (sit === 'rfi') {
    return `Tu es <strong>${pos}</strong>. L'action te revient (tout le monde fold avant). Tu as <strong>${hand}</strong>.`;
  } else if (sit === 'bbdef') {
    const villain = pos.replace('vs ', '');
    return `Tu es <strong>BB</strong>. <strong>${villain}</strong> ouvre à ${openSize(villain)}bb (les autres foldent). Tu as <strong>${hand}</strong>.`;
  } else if (sit === '3bet') {
    let hero, villain;
    if (pos.includes(' vs ')) [hero, villain] = pos.split(' vs ');
    else { villain = pos.replace('vs ', ''); hero = 'BTN'; }
    return `Tu es <strong>${hero}</strong>. <strong>${villain}</strong> ouvre à ${openSize(villain)}bb. Tu as <strong>${hand}</strong>.`;
  } else if (sit === 'vs3bet') {
    const hero = pos.replace(' open', '');
    const ts = trainerState.tableState;
    const threeBettor = ts.states.find(s => s.state === '3bet')?.pos || 'un joueur derrière';
    return `Tu es <strong>${hero}</strong>, tu as ouvert à ${openSize(hero)}bb. <strong>${threeBettor}</strong> te 3-bet. Tu as <strong>${hand}</strong>.`;
  }
  return '';
}

function renderPokerTable() {
  const container = document.getElementById('trainer-container');
  const { seats, states, heroIdx, btnIdx } = trainerState.tableState;
  const hand = trainerState.currentHand;
  const cards = handToCards(hand);
  const numSeats = seats.length;
  const positions = SEAT_POSITIONS[numSeats];
  const fmt = trainerState.format;
  const sit = trainerState.situation;
  const pos = trainerState.currentPos;

  const formatLabel = {'6max':'6-Max','5max':'5-Max','8max':'8-Max','fr':'Full Ring'}[fmt];
  const sitLabel = getSituationLabel(sit);

  let seatsHTML = '';
  for (let i = 0; i < numSeats; i++) {
    const seatPos = positions[i];
    const st = states[i];
    const isHero = st.state === 'hero' || st.state === 'hero-raised';

    // Cards display
    let cardsHTML = '';
    if (isHero) {
      cardsHTML = `<div class="poker-cards">
        ${cards.map(c => `<div class="poker-card ${c.color}"><span class="poker-card-rank">${c.rank}</span><span class="poker-card-suit">${c.suit}</span></div>`).join('')}
      </div>`;
    } else if (st.state === 'waiting' || st.state === 'blind') {
      cardsHTML = `<div class="poker-cards"><div class="poker-card-back"></div><div class="poker-card-back"></div></div>`;
    }

    // Action label
    let actionHTML = '';
    if (st.state === 'fold') {
      actionHTML = `<div class="poker-action-label poker-action-fold">Fold</div>`;
    } else if (st.state === 'raise' || st.state === 'hero-raised') {
      actionHTML = `<div class="poker-action-label poker-action-raise">Raise</div>`;
    } else if (st.state === '3bet') {
      actionHTML = `<div class="poker-action-label poker-action-3bet">3-Bet</div>`;
    }

    // Chip amount
    let chipHTML = '';
    if (st.amount) {
      const chipColor = st.state === 'blind' ? 'blue' : 'red';
      chipHTML = `<div class="poker-chip-display"><span class="poker-chip-icon ${chipColor}"></span> ${st.amount}</div>`;
    }

    seatsHTML += `
      <div class="poker-seat" style="left:${seatPos.left}%;top:${seatPos.top}%;">
        ${cardsHTML}
        <div class="poker-seat-circle${isHero ? ' hero' : ''}">
          <div class="poker-seat-name">${st.pos}</div>
          ${isHero ? '<div class="poker-seat-stack">100</div>' : ''}
        </div>
        ${actionHTML}
        ${chipHTML}
      </div>
    `;
  }

  // Dealer button position
  const btnSeatPos = positions[btnIdx];
  const dealerHTML = `<div class="poker-dealer-btn" style="left:${btnSeatPos.left + 3}%;top:${btnSeatPos.top + 5}%;">D</div>`;

  // Action buttons
  const disabled = trainerState.answered ? 'disabled' : '';
  let actionBtns = '';
  if (sit === 'rfi') {
    actionBtns = `
      <button ${disabled} onclick="answerTrainer('Fold')">FOLD</button>
      <button ${disabled} onclick="answerTrainer('Raise')">RAISE</button>
    `;
  } else if (sit === 'bbdef') {
    actionBtns = `
      <button ${disabled} onclick="answerTrainer('Fold')">FOLD</button>
      <button ${disabled} onclick="answerTrainer('Call')">CALL</button>
      <button ${disabled} onclick="answerTrainer('3-Bet')">3-BET</button>
    `;
  } else if (sit === '3bet') {
    actionBtns = `
      <button ${disabled} onclick="answerTrainer('Fold')">FOLD</button>
      <button ${disabled} onclick="answerTrainer('3-Bet')">3-BET</button>
    `;
  } else if (sit === 'vs3bet') {
    actionBtns = `
      <button ${disabled} onclick="answerTrainer('Fold')">FOLD</button>
      <button ${disabled} onclick="answerTrainer('Call')">CALL</button>
      <button ${disabled} onclick="answerTrainer('4-Bet')">4-BET</button>
    `;
  }

  const scenarioText = buildScenarioText();
  const stats = trainerState.stats;
  const acc = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;
  const formatBtns = ['5max','6max','8max','fr'].map(f =>
    `<button class="trainer-fmt-btn ${f === fmt ? 'active' : ''}" onclick="setTrainerFormat('${f}')">${({'6max':'6-Max','5max':'5-Max','8max':'8-Max','fr':'Full Ring'})[f]}</button>`
  ).join('');

  const sitFilters = ALL_SITUATIONS.map(s => {
    const enabled = trainerState.enabledSituations.includes(s);
    const labels = { 'rfi': 'Open', 'bbdef': 'BB Déf.', '3bet': '3-Bet', 'vs3bet': 'vs 3-Bet' };
    return `<button class="trainer-sit-btn ${enabled ? 'active' : ''}" onclick="toggleTrainerSituation('${s}')">${labels[s]}</button>`;
  }).join('');

  const posFilters = ALL_HERO_POSITIONS.map(p => {
    const enabled = trainerState.enabledPositions.includes(p);
    return `<button class="trainer-sit-btn ${enabled ? 'active' : ''}" onclick="toggleTrainerPosition('${p}')">${p}</button>`;
  }).join('');

  const looseToggle = `<button class="trainer-sit-btn trainer-loose-btn ${trainerState.includeLoose ? 'active' : ''}" onclick="toggleTrainerLoose()" title="Inclure les opens loose comme bonne réponse Raise">Loose ${trainerState.includeLoose ? 'ON' : 'OFF'}</button>`;

  container.innerHTML = `
    <div class="trainer-topbar">
      <div class="trainer-fmt-bar">${formatBtns}</div>
      <div class="trainer-stats">
        <span class="trainer-sit-tag">${sitLabel}</span>
        <span class="trainer-score">${stats.correct} / ${stats.total} <span style="color:var(--text2)">(${acc}%)</span></span>
      </div>
    </div>
    <div class="trainer-filter-bar">
      <span class="trainer-filter-label">Situations :</span>
      ${sitFilters}
    </div>
    <div class="trainer-filter-bar">
      <span class="trainer-filter-label">Position :</span>
      ${posFilters}
      <span style="flex:1"></span>
      ${looseToggle}
    </div>
    <div class="trainer-scenario">${scenarioText}</div>
    <div class="poker-table-wrapper">
      <div class="poker-felt"></div>
      ${seatsHTML}
      ${dealerHTML}
    </div>
    <div class="poker-feedback" id="trainer-feedback"></div>
    <div class="poker-action-bar">
      ${actionBtns}
    </div>
  `;
}

function setTrainerFormat(fmt) {
  trainerState.format = fmt;
  trainerState.stats = { total: 0, correct: 0 };
  showNextTrainerHand();
}

function toggleTrainerSituation(sit) {
  const enabled = trainerState.enabledSituations;
  const idx = enabled.indexOf(sit);
  if (idx >= 0) {
    if (enabled.length === 1) return;
    enabled.splice(idx, 1);
  } else {
    enabled.push(sit);
  }
  try { localStorage.setItem('trainer-enabled-sits', JSON.stringify(enabled)); } catch (e) {}
  if (!enabled.includes(trainerState.situation)) {
    showNextTrainerHand();
  } else {
    renderPokerTable();
  }
}

function toggleTrainerLoose() {
  trainerState.includeLoose = !trainerState.includeLoose;
  try { localStorage.setItem('trainer-include-loose', String(trainerState.includeLoose)); } catch (e) {}
  renderPokerTable();
}

function toggleTrainerPosition(pos) {
  const enabled = trainerState.enabledPositions;
  const idx = enabled.indexOf(pos);
  if (idx >= 0) {
    if (enabled.length === 1) return;
    enabled.splice(idx, 1);
  } else {
    enabled.push(pos);
  }
  try { localStorage.setItem('trainer-enabled-positions', JSON.stringify(enabled)); } catch (e) {}
  const currentHero = getHeroForScenario(trainerState.situation, trainerState.currentPos);
  if (currentHero && !enabled.includes(currentHero)) {
    showNextTrainerHand();
  } else {
    renderPokerTable();
  }
}

function answerTrainer(action) {
  if (trainerState.answered) return;
  trainerState.answered = true;

  const fmt = trainerState.format;
  const sit = trainerState.situation;
  const pos = trainerState.currentPos;
  const hand = trainerState.currentHand;

  const rangeData = RANGES[fmt][sit][pos];

  // Determine correct answers as a Set (mixed hands may have multiple)
  const correct = new Set();
  const inRaise = rangeData.raise && rangeData.raise.has(hand);
  const inLoose = rangeData.looseRaise && rangeData.looseRaise.has(hand);
  const inCall = rangeData.call && rangeData.call.has(hand);
  if (sit === 'rfi') {
    if (inRaise || (inLoose && trainerState.includeLoose)) correct.add('Raise');
    else correct.add('Fold');
  } else if (sit === 'bbdef') {
    if (inRaise) correct.add('3-Bet');
    if (inCall) correct.add('Call');
    if (!inRaise && !inCall) correct.add('Fold');
  } else if (sit === '3bet') {
    if (inRaise) correct.add('3-Bet'); else correct.add('Fold');
  } else if (sit === 'vs3bet') {
    if (inRaise) correct.add('4-Bet');
    if (inCall) correct.add('Call');
    if (!inRaise && !inCall) correct.add('Fold');
  }

  const isCorrect = correct.has(action);
  trainerState.stats.total++;
  if (isCorrect) trainerState.stats.correct++;

  const feedbackEl = document.getElementById('trainer-feedback');

  // Highlight buttons
  const buttons = document.querySelectorAll('.poker-action-bar button');
  buttons.forEach(btn => {
    btn.disabled = true;
    const btnText = btn.textContent.trim();
    if (btnText === action.toUpperCase() || btnText === action) {
      btn.classList.add(isCorrect ? 'btn-correct' : 'btn-wrong');
    }
    if (!isCorrect) {
      correct.forEach(ans => {
        if (btnText === ans.toUpperCase() || btnText === ans) {
          btn.classList.add('btn-correct');
        }
      });
    }
  });

  // Notes for this position (if any)
  const noteHtml = rangeData.notes && rangeData.notes.trim()
    ? `<div class="trainer-feedback-note">${rangeData.notes.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>')}</div>`
    : '';

  // Loose tag for RFI hands that are in the loose-only set
  const looseTag = (sit === 'rfi' && inLoose && !inRaise)
    ? ` <span class="trainer-loose-tag">open loose</span>`
    : '';

  if (isCorrect) {
    feedbackEl.className = 'poker-feedback correct';
    feedbackEl.innerHTML = `✓ Correct !${looseTag}${noteHtml}`;
  } else {
    const expected = Array.from(correct).join(' ou ');
    feedbackEl.className = 'poker-feedback wrong';
    feedbackEl.innerHTML = `✗ Réponse attendue : ${expected}${looseTag}${noteHtml}`;
  }

  // Auto-advance (longer if there's a note to read)
  const delay = noteHtml ? 4000 : 1800;
  setTimeout(() => { showNextTrainerHand(); }, delay);
}

// ============================================================
// INIT — call page-specific inits
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('range-display')) renderRanges();
  if (document.getElementById('calc-result'))   calcPotOdds();
  if (document.getElementById('quiz-container')) renderQuiz();
  if (document.getElementById('trainer-container')) initTrainer();
});
