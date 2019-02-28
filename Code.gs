/** 
 * At the base level,this script should analyze unread emails, determine what emails 
 * were sent from the Cedar Rapids Public Library, read due dates of any items checked out, 
 * and create an iCal event that automatically adds itself to the user's Google calendar
 *
 * @author David Wang
 * @version Beta 1.0.0 (28-02-2019)
 */

function readUnread() {
  var checkoutEmail = GmailApp.search('subject:library checkout receipt');
  var messages = checkoutEmail[0].getMessages(); // Assuming that the latest email with this subject line is the library checkout receipt that we want
  var body = messages[0].getBody();
  if (messages[0].isUnread()) messages[0].markRead(); // A perhaps unneccesary piece of automation
  
  // regex for my own testing purposes | regex for the given 'library checkout receipt'.eml file
  const titleRegex = /Title: (.+)/g; // Title: (.+)<br>
  const barcodeRegex = /Barcode: (\d+)/g; // Barcode: (.+)<br>
  const dateRegex = /Due Date: (\d+\/\d+\/\d+),\d+:\d+/g; // Due Date: (\d+\/\d+\/\d+),\d+:\d+
  
  // Running the regex on email message body
  var titles = titleRegex.exec(body);
  var barcodes = barcodeRegex.exec(body);
  var dates = dateRegex.exec(body);
  
  // Initializing the courtesy confirmation email that the items have been added to user's calendar
  var output = "These items and their due dates have been added to your calendar. Please remember to return them!\r\n\r\n";
  for (var i = 0; i < titles.length; i++) {
    output += "Title: " + titles[i] + "!!\r\n";
    output += "Item Barcode: " + barcodes[i] + "!!\r\n";
    output += "Due Date: " + dates[i] + "!!\r\n\r\n";
     
    var event = CalendarApp.getDefaultCalendar().createAllDayEvent(titles[i] + " due", new Date(dates[i]));
    // TODO: remind user the day of
  }
  
  GmailApp.sendEmail(Session.getActiveUser().getEmail(), "Return Reminder Confirmation", output);
  
  // Debug block for determining what exactly is being captured
  var debug = "Weird capturing groups: \r\n\r\n";
  for (var i = 0; i < titles.length; i++) {
    debug += "Title " + i + ": " + titles[i] + "!!\r\n";
  }
  for (var i = 0; i < titles.length; i++) {
    debug += "Barcode " + i + ": " + barcodes[i] + "!!\r\n";
  }
  for (var i = 0; i < titles.length; i++) {
    debug += "Date " + i + ": " + dates[i] + "!!\r\n";
  }
  
//  GmailApp.sendEmail(Session.getActiveUser().getEmail(), "Output debuggggg", debug);
}
