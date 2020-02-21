addEventListener('DOMContentLoaded', function(){

  // classList ie 대응
  Object.prototype.classAdd = function (input) {
    if (this.className.split(input).length == 1) {
      this.className = this.className + ' ' + input;
      this.className = this.className.replace('  ', ' ');
    }
  }
  Object.prototype.classRemove = function (input) {
    if (this.className.split(input).length != 1) {
      this.className = this.className.replace(input, '').replace('  ', ' ');
    }
  }
  Object.prototype.classToggle = function (input) {
    if (this.className.split(input).length == 1) {
      this.classAdd(input);
    } else {
      this.classRemove(input);
    }
  }
  Object.prototype.addEvent = function (event, func) {
    var self = this;
    event.replace(' ','').split(',').forEach(function (value, index) {
      self.addEventListener(value, function (e) {
        func(e);
      });
    });
  }
  Object.prototype.windowWidth = function () {
    return window.innerWidth;
  }
  // Object.prototype.transitionHideAdd = function (input) {
  //   value.classRemove('is_transitionHide');
  // }

  // htmlInclude - start
  var htmlInclude = {
    includeAll : document.querySelectorAll('[include-html]'),
    nowIndex : 0,
    init : function () {
      self = this;
      self.includeAll.forEach(function (value, index) {
        var include = self.includeAll[index];
        var href_url = include.getAttribute('include-html');
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            include.innerHTML = this.responseText;
            include.removeAttribute('include-html');
            if (++self.nowIndex == self.includeAll.length) {
              self.complete();
            }
          }
        }
        xhttp.open('GET', href_url, true);
        xhttp.send();
        return;
      });
    },
    gotoPage : function () {
      var self = this;
      var aHrefAll = document.querySelectorAll('a[href]');
      aHrefAll.forEach(function (value, index) {
        value.addEventListener('click', function (e) {
          e.preventDefault();
          var href_url = e.target.getAttribute('href');
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              document.querySelector('.container').innerHTML = this.responseText;
              header.navSync(href_url);
              self.reload();
            }
          }
          xhttp.open('GET', href_url, true);
          xhttp.send();
          return;
        });
      });
    },
    complete : function () {
      // 최초 실행시 동작
      this.gotoPage();
      header.init();

      // 페이지 이동시 추가
      this.reload();
    },
    reload : function () {
      // 최초 실행 + 페이지 이동시 동작
      slider.init();
      category.init();
    }
  }
  htmlInclude.init();
  // htmlInclude - end

  window.addEventListener('resize', function (e) {
    // 리사이즈시 동작
    for (let i = 0; i < slider.sliderData.length; i++) {
      slider.resize(i);
    }
    for (let i = 0; i < category.categoryData.length; i++) {
      category.sizeChack(i);
    }
  });

  window.addEventListener('scroll', function (e) {
    // 스크롤시 동작
    header.scrollCheck();
  });

  window.addEventListener('keydown', function (e) {
    // 키다운시 동작
    common.outline(e);
  });

  // common - start
  var common = {
    outline : function (e) {
      if (e.key == 'Tab') {
        if (!document.querySelector('body.onKeyDown')) {
          document.querySelector('body').classAdd('onKeyDown');
        }
      }
    }
  }
  // common - end

  // header - start
  var header = {
    item : [],
    init : function (params) {
      this.scrollCheck();
      this.changeNav();
      this.menuControll();
    },
    scrollCheck : function () {
      var header = document.querySelector('.header');
      if (window.scrollY || document.scrollTop) {
        if (!document.querySelector('.header.is_onScroll')) {
          header.classAdd('is_onScroll');
        }
      } else {
        header.classRemove('is_onScroll');
      }
    },
    menuControll : function () {
      var headerNav_menu = document.querySelector('.headerNav_menu');
      var headerNav_itemAll = document.querySelectorAll('.headerNav_item');
      var header_logoLink = document.querySelector('.header_logoLink');
      headerNav_menu.addEventListener('click', function (e) {
        document.querySelector('.header_wrap').classToggle('is_menuOpen');
      })
      header_logoLink.addEventListener('click', function (e) {
        document.querySelector('.header_wrap').classRemove('is_menuOpen');
      })
      headerNav_itemAll.forEach(function (value, index) {
        value.addEventListener('click', function (e) {
          document.querySelector('.header_wrap').classRemove('is_menuOpen');
        })
      })
    },
    changeNav : function () {
      var self = this;
      var navAll = document.querySelectorAll('.nav');
      navAll.forEach(function (value, index) {
        var nav = navAll[index];
        var nav_itemAll = nav.querySelectorAll('.nav_item');
        nav_itemAll.forEach(function (value, index) {
          var nav_item = nav_itemAll[index];
          self.item[index] = nav_item;
          nav_item.addEventListener('click', function (e) {
            var nav_item_select = nav.querySelector('.nav_item.is_active');
            if (e.target != nav_item_select) {
              nav_itemAll.forEach(function (value, index) {
                var nav_item = nav_itemAll[index];
                nav_item.classRemove('is_active');
              });
              e.target.classAdd('is_active');
            }
          });
        });
      });
    },
    navSync : function (href_url) {
      header.item.forEach(function (value, index) {
        value.classRemove('is_active');
        if (value.getAttribute('href') == href_url) {
          value.classAdd('is_active');
        }
      });
    }
  }
  header.scrollCheck();
  // header - end

  // slider - start
  var slider = {
    sliderData : [],
    init : function () {
      self = this;
      var sliderAll = document.querySelectorAll('.slider');
      if(sliderAll) {
        sliderAll.forEach(function (value, sliderIndex) {
          var slider_item_dummyFirst;
          var slider_item_dummyLast;
          var sliderData = {};
          sliderData['slider'] = sliderAll[sliderIndex];
          sliderData['slider_list'] = sliderData['slider'].querySelector('.slider_list');
          sliderData['slider_list'].style.left = '0px';
          sliderData['slider_list_index'] = 0;
          sliderData['slider_list_width'] = sliderData['slider_list'].offsetWidth;
          sliderData['slider_itemAll'] = sliderData['slider_list'].querySelectorAll('.slider_item');
          sliderData['slider_item_length'] = sliderData['slider_itemAll'].length;
          sliderData['slider_block'] = false;
          sliderData['slider_list'].addEventListener('transitionstart', function() {
            sliderData['slider_block'] = true;
          });
          sliderData['slider_list'].addEventListener('transitionend', function() {
            sliderData['slider_block'] = false;
            if (sliderData['slider_list_index'] < 0) {
              sliderData['slider_list'].style.transition = 'none';
              sliderData['slider_list_index'] = sliderData['slider_item_length'] -1;
              sliderData['slider_list'].style.left = -(sliderData['slider_item_length'] - 1) * Number(sliderData['slider_list'].offsetWidth) + 'px';
              window.setTimeout(function () {
                sliderData['slider_list'].style.transition = '';
              }, 1);
            } else if (sliderData['slider_list_index'] >= sliderData['slider_item_length']) {
              sliderData['slider_list'].style.transition = 'none';
              sliderData['slider_list_index'] = 0;
              sliderData['slider_list'].style.left = '0px';
              window.setTimeout(function () {
                sliderData['slider_list'].style.transition = '';
              }, 1);
            }
          });
          sliderData['slider_itemAll'].forEach(function (value, itemIndex) {
            sliderData['slider_itemAll'][itemIndex].style.left = itemIndex * sliderData['slider_list_width'] + 'px';
            if (itemIndex == 0) {
              slider_item_dummyFirst = sliderData['slider_itemAll'][itemIndex].cloneNode(true);
              slider_item_dummyFirst.style.left = sliderData['slider_item_length'] * sliderData['slider_list_width'] + 'px';
            } else if (itemIndex == sliderData['slider_itemAll'].length -1) {
              slider_item_dummyLast = sliderData['slider_itemAll'][itemIndex].cloneNode(true);
              slider_item_dummyLast.style.left = -1 * sliderData['slider_list_width'] + 'px';
            }
          });
          sliderData['slider_list'].prepend(slider_item_dummyLast);
          sliderData['slider_list'].append(slider_item_dummyFirst);
          sliderData['slider_itemDummyAll'] = sliderData['slider_list'].querySelectorAll('.slider_item');
          self.sliderData[sliderIndex] = sliderData;

          self.control(sliderIndex);
          self.resize(sliderIndex);
          self.touchmove(sliderIndex);
        });
      }
    },
    pageMove : function (direction, sliderIndex) {
      var self = this;
      var sliderData = self.sliderData[sliderIndex];
      var slider_list = sliderData['slider_list'];
      var slider_list_left = slider_list.style.left.split('px')[0];
      if (sliderData['slider_block'] == false) {
        if (direction == 'prev') {
          sliderData['slider_list_index']--;
          slider_list.style.left = Number(slider_list_left) + Number(slider_list.offsetWidth) + 'px';
        } else if (direction == 'next') {
          sliderData['slider_list_index']++;
          slider_list.style.left = Number(slider_list_left) - Number(slider_list.offsetWidth) + 'px';
        }
      }
    },
    control : function (sliderIndex) {
      var self = this;
      var sliderControl_btnAll = this.sliderData[sliderIndex]['slider'].querySelectorAll('.sliderControl .sliderControl_btn');
      var slider_list = this.sliderData[sliderIndex]['slider_list'];
      sliderControl_btnAll.forEach(function (value, index) {
        var sliderControl_btn = sliderControl_btnAll[index];
        sliderControl_btn.addEventListener('click', function (e) {
          e.target.classList.forEach(function (value, index) {
            if (value == 'is_prev') {
              self.pageMove('prev', sliderIndex);
            } else if (value == 'is_next') {
              self.pageMove('next', sliderIndex);
            }
          });
        });
      });
    },
    resize : function (sliderIndex) {
      var self = slider;
      var sliderData = self.sliderData[sliderIndex];
      sliderData['slider_list'].style.transition = 'none';
      sliderData['slider_list_width'] = sliderData['slider_list'].offsetWidth;
      sliderData['slider_itemDummyAll'].forEach(function (value, index) {
        value.style.left = (index - 1) * sliderData['slider_list_width'] + 'px';
      });
      sliderData['slider_list'].style.left = sliderData['slider_list_index'] * sliderData['slider_list_width'] * -1 + 'px';
      window.setTimeout(function () {
        sliderData['slider_list'].style.transition = '';
      }, 1);
    },
    touchmove : function (sliderIndex) {
      var self = this;
      var sliderData = self.sliderData[sliderIndex];
      var mouseChack = false;
      var moveX = 0;
      var startX = 0;
      // addEventListener 다수 이벤트 지원 불가하여 addEvent 메서드 생성
      sliderData['slider'].addEvent('mousedown, touchstart', function (e) {
        mouseChack = true;
        sliderData['slider_list'].style.transition = 'transform 0s';
      });
      sliderData['slider'].addEvent('mouseup, touchend', function (e) {
        if (moveX > 20) {
          self.pageMove('prev', sliderIndex);
        } else if (moveX < -20) {
          self.pageMove('next', sliderIndex);
        }
        mouseChack = false;
        moveX = 0;
        startX = 0;
        sliderData['slider_list'].style.transform = '';
        sliderData['slider_list'].style.transition = '';
      });
      sliderData['slider'].addEvent('mouseleave, touchcancel', function (e) {
        mouseChack = false;
        moveX = 0;
        startX = 0;
        sliderData['slider_list'].style.transform = '';
        sliderData['slider_list'].style.transition = '';
      });
      sliderData['slider'].addEvent('mousemove, touchmove', function (e) {
        if (mouseChack) {
          if (!startX) {
            // 이벤트에 따라 x값 분기처리
            startX = (e.x) ? e.x : e.targetTouches[0].clientX;
          }
          moveX = -(startX - ((e.x) ? e.x : e.targetTouches[0].clientX));
          sliderData['slider_list'].style.transform = 'translateX(' + moveX + 'px)';
        }
      });
    }
  }
  // slider - end

  // category - start
  var category = {
    categoryData : [],
    init : function () {
      self = this;
      var categoryAll = document.querySelectorAll('.category');
      if(categoryAll) {
        categoryAll.forEach(function (value, categoryIndex) {
          var categoryData = {};
          categoryData['nowCategory'] = 'all';
          categoryData['category'] = categoryAll[categoryIndex];
          categoryData['categoryControl'] = categoryData['category'].querySelector('.categoryControl');
          categoryData['categoryControl_itemAll'] = categoryData['categoryControl'].querySelectorAll('.categoryControl_item');
          categoryData['categoryControl_itemAll'].forEach(function (value, clickIndex) {
            value.addEventListener('click', function (e) {
              self.changeMenu(categoryIndex, clickIndex);
              self.sizeChack(categoryIndex);
              self.changeList(categoryIndex);
              self.positioning(categoryIndex);
            });
          });
          categoryData['categoryBox'] = categoryData['category'].querySelector('.categoryBox');
          categoryData['categoryBox_itemAll'] = categoryData['categoryBox'].querySelectorAll('.categoryBox_item');
          self.categoryData[categoryIndex] = categoryData;
          self.sizeChack(categoryIndex);
          self.active(categoryIndex);
        });
      }
    },
    active : function (categoryIndex) {
      var self = this;
      var categoryData = self.categoryData[categoryIndex];
      categoryData['categoryBox_itemAll'].forEach(function (value, clickIndex) {
        value.addEventListener('click', function (e) {
          categoryData['categoryBox_itemAll'].forEach(function (value, clickIndex) {
            value.classRemove('is_active');
          });
          e.target.classAdd('is_active');
        });
        window.addEventListener('resize', function (e) {
          categoryData['categoryBox_itemAll'].forEach(function (value, clickIndex) {
            value.classRemove('is_active');
          });
        });
      });
    },
    changeMenu : function (categoryIndex, clickIndex) {
      var self = this;
      var categoryData = self.categoryData[categoryIndex];
      var clickItem = categoryData['categoryControl_itemAll'][clickIndex];
      categoryData['categoryControl_itemAll'].forEach(function (value, index) {
        value.classRemove('is_active');
      });
      clickItem.classAdd('is_active');
      categoryData['nowCategory'] = clickItem.getAttribute('data-category');
    },
    changeList : function (categoryIndex) {
      var self = this;
      var categoryData = self.categoryData[categoryIndex];
      var nowCategory = categoryData['nowCategory'];
      categoryData['categoryBox_itemAll'].forEach(function (value, index) {
        var haveCategoryList = value.getAttribute('data-category').split(',');
        value.classRemove('is_transitionHide');
        if (nowCategory != 'all') {
          var haveCategory = false;
          haveCategoryList.forEach(function (value, index) {
            if (value == nowCategory) {
              haveCategory = true;
            }
          });
          if (haveCategory == false) {
            value.classAdd('is_transitionHide');
          }
        }
      });
    },
    sizeChack : function (categoryIndex) {
      var self = this;
      var categoryData = self.categoryData[categoryIndex];
      var nowCategory = categoryData['nowCategory'];
      var size_1 = '60%';
      var size_2 = 'calc(90% + 30px)';
      var size_3 = 'calc(150% + 60px)';
      var size_w1 = 'calc(30% - 9px)';
      var size_w2 = 'calc(45% + 16px)';
      var size_w3 = 'calc(75% + 38px)';
      var wideWith = 'calc(50% - 30px)';
      categoryData['categoryBox_itemAll'].forEach(function (value, index) {
        var categoryBox_itemImg = value.querySelector('.categoryBox_itemImg');
        if (categoryBox_itemImg) {
          var dataSize = categoryBox_itemImg.getAttribute('data-size');
          var dataWide = categoryBox_itemImg.getAttribute('data-wide');
          if (nowCategory == 'all' && windowWidth() >= 768) {
            if (dataSize == 1) {
              if (dataWide) {
                categoryBox_itemImg.style.paddingBottom = size_w1;
                value.style.width = wideWith;
              } else {
                categoryBox_itemImg.style.paddingBottom = size_1;
                value.style.width = '';
              }
            } else if (dataSize == 2) {
              if (dataWide) {
                categoryBox_itemImg.style.paddingBottom = size_w2;
                value.style.width = wideWith;
              } else {
                categoryBox_itemImg.style.paddingBottom = size_2;
                value.style.width = '';
              }
            } else if (dataSize == 3) {
              if (dataWide) {
                categoryBox_itemImg.style.paddingBottom = size_w3;
                value.style.width = wideWith;
              } else {
                categoryBox_itemImg.style.paddingBottom = size_3;
                value.style.width = '';
              }
            }
          } else {
            categoryBox_itemImg.style.paddingBottom = size_2;
            value.style.width = '';
          }
        }
      });
      self.positioning(categoryIndex);
    },
    positioning : function (categoryIndex) {
      var self = this;
      var categoryData = self.categoryData[categoryIndex];
      var maxHeight = 0;
      var nowCategoryBox_item = categoryData['categoryBox'].querySelectorAll('.categoryBox_item:not(.is_transitionHide)');
      categoryData['categoryBox'].style.height = '';
      if (windowWidth() < 768) {
        categoryData['categoryBox_itemAll'].forEach(function (value, index) {
          value.style.zIndex = '';
          value.style.top = '';
          value.style.left = '';
          value.style.position = '';
        });
      } else {
        categoryData['categoryBox_itemAll'].forEach(function (value, index) {
          value.style.zIndex = '';
        });
        nowCategoryBox_item.forEach(function (value, index) {
          var col = parseInt(index / 4);
          var chackHeight = 0;
          var chackMaxHeight = 0;
          value.style.zIndex = '10';
          value.style.position = 'absolute';
          if (index % 4 == 0) {
            value.style.left = '0';
          } else if (index % 4 == 1) {
            value.style.left = '25%';
          } else if (index % 4 == 2) {
            value.style.left = '50%';
          } else if (index % 4 == 3) {
            value.style.left = '75%';
          }
          for (var i = 1; i <= col; i++) {
            chackHeight += nowCategoryBox_item[index - 4 * i].offsetHeight + 30;
          }
          chackMaxHeight = chackHeight + nowCategoryBox_item[index].offsetHeight;
          value.style.top = chackHeight + 'px';
          if (maxHeight < chackMaxHeight) {
            maxHeight = chackMaxHeight;
          }
        });
        categoryData['categoryBox'].style.height = maxHeight + 'px';
      }
    }

  }
  // category - end
});