// Declare color options
var color1 = "#FFFF00";
var color2 = "#FF0000";
var color3 = "#00FF00";
var color4 = "#0000FF";
var currentColor = color1;

// Create menu items
browser.menus.create({
  id: "get-text",
  title: "Copy Text",
  contexts: ["page"]
});

browser.menus.create({
  id: "highlight-selection",
  title: "Highlight Selection",
  contexts: ["selection"]
});

browser.menus.create({
  id: "separator-1",
  type: "separator",
  contexts: ["all"]
});

browser.menus.create({
  id: "highlight-color-1",
  type: "radio",
  title: "Yellow",
  contexts: ["all"],
  checked: true
});

browser.menus.create({
  id: "highlight-color-2",
  type: "radio",
  title: "Red",
  contexts: ["all"],
  checked: false
});

browser.menus.create({
  id: "highlight-color-3",
  type: "radio",
  title: "Green",
  contexts: ["all"],
  checked: false
});

browser.menus.create({
  id: "highlight-color-4",
  type: "radio",
  title: "Blue",
  contexts: ["all"],
  checked: false
});

browser.menus.create({
  id: "separator-2",
  type: "separator",
  contexts: ["all"]
});

browser.menus.create({
  id: "toggle-sidebar",
  title: "Toggle Sidebar",
  contexts: ["all"],
  command: "_execute_sidebar_action"
});

// Add listener for new menu items
browser.menus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "get-text":
      browser.tabs.sendMessage(tab.id, {command: "copy"});
      break;
    case "highlight-selection":
      browser.tabs.sendMessage(tab.id, {command: "highlight", data: currentColor});
      break;
    case "highlight-color-1":
      currentColor = color1;
      break;
    case "highlight-color-2":
      currentColor = color2;
      break;
    case "highlight-color-3":
      currentColor = color3;
      break;
    case "highlight-color-4":
      currentColor = color4;
      break;
    case "toggle-sidebar":
      console.log("Toggling sidebar");
      break;
  }
});
