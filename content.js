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
  var message = "\n" + wrapper.textContent.trim() + "\n";

  // Send text content to sidebar
  browser.runtime.sendMessage({ message: message });
}

// Copies all highlighted text to the clipboard in HTML format
function copyAll() {
  const spans = browser.storage.local.get(window.location.toString()).then(onGot, onError);
  // const spans = document.querySelectorAll(".notes-highlight");
}

// Copy the local data to the clipboard
function onGot(item) {
  const spans = item[window.location.toString()];
  const lines = spans.split(/\r\n|\n\r|\n|\r/);
  var s = "<h2>" + window.location.toString() + "</h2>";
  s += "\n<ul>";
  for (var i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (line != "") {
      s += "\n\t";
      s += "<li>";
      s += line;
      s += "</li>";
    }
  }
  s += "\n</ul>";

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

function onError(error) {
  console.log(`Error: ${error}`);
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