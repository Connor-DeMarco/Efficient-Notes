// Highlights the current selection with the given color
function highlightSelection(string) {
  // Wrap text content with span element
  const sel = document.getSelection();
  const range = sel.getRangeAt(0);
  const wrapper = document.createElement("span");
  range.surroundContents(wrapper);

  // Style span element
  wrapper.style.backgroundColor = string;
  wrapper.style.color = "#111111";
  wrapper.classList.add("notes-highlight");

  // Extract and save text content
  var message = "\n* " + wrapper.textContent.trim() + "\n";

  // Send text content to sidebar
  browser.runtime.sendMessage({message: message});
}

// Copies all highlighted text to the clipboard in HTML format
function copyAll() {
  const spans = document.querySelectorAll(".notes-highlight");
  var s = "<h2>" + window.location.toString() + "</h2>";
  s += "\n<ul>"
  for (var i = 0; i < spans.length; i++) {
    s += "\n\t";
    s += "<li>";
    s += spans[i].textContent.trim();
    s += "</li>";
  }
  s += "\n</ul>"
  navigator.clipboard.writeText(s);
}

// Recieves messages from background, and calls the appropriate function
function handle(message) {
  switch (message.command) {
    case "highlight":
      highlightSelection(message.data);
      break;
    case "copy":
      copyAll();
      break;
    default:
      console.log("Got unknown message in content: " + message);
      break;
  }
}

// Call message handler when message is received
browser.runtime.onMessage.addListener(handle);
