(function () {

  with (Carlyle.Styles) {
    container.background = "none";
    container.right = "24px";
    container.left = '0';
    container.width = 'auto';
    page.background = "#FFFBF6";
    page.top = "6px";
    page.bottom = "6px";
    page["-webkit-box-shadow"] = "1px 0 2px #997";
    content.color = "#310";
    content["font-family"] = "Palatino, serif";
    content["line-height"] = "130%";
    Controls.Magnifier.button.color = "#632";
  }


  var bookData = {
    getComponents: function () {
      var componentDiv = document.getElementById('components');
      var cmpts = [];
      for (var i = 0; i < componentDiv.childNodes.length; ++i) {
        var node = componentDiv.childNodes[i];
        if (node.nodeType == 1 && node.id) {
          cmpts.push(node.id);
        }
      }
      return cmpts;
    },
    getContents: function () {
      return [
        {
          title: "Book the First&mdash;Recalled to Life",
          src: "part1",
          children: [
            {
              title: "I. The Period",
              src: "part1#part1-I"
            },
            {
              title: "II. The Mail",
              src: "part1#part1-II"
            },
            {
              title: "III. The Night Shadows",
              src: "part1-III"
            },
            {
              title: "IV. The Preparation",
              src: "part1-IV"
            },
            {
              title: "V. The Wine-shop",
              src: "part1-V"
            },
            {
              title: "V. The Shoemaker",
              src: "part1-VI"
            }
          ]
        },
        {
          title: "Book the Second&mdash;the Golden Thread",
          src: "part2",
          children: [
            {
              title: "I. Five Years Later",
              src: "part2#part2-I"
            },
            {
              title: "II. A Sight",
              src: "part2-II"
            },
            {
              title: "III. A Disappointment",
              src: "part2-III"
            },
            {
              title: "IV. Congratulatory",
              src: "part2-IV"
            }
          ]
        }
      ]
    },
    getComponent: function (componentId) {
      return document.getElementById(componentId).innerHTML;
    },
    getMetaData: function (key) {
      return {
        title: "A Tale of Two Cities",
        creator: "Charles Dickens"
      }[key];
    }
  }


  function createTOCWidget() {
    var controlLayer = document.getElementById('readerCntr');
    var tocWidget = document.createElement('div');
    tocWidget.innerHTML = "Contents";
    tocWidget.id = "tocWidget";
    controlLayer.appendChild(tocWidget);

    tocList = document.createElement('ul');
    tocList.className = 'root';
    var listBuilder = function (chp, padLvl) {
      var li = document.createElement('li');
      var span = document.createElement('span');
      span.style.paddingLeft = padLvl + "em";
      li.appendChild(span);
      span.innerHTML = chp.title;
      li.onclick = function () {
        window.reader.skipToChapter(chp.src);
        tocList.parentNode.parentNode.removeChild(tocList.parentNode);
      }
      tocList.appendChild(li);
      if (chp.children) {
        for (var i = 0; i < chp.children.length; ++i) {
          listBuilder(chp.children[i], padLvl + 1);
        }
      }
    }

    var contents = bookData.getContents();
    for (var i = 0; i < contents.length; ++i) {
      listBuilder(contents[i], 0);
    }

    tocWidget.onclick = function () {
      if (!tocWidget.menu) {
        tocWidget.menu = document.createElement('div');
        tocWidget.menu.id = "toc";
        tocWidget.menu.appendChild(tocList);
      }
      if (tocWidget.menu.parentNode) {
        controlLayer.removeChild(tocWidget.menu);
      } else {
        controlLayer.appendChild(tocWidget.menu);
      }
    }
  }


  // Initialize the reader element.
  window.addEventListener(
    'load',
    function () {
      window.reader = Carlyle.Reader('reader', bookData);
      window.addEventListener(
        'resize',
        function () { window.reader.resized() },
        false
      );


      /* PLACE SAVER */
      var placeSaver = new Carlyle.Controls.PlaceSaver(reader);
      var lastPlace = placeSaver.savedPlace();

      if (lastPlace) { // && confirm("Return to last position?")) {
        placeSaver.restorePlace();
      }


      /* MAGNIFIER CONTROL */
      new Carlyle.Controls.Magnifier(reader);


      /* BOOK TITLE RUNNING HEAD */
      var bookTitle = {
        createControlElements: function () {
          var cntr = document.createElement('div');
          cntr.className = "bookTitle";
          var runner = document.createElement('div');
          runner.className = "runner";
          runner.innerHTML = reader.getBook().getMetaData('title');
          cntr.appendChild(runner);
          return cntr;
        }
      }
      reader.registerPageControl(bookTitle);


      /* CHAPTER TITLE RUNNING HEAD */
      var chapterTitle = {
        runners: [],
        createControlElements: function () {
          var cntr = document.createElement('div');
          cntr.className = "chapterTitle";
          var runner = document.createElement('div');
          runner.className = "runner";
          cntr.appendChild(runner);
          this.runners.push(runner);
          return cntr;
        },
        update: function () {
          for (var i = 0; i < this.runners.length; ++i) {
            var place = reader.getPlace({ div: i });
            this.runners[i].innerHTML = place.chapterTitle();
          }
        }
      }
      reader.registerPageControl(chapterTitle);
      chapterTitle.update();
      reader.addEventListener(
        'carlyle:pagechange',
        function () { chapterTitle.update(); }
      );


      /* PAGE NUMBER RUNNING HEAD */
      var pageNumber = {
        runners: [],
        createControlElements: function () {
          var cntr = document.createElement('div');
          cntr.className = "pageNumber";
          var runner = document.createElement('div');
          runner.className = "runner";
          cntr.appendChild(runner);
          this.runners.push(runner);
          return cntr;
        },
        update: function () {
          for (var i = 0; i < this.runners.length; ++i) {
            var place = reader.getPlace({ div: i });
            this.runners[i].innerHTML = place.pageNumber();
          }
        }
      }
      reader.registerPageControl(pageNumber);
      pageNumber.update();
      reader.addEventListener(
        'carlyle:pagechange',
        function () { pageNumber.update() }
      );

    },
    false
  );
})();