// Declare window ID for this window and content box element
var myWindowId;
const contentBox = document.getElementById("content");

// Save content to browser storage
function saveContent() {
  browser.tabs.query({windowId: myWindowId, active: true}).then((tabs) => {
    let contentToStore = {};
    contentToStore[tabs[0].url] = contentBox.innerText;
    browser.storage.local.set(contentToStore);
  });
}

// Make content box editable on mouse hover
window.addEventListener("mouseover", () => {
  contentBox.setAttribute("contenteditable", true);
});

// Strip editable attribute and save contents on mouse out
window.addEventListener("mouseout", () => {
  contentBox.setAttribute("contenteditable", false);
  saveContent();
});

// Retrieve content from storage for this URL, then update sidebar if content is defined
function updateContent() {
  browser.tabs.query({windowId: myWindowId, active: true})
    .then((tabs) => {
      return browser.storage.local.get(tabs[0].url);
    })
    .then((storedInfo) => {
      contentBox.textContent = storedInfo[Object.keys(storedInfo)[0]];
    });
}

// Update content if tab is activated or updated
browser.tabs.onActivated.addListener(updateContent);
browser.tabs.onUpdated.addListener(updateContent);

// Appends the given message to the content box
function appendText(request) {
  contentBox.innerText += request.message;
  saveContent();
}

document.getElementById("copy_button").onclick = function() {saveText()};
function saveText() {


  var s = "<h2>" + window.location.toString() + "</h2>";
  s += "\n<ul>"
  s += contentBox.textContent;
  s += "\n</ul>"
  
  // Add the s string to the clipboard as rtf
  function listener(e) {
    e.clipboardData.setData("text/html", s);
    e.clipboardData.setData("text/plain", s);
    e.preventDefault();
  }

  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);
}

// Append message to content box when received
browser.runtime.onMessage.addListener(appendText);

// Perform initial content update
browser.windows.getCurrent({populate: true}).then((windowInfo) => {
  myWindowId = windowInfo.id;
  updateContent();
});
