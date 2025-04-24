// 读取本地存储
const storedData = JSON.parse(localStorage.getItem("data"));
let data = storedData?.data || null;

// 如果没有数据，则初始化
if (!data) {
  const newData = {
    history: [],
    info: "data-name",
    search: {
      txt: ["百度搜索", "必应搜索", "谷歌搜索"],
      img: [
        "https://www.baidu.com/favicon.ico",
        "https://www.bing.com/favicon.ico",
        "static/google.png",
      ],
      url: [
        "https://www.baidu.com/s?wd=",
        "https://www.bing.com/search?q=",
        "https://www.google.com/search?q=",
      ],
      save: 0,
    },
    setting: {
      func: [
        "backgroundBtn",
        "timeBtn",
        "engineBtn",
        "historyBtn",
        "clearBtn",
        "addBtn",
      ],
      txt: [
        "更换背景图片",
        "切换时间格式",
        "切换搜索引擎",
        "清除搜索记录",
        "重置所有设置",
        "添加标签",
      ],
      save: [
        "背景图片",
        "24小时制",
        "百度搜索",
        "清除记录",
        "重置设置",
        "添加标签",
      ],
    },
    content: {
      item: {
        txt: [],
        img: [],
        url: [],
      },
    },
  };
  localStorage.setItem("data", JSON.stringify({ data: newData }));
  location.reload();
}

// 页面数据
let page = data;
console.log(storedData);
console.log(page);

// 右键菜单
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  const menu = document.querySelector(".menu");
  const div = document.createElement("div");

  if (menu) menu.remove();
  div.style.top = e.clientY + "px";
  div.style.left = e.clientX + "px";
  div.classList.add("menu");
  div.style.animation = "show 0.5s ease-in-out";
  div.style.display = "flex";

  div.addEventListener("click", () => {
    div.remove();
  });

  for (let i = 0; i < page.setting.func.length; i++) {
    const content = document.createElement("div");
    content.textContent = page.setting.txt[i];
    content.setAttribute(page.info, page.setting.func[i]);
    content.style.animation = `show ${1 + i / 10}s ease-in-out`;
    div.appendChild(content);
  }

  document.body.appendChild(div);
});

document.addEventListener("DOMContentLoaded", () => {
  // 时间
  const time = document.getElementById("time");
  const date = document.getElementById("date");
  // 设置
  const settingContent = document.getElementById("settingContent");
  // 搜索
  const searchBox = document.querySelector(".search");
  const engine = document.getElementById("engine");
  const searchInput = document.getElementById("searchInput");
  // 历史记录
  const history = document.getElementById("history");

  // 页面初始化
  function update(part) {
    if (part === "all") {
      setTime();
      updateHistory();
      updateSetting();
      updateContent();
      updateSettingString();
    } else if (part === "updateHistory") {
      updateHistory();
    } else if (part === "updateSetting") {
      updateSetting();
    } else if (part === "updateSettingString") {
      updateSettingString();
    }

    // 更新历史记录
    function updateHistory() {
      history.textContent = "";
      for (let i = 0; i < page.history.length; i++) {
        const div = document.createElement("div");
        div.setAttribute("data-name", "history");
        div.textContent = page.history[i];
        div.style.animation = `show ${1 + i / 10}s ease-in-out`;
        history.appendChild(div);
      }
    }

    // 更新设置
    function updateSetting() {
      settingContent.textContent = "";
      for (let i = 0; i < page.setting.func.length; i++) {
        const div = document.createElement("div");
        const button = document.createElement("button");
        const span = document.createElement("span");

        button.setAttribute(page.info, page.setting.func[i]);
        button.type = "button";
        span.textContent = page.setting.txt[i];
        div.appendChild(span);
        div.appendChild(button);
        settingContent.appendChild(div);
      }
    }

    // 更新设置文字和图片
    function updateSettingString() {
      const button = settingContent.querySelectorAll("button");
      for (let i = 0; i < page.setting.func.length; i++) {
        button[i].textContent = page.setting.save[i];
      }
      engine.src = page.search.img[page.search.save]; // 更新搜索引擎图标
    }

    // 更新内容标签
    function updateContent() {
      for (let i = 0; i < page.content.item.txt.length; i++) {
        const div = document.createElement("div");
        const img = document.createElement("img");
        const a = document.createElement("a");

        div.setAttribute("data-name", "content");
        div.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          showPopup("删除标签？", "warning", "delete");
          document.querySelector(".menu")?.remove();
          div.setAttribute("data-temp", i);
        });
        img.src = page.content.item.img[i] || "";
        a.href = page.content.item.url[i] || "#";
        a.textContent = page.content.item.txt[i] || "";
        div.appendChild(img);
        div.appendChild(a);
        document.querySelector(".content").appendChild(div);
      }
    }
  }

  function SetTxt() {
    let txt = prompt("请输入新标签内容：");
    if (txt) {
      page.content.item.txt.push(txt);
      setData();
      update("updateContent");
    }
  }
  update("all");

  function setData() {
    try {
      data = page;
      localStorage.setItem("data", JSON.stringify({ data }));
    } catch (e) {
      console.log(e);
      alert("本地数据存储失败！");
    }
  }

  // 事件监听
  searchInput.addEventListener("blur", async () => {
    searchBox.style.backgroundColor = "rgba(255,255,255,0.6)";
    history.style.backgroundColor = "rgba(255,255,255,0.6)";
    history.style.animation = "hide 1s ease-in";
    await wait(900);
    history.style.display = "none";
    history.style.animation = "";
    searchBox.style.borderRadius = "20px";
  });

  settingContent.addEventListener("mouseleave", async () => {
    settingContent.style.animation = "hide 2s ease-in";
    await wait(1900);
    settingContent.style.animation = "";
    settingContent.style.display = "none";
  });

  // 函数
  function showHistory() {
    searchBox.style.backgroundColor = "white";
    if (page.history.length > 0) {
      searchBox.style.borderRadius = "20px 20px 0 0";
    }
    history.style.backgroundColor = "white";
    history.style.display = "flex";
    history.style.animation = "show 1s ease-in-out";
  }

  function whichEngine() {
    switch (page.search.save) {
      case 0:
        engine.src = page.search.img[1];
        page.search.save = 1;
        page.setting.save[2] = page.search.txt[1];
        break;
      case 1:
        engine.src = page.search.img[2];
        page.search.save = 2;
        page.setting.save[2] = page.search.txt[2];
        break;
      case 2:
        engine.src = page.search.img[0];
        page.search.save = 0;
        page.setting.save[2] = page.search.txt[0];
        break;
      default:
        break;
    }

    setData();
    update("updateSettingString");
  }

  function show(element) {
    const style = getComputedStyle(element);
    if (style.display === "none") {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  }

  function setTime() {
    const format = (hour) => {
      if (hour < 6) return "凌晨";
      if (hour < 9) return "早上";
      if (hour < 12) return "上午";
      if (hour < 14) return "中午";
      if (hour < 17) return "下午";
      if (hour < 19) return "傍晚";
      if (hour < 22) return "晚上";
      return "深夜";
    };
    let dateTemp =
      `
    ${new Date().getFullYear()}年` +
      `${new Date().getMonth() + 1}月` +
      `${new Date().getDate()}日 ` +
      `星期${["日", "一", "二", "三", "四", "五", "六"][new Date().getDay()]}`;
    let timeTemp = format(new Date().getHours());

    function getTime() {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const second = now.getSeconds();

      if (page.setting.save[1] === "12小时制") {
        time.textContent =
          timeTemp +
          " " +
          (hour % 12 || 12) +
          ":" +
          minute.toString().padStart(2, "0") +
          ":" +
          second.toString().padStart(2, "0");
      } else {
        time.textContent = now.toLocaleTimeString();
      }
      if (timeTemp !== format(new Date().getHours())) {
        timeTemp = format(new Date().getHours());
      }
    }

    date.textContent = dateTemp;
    setInterval(getTime, 1000);
  }

  // 搜索
  function showSearch() {
    let searchText = searchInput.value.trim();
    if (!searchText) {
      showPopup("请输入搜索内容！");
      return;
    }

    // 调用搜索
    let url;
    switch (page.search.save) {
      case 0:
        url = page.search.url[0];
        break;
      case 1:
        url = page.search.url[1];
        break;
      case 2:
        url = page.search.url[2];
        break;
      default:
        break;
    }
    console.log(url);
    window.location.href = url + encodeURIComponent(searchText);

    // 记录搜索历史
    if (page.history.length < 10) {
      if (page.history.includes(searchText)) {
        showPopup("该搜索内容已在搜索历史中！");
        return;
      } else {
        page.history.unshift(searchText);
        setData();
        update("updateHistory");
      }
    }
    searchInput.value = "";
  }

  // 显示弹窗
  async function showPopup(text, className, dataName) {
    document.querySelector(".warning")?.remove();
    const div = document.createElement("div");
    div.textContent = text;
    if (!className) {
      className = "prompt";
    }
    document.body.appendChild(div);

    if (className === "prompt") {
      div.classList.add(className);
      await wait(2000);
      div.remove();
    } else if (className === "warning") {
      div.textContent = "";
      div.style.justifyContent = "end";
      div.style.alignItems = "end";
      const button = document.createElement("button");
      const button2 = document.createElement("button");
      const span = document.createElement("span");

      span.textContent = text;
      span.style.position = "absolute";
      span.style.top = "5px";
      span.style.left = "5px";

      button.type = button2.type = "button";
      button.setAttribute("data-name", "confirm");
      button.setAttribute("data-temp", dataName);
      button2.setAttribute("data-name", "cancel");
      button.textContent = "确认";
      button2.textContent = "取消";

      div.appendChild(span);
      div.appendChild(button);
      div.appendChild(button2);
      div.classList.add("warning");
    }
  }

  function clear(name) {
    console.log(name);
    if (name === "historyBtn") {
      page.history = [];
      setData();
      update("updateHistory");
    } else if (name === "clearBtn") {
      localStorage.clear();
      location.reload();
    } else if (name === "content") {
      page.content.item.txt = [];
      page.content.item.img = [];
      page.content.item.url = [];
      setData();
      update("updateContent");
    } else if (name === "delete") {
      page.content.item.txt.splice(0, 1);
      page.content.item.img.splice(0, 1);
      page.content.item.url.splice(0, 1);
      setData();
      update("updateContent");
    }
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  document.addEventListener("click", (e) => {
    console.log(e.target.getAttribute("data-name"));
    switch (e.target.getAttribute("data-name")) {
      case "searchInput":
        showHistory();
        break;
      case "history":
        searchInput.value = e.target.textContent;
        showSearch();
        searchInput.value = "";
        break;
      case "searchBtn":
        showSearch();
        break;
      case "engine":
        whichEngine();
        showPopup(page.search.txt[page.search.save]);
        break;
      case "engineBtn":
        whichEngine();
        showPopup(page.search.txt[page.search.save]);
        break;
      case "backgroundBtn":
        showPopup("壁纸更换成功！");
        break;
      case "timeBtn":
        if (page.setting.save[1] === "24小时制") {
          page.setting.save[1] = "12小时制";
        } else {
          page.setting.save[1] = "24小时制";
        }
        setData();
        update("updateSettingString");
        showPopup(page.setting.save[1]);
        break;
      case "settingBtn":
        show(settingContent);
        break;
      case "historyBtn":
        showPopup(
          "确定要清除搜索记录吗？",
          "warning",
          e.target.getAttribute("data-name")
        );
        break;
      case "clearBtn":
        showPopup(
          "确定要清除所有数据吗？",
          "warning",
          e.target.getAttribute("data-name")
        );
        break;
      case "addBtn":
        SetTxt();
        break;
      case "confirm":
        clear(e.target.getAttribute("data-temp"));
        showPopup("操作成功！");
        document.querySelector(".warning")?.remove();
        break;
      case "cancel":
        showPopup("操作取消！");
        document.querySelector(".warning")?.remove();
        break;
      default:
        document.querySelector(".menu")?.remove();
        break;
    }
  });
});
