// Scripted checks for the WIRED-64 brain. Run: node scripts/test-wired64.mjs
import { wired64Respond, createChatState, formatScanSummary, _test } from '../src/utils/wired64Brain.js';

let failures = 0;
const ok = (cond, msg) => {
  if (!cond) {
    failures += 1;
    console.log(`  ✖ ${msg}`);
  }
};
const words = (r) => _test.wordCount(r.reply);

// 1. Topic routing + length (fresh state each time so no lead ask interferes)
const ROUTES = [
  ['How much does a website cost?', 'pricing'],
  ['what are your rates', 'pricing'],
  ['Is your data accurate?', 'fallback'], // "rate" inside "accurate" must NOT trigger pricing
  ['How much is a lyric video?', 'videoPricing'],
  ['music video pricing', 'videoPricing'],
  ['How long does a website take?', 'timeline'],
  ['Show me the Fast Track dashboard.', 'fasttrack'],
  ['do you work with car dealerships', 'fasttrack'],
  ['Tell me about the Ringger Law build.', 'ringger'],
  ['I run a law firm', 'ringger'],
  ['Tell me about AI chatbots.', 'chatbot'],
  ['can you build a chat bot for my business', 'chatbot'],
  ['I want an AI assistant on my site', 'chatbot'],
  ['what about team vision', 'teamvision'],
  ['I need a dashboard for my leads', 'dashboard'],
  ['what is GEO?', 'geo'],
  ['how do I rank on google', 'geo'],
  ['Tell me about music video editing.', 'music'],
  ['do you work with Halestorm', 'music'],
  ['my wordpress site is slow', 'website'],
  ['I need a new website', 'website'],
  ['can you build an online store', 'website'],
  ['Who have you worked with?', 'clients'],
  ['where are you located', 'location'],
  ['do you work in Kingsport', 'location'],
  ['who is Rob', 'about'],
  ['do you do social media marketing', 'marketing'],
  ['How do I contact Rob?', 'contact'],
  ['Check my current website.', 'scanRequest'],
  ['Run a 64-bit AI & SEO diagnostic scan on my current website.', 'scanRequest'],
  ['do you have a blog', 'blog'],
  ['are you a bot?', 'identity'],
  ['what is the meaning of life', 'fallback'],
  ['I got approved for credit', 'fallback'], // "edit" inside "credit" must NOT trigger video
  ['I am so happy', 'fallback'] // "app" inside "happy" must NOT trigger website
];

console.log('\nTopic routing & reply length');
for (const [q, expected] of ROUTES) {
  const r = wired64Respond(q, createChatState());
  ok(r.topic === expected, `"${q}" → ${r.topic} (expected ${expected})`);
  ok(words(r) <= 45, `"${q}" reply is ${words(r)} words (max 45)`);
  ok(r.chips.length <= 2, `"${q}" has ${r.chips.length} chips (max 2)`);
  if (expected !== 'teamvision') {
    ok(!/team vision|ask vision/i.test(r.reply + (r.subtext || '') + JSON.stringify(r.chips)), `"${q}" mentions Team Vision`);
  }
}

// 2. Small talk does not count toward the 3 questions
console.log('Small talk');
{
  let s = createChatState();
  let r = wired64Respond('hey', s);
  ok(r.topic === 'greeting' && r.state.questionCount === 0, 'greeting counted as a question');
  r = wired64Respond('thanks', r.state);
  ok(r.topic === 'thanks' && r.state.questionCount === 0, 'thanks counted as a question');
}

// 2b. Thanks / sign-off / plain no → "You're welcome : )", not counted
console.log('Thanks & sign-off');
{
  for (const [q, topic] of [
    ['thank you', 'thanks'],
    ['thanks!', 'thanks'],
    ['no thank you', 'signoff'],
    ['no thanks', 'signoff'],
    ["that's all", 'signoff'],
    ["I'm good", 'signoff'],
    ['nothing else', 'signoff'],
    ['bye', 'signoff'],
    ['no', 'no'],
    ['nope', 'no']
  ]) {
    const r = wired64Respond(q, createChatState());
    ok(r.topic === topic, `"${q}" → ${r.topic} (expected ${topic})`);
    ok(r.state.questionCount === 0, `"${q}" counted as a question`);
    ok(/: \)/.test(r.reply), `"${q}" reply missing : )`);
    if (topic !== 'no') ok(/YOU'RE WELCOME/.test(r.reply), `"${q}" missing YOU'RE WELCOME`);
  }
}

// 3. Lead flow: 3 questions → name → contact → saved
console.log('Lead flow');
{
  let s = createChatState();
  let r = wired64Respond('How much does a website cost?', s);
  ok(!r.leadAsk, 'asked for info after question 1');
  r = wired64Respond('How long does it take?', r.state);
  ok(!r.leadAsk, 'asked for info after question 2');
  r = wired64Respond('Tell me about AI chatbots.', r.state);
  ok(r.leadAsk && r.state.step === 'ASK_NAME', 'did not ask for name after question 3');
  ok(/name/i.test(r.subtext || ''), 'ask text should mention name');
  r = wired64Respond("I'm Sarah Jones", r.state);
  ok(r.state.name === 'Sarah Jones' && r.state.step === 'ASK_CONTACT', `name not captured (${r.state.name})`);
  r = wired64Respond('sarah@acme.com', r.state);
  ok(r.autoSubmitLead && r.state.captured, 'lead not auto-submitted on email');
  ok(r.state.questions.length === 3, `transcript should have 3 questions (has ${r.state.questions.length})`);
  r = wired64Respond('what about music videos', r.state);
  ok(!r.leadAsk, 'asked again after capture');
}

// 4. Decline → re-ask once after 2 more questions → never a 3rd time
console.log('Decline & re-ask');
{
  let s = createChatState();
  let r;
  for (const q of ['pricing?', 'how long?', 'chatbots?']) r = wired64Respond(q, (r && r.state) || s);
  ok(r.leadAsk, 'first ask missing');
  r = wired64Respond('Not yet', r.state);
  ok(r.topic === 'declined' && r.state.step === 'IDLE', 'decline not handled');
  r = wired64Respond('what is geo', r.state);
  ok(!r.leadAsk, 're-asked too soon (1 question after decline)');
  r = wired64Respond('who is rob', r.state);
  ok(r.leadAsk, 'did not re-ask after 2 more questions');
  r = wired64Respond('no', r.state);
  for (const q of ['pricing', 'timeline', 'dashboards', 'music videos', 'marketing']) {
    r = wired64Respond(q, r.state);
    ok(!r.leadAsk, `asked a 3rd time on "${q}"`);
  }
}

// 5. Asking a question instead of giving a name → answered, not stored as name
console.log('Question instead of name');
{
  let r;
  for (const q of ['pricing?', 'how long?', 'chatbots?']) r = wired64Respond(q, (r && r.state) || createChatState());
  r = wired64Respond('how much is a lyric video?', r.state);
  ok(r.topic === 'videoPricing' && !r.state.name, 'question was treated as a name');
}

// 6. Contact any time
console.log('Contact any time');
{
  const r = wired64Respond('Mike 423-555-0199', createChatState());
  ok(r.autoSubmitLead && r.state.name === 'Mike', `early contact not captured (${r.state.name})`);
}

// 7. URL triggers real site check; summaries are honest
console.log('Site check');
{
  const r = wired64Respond('check out mybiz.com', createChatState());
  ok(r.topic === 'scan' && r.scanUrl, 'URL did not trigger site check');
  ok(/blocks outside checks/.test(formatScanSummary({ domain: 'x.com', estimated: true, metrics: [] })), 'estimated report not disclosed');
  const real = formatScanSummary({
    domain: 'y.com',
    metrics: [
      { label: 'Mobile & Edge Speed', passed: true },
      { label: 'AI Entity Schema (JSON-LD)', passed: false }
    ]
  });
  ok(/1 of 2 checks passed/.test(real), 'real summary count wrong');
}

console.log(failures ? `\n✖ ${failures} check(s) failed\n` : '\n✓ All WIRED-64 checks passed\n');
process.exit(failures ? 1 : 0);
