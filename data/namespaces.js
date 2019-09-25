// Bring in the room class
const Namespace =  require('../classes/Namespace');
const Room =  require('../classes/Room');

// Set up the namespaces
let namespaces = [];
let user = new Namespace(0,'user','https://upload.usermedia.org/userpedia/en/thumb/8/80/userpedia-logo-v2.svg/103px-userpedia-logo-v2.svg.png','/');
let admin = new Namespace(1,'admin','https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png','/admin');

namespaces.push(user,admin);

// Make the main room and add it to rooms. it will ALWAYS be 0
user.addRoom(new Room(1,'onpoint-fx-signals','On Point FX Signal', 'user'));
user.addRoom(new Room(2,'suggestion-bugs','suggestions/bug Reports', 'user'));
user.addRoom(new Room(3,'private-forex-mentoring', 'Private Forex Mentoring', 'user'));
user.addRoom(new Room(4,'7day-private-training','7 DAY INTENSE PRIVATE TRAINING', 'user'));
user.addRoom(new Room(5,'official-partners', 'OFFICIAL PARTNERS', 'user'));
user.addRoom(new Room(6,'golden-circle', "The Golden circle", 'user'));
user.addRoom(new Room(7,'prazise-fx-signal', 'PRÄZISE FX SIGNALS', 'user'));
user.addRoom(new Room(8,'website-testing', 'WEBSITE TESTING A/B', 'user'));
user.addRoom(new Room(9, 'chat-dev', 'chat-dev', 'user'));

admin.addRoom(new Room(1,'traders-lounge','user'));
admin.addRoom(new Room(2,'market-analysis','user'));
admin.addRoom(new Room(3,'customers','user'));
admin.addRoom(new Room(4,'dev-chat','user'));
admin.addRoom(new Room(5,'golden-circle','user'));

module.exports = namespaces;