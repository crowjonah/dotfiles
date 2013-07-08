// Configs
S.configAll({
  "defaultToCurrentScreen" : true,
  "secondsBetweenRepeat" : 0.1,
  "checkDefaultsOnLoad" : true,
  "focusCheckWidthMax" : 3000,
  "orderScreensLeftToRight" : true
});

// Monitors
var ut_hp = "1920x1080";
var ut_port = "1080x1920";
var ut_lap = "1440x900";

S.log('S.screenCount: ' + S.screenCount());

// Operations
var lapChat = S.operation("corner", {
  "screen" : ut_lap,
  "direction" : "top-left",
  "width" : "screenSizeX/9",
  "height" : "screenSizeY"
});
var lapMain = lapChat.dup({ "direction" : "top-right", "width" : "8*screenSizeX/9" });

var ut_hp_Full = S.operation("move", {
  "screen" : ut_hp,
  "x" : "screenOriginX",
  "y" : "screenOriginY+10",
  "width" : "screenSizeX-58",
  "height" : "screenSizeY-10"
});
var ut_hp_Left = ut_hp_Full.dup({ "width" : "screenSizeX/3" });
var ut_hp_Mid = ut_hp_Left.dup({ "x" : "screenOriginX+screenSizeX/3" });
var ut_hp_Right = ut_hp_Left.dup({ "x" : "screenOriginX+(screenSizeX*2/3)" });
var ut_hp_LeftTop = ut_hp_Left.dup({ "height" : "screenSizeY/2" });
var ut_hp_LeftBot = ut_hp_LeftTop.dup({ "y" : "screenOriginY+screenSizeY/2" });
var ut_hp_MidTop = ut_hp_Mid.dup({ "height" : "screenSizeY/2" });
var ut_hp_MidBot = ut_hp_MidTop.dup({ "y" : "screenOriginY+screenSizeY/2" });
var ut_hp_RightTop = ut_hp_Right.dup({ "height" : "screenSizeY/2" });
var ut_hp_RightBot = ut_hp_RightTop.dup({ "y" : "screenOriginY+screenSizeY/2" });

var ut_port_Full = S.operation("move", {
  "screen" : ut_port,
  "x" : "screenOriginX",
  "y" : "screenOriginY",
  "width" : "screenSizeX",
  "height" : "screenSizeY"
});

var ut_port_TopHalf = ut_port_Full.dup({
  "height": "screenSizeY/2"
});
var ut_port_BottomHalf = ut_port_Full.dup({
  "y": "screenOriginY+screenSizeY/2",
  "height": "screenSizeY/2"
});


var ut_port_Left = ut_port_Full.dup({ "width" : "screenSizeX/3" });
var ut_port_Mid = ut_port_Left.dup({ "x" : "screenOriginX+screenSizeX/3" });
var ut_port_Right = ut_port_Left.dup({ "x" : "screenOriginX+(screenSizeX*2/3)" });
var ut_port_LeftTop = ut_port_Left.dup({ "height" : "screenSizeY/2" });
var ut_port_LeftBot = ut_port_LeftTop.dup({ "y" : "screenOriginY+screenSizeY/2" });
var ut_port_MidTop = ut_port_Mid.dup({ "height" : "screenSizeY/2" });
var ut_port_MidBot = ut_port_MidTop.dup({ "y" : "screenOriginY+screenSizeY/2" });
var ut_port_RightTop = ut_port_Right.dup({ "height" : "screenSizeY/2" });
var ut_port_RightBot = ut_port_RightTop.dup({ "y" : "screenOriginY+screenSizeY/2" });

// common layout hashes
var lapMainHash = {
  "operations" : [lapMain],
  "ignore-fail" : true,
  "repeat" : true
};
var adiumHash = {
  "operations" : [lapChat, lapMain],
  "ignore-fail" : true,
  "title-order" : ["Contacts"],
  "repeat-last" : true
};
// var mvimHash = {
//   "operations" : [ut_hp_Right, ut_port_Left],
//   "repeat" : true
// };
var terminalHash = {
  "operations" : [ut_port_BottomHalf],
  "sort-title" : true,
  "repeat-last" : true
};
var fileZillaHash = {
  "operations" : [ut_port_TopHalf],
  "sort-title" : true,
  "repeat-last" : true
};

var genBrowserHash = function(regex) {
  return {
    "operations" : [function(windowObject) {
      var title = windowObject.title();
      if (title !== undefined && title.match(regex)) {
        windowObject.doOperation(ut_hp_Left);
      } else {
        windowObject.doOperation(lapMain);
      }
    }],
    "ignore-fail" : true,
    "repeat" : true
  };
};

var sendBack = slate.operation("focus", {
  "direction" : "below"
});

// 3 monitor layout
var threeMonitorLayout = S.lay("threeMonitor", {
  "Adium" : {
    "operations" : [lapChat, ut_hp_LeftBot],
    "ignore-fail" : true,
    "title-order" : ["Contacts"],
    "repeat-last" : true
  },
  // "MacVim" : mvimHash,
  "Sublime Text 2" : {
    "operations" : [ut_hp_Full]
  },
  "YNAB 4" : {
    "operations": [lapMainHash, sendBack]
  },
  "Terminal" : terminalHash,
  "Microsoft Outlook" : {
    "operations": [lapMainHash, sendBack]
  },
  "Google Chrome" : genBrowserHash(/^Developer\sTools\s-\s.+$/),
  "FileZilla" : fileZillaHash

  // "GitX" : {
  //   "operations" : [ut_hp_LeftTop],
  //   "repeat" : true
  // },
  // "Firefox" : genBrowserHash(/^Firebug\s-\s.+$/),
  // "Safari" : lapMainHash,
  // "Spotify" : {
  //   "operations" : [ut_port_RightTop],
  //   "repeat" : true
  // }
});

// Defaults
S.def(3, threeMonitorLayout);

// Layout Operations
var threeMonitor = S.op("layout", { "name" : threeMonitorLayout });

var universalLayout = function() {
  // Should probably make sure the resolutions match but w/e
  S.log("SCREEN COUNT: "+S.screenCount());
  if (S.screenCount() === 3) {
    threeMonitor.run();
  } else if (S.screenCount() === 2) {
    // twoMonitor.run();
  } else if (S.screenCount() === 1) {
    // oneMonitor.run();
  }
};

// Batch bind everything. Less typing.
S.bnda({
  // Layout Bindings
  "padEnter:ctrl" : universalLayout,
  "space:ctrl" : universalLayout,

  // Basic Location Bindings
  "pad0:ctrl" : lapChat,
  "[:ctrl" : lapChat,
  "pad.:ctrl" : lapMain,
  "]:ctrl" : lapMain,
  "pad1:ctrl" : ut_hp_LeftBot,
  "pad2:ctrl" : ut_hp_MidBot,
  "pad3:ctrl" : ut_hp_RightBot,
  "pad4:ctrl" : ut_hp_LeftTop,
  "pad5:ctrl" : ut_hp_MidTop,
  "pad6:ctrl" : ut_hp_RightTop,
  "pad7:ctrl" : ut_hp_Left,
  "pad8:ctrl" : ut_hp_Mid,
  "pad9:ctrl" : ut_hp_Right,
  "pad=:ctrl" : ut_hp_Full,
  "pad1:alt" : ut_port_LeftBot,
  "pad2:alt" : ut_port_MidBot,
  "pad3:alt" : ut_port_RightBot,
  "pad4:alt" : ut_port_LeftTop,
  "pad5:alt" : ut_port_MidTop,
  "pad6:alt" : ut_port_RightTop,
  "pad7:alt" : ut_port_Left,
  "pad8:alt" : ut_port_Mid,
  "pad9:alt" : ut_port_Right,
  "pad=:alt" : ut_port_Full,

  // Resize Bindings
  // NOTE: some of these may *not* work if you have not removed the expose/spaces/mission control bindings
  "right:ctrl" : S.op("resize", { "width" : "+10%", "height" : "+0" }),
  "left:ctrl" : S.op("resize", { "width" : "-10%", "height" : "+0" }),
  "up:ctrl" : S.op("resize", { "width" : "+0", "height" : "-10%" }),
  "down:ctrl" : S.op("resize", { "width" : "+0", "height" : "+10%" }),
  "right:alt" : S.op("resize", { "width" : "-10%", "height" : "+0", "anchor" : "bottom-right" }),
  "left:alt" : S.op("resize", { "width" : "+10%", "height" : "+0", "anchor" : "bottom-right" }),
  "up:alt" : S.op("resize", { "width" : "+0", "height" : "+10%", "anchor" : "bottom-right" }),
  "down:alt" : S.op("resize", { "width" : "+0", "height" : "-10%", "anchor" : "bottom-right" }),

  // Push Bindings
  // NOTE: some of these may *not* work if you have not removed the expose/spaces/mission control bindings
  "right:ctrl;shift" : S.op("push", { "direction" : "right", "style" : "bar-resize:screenSizeX/3" }),
  "left:ctrl;shift" : S.op("push", { "direction" : "left", "style" : "bar-resize:screenSizeX/3" }),
  "up:ctrl;shift" : S.op("push", { "direction" : "up", "style" : "bar-resize:screenSizeY/2" }),
  "down:ctrl;shift" : S.op("push", { "direction" : "down", "style" : "bar-resize:screenSizeY/2" }),

  // Nudge Bindings
  // NOTE: some of these may *not* work if you have not removed the expose/spaces/mission control bindings
  "right:ctrl;alt" : S.op("nudge", { "x" : "+10%", "y" : "+0" }),
  "left:ctrl;alt" : S.op("nudge", { "x" : "-10%", "y" : "+0" }),
  "up:ctrl;alt" : S.op("nudge", { "x" : "+0", "y" : "-10%" }),
  "down:ctrl;alt" : S.op("nudge", { "x" : "+0", "y" : "+10%" }),

  // Throw Bindings
  // NOTE: some of these may *not* work if you have not removed the expose/spaces/mission control bindings
  "pad1:ctrl;alt" : S.op("throw", { "screen" : "2", "width" : "screenSizeX", "height" : "screenSizeY" }),
  "pad2:ctrl;alt" : S.op("throw", { "screen" : "1", "width" : "screenSizeX", "height" : "screenSizeY" }),
  "pad3:ctrl;alt" : S.op("throw", { "screen" : "0", "width" : "screenSizeX", "height" : "screenSizeY" }),
  "right:ctrl;alt;cmd" : S.op("throw", { "screen" : "right", "width" : "screenSizeX", "height" : "screenSizeY" }),
  "left:ctrl;alt;cmd" : S.op("throw", { "screen" : "left", "width" : "screenSizeX", "height" : "screenSizeY" }),
  "up:ctrl;alt;cmd" : S.op("throw", { "screen" : "up", "width" : "screenSizeX", "height" : "screenSizeY" }),
  "down:ctrl;alt;cmd" : S.op("throw", { "screen" : "down", "width" : "screenSizeX", "height" : "screenSizeY" }),

  // Focus Bindings
  // NOTE: some of these may *not* work if you have not removed the expose/spaces/mission control bindings
  "l:cmd" : S.op("focus", { "direction" : "right" }),
  "h:cmd" : S.op("focus", { "direction" : "left" }),
  "k:cmd" : S.op("focus", { "direction" : "up" }),
  "j:cmd" : S.op("focus", { "direction" : "down" }),
  "k:cmd;alt" : S.op("focus", { "direction" : "behind" }),
  "j:cmd;alt" : S.op("focus", { "direction" : "behind" }),
  "right:cmd" : S.op("focus", { "direction" : "right" }),
  "left:cmd" : S.op("focus", { "direction" : "left" }),
  "up:cmd" : S.op("focus", { "direction" : "up" }),
  "down:cmd" : S.op("focus", { "direction" : "down" }),
  "up:cmd;alt" : S.op("focus", { "direction" : "behind" }),
  "down:cmd;alt" : S.op("focus", { "direction" : "behind" }),

  // Window Hints
  "esc:cmd" : S.op("hint"),

  // Switch currently doesn't work well so I'm commenting it out until I fix it.
  //"tab:cmd" : S.op("switch"),

  // Grid
  "esc:ctrl" : S.op("grid"),
  "r:ctrl;shift;alt;cmd" : S.op("relaunch")
});

// Test Cases
S.src(".slate.test", true);
S.src(".slate.test.js", true);

// Log that we're done configuring
S.log("[SLATE] -------------- Finished Loading Config --------------");