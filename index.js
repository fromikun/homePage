document.addEventListener("DOMContentLoaded", () => {
  // 时间相关
  const time = document.getElementById("time");
  const date = document.getElementById("date");
  // 设置
  const setting = document.querySelector(".setting");
  const settingContent = document.getElementById("settingContent");
  // 搜索
  const searchBox = document.querySelector(".search");
  const engine = document.getElementById("engine");
  const searchInput = document.getElementById("searchInput");
  // 历史记录
  const history = document.getElementById("history");

  // 读取本地存储
  const storedData = JSON.parse(localStorage.getItem("data"));
  let data = storedData?.data || null;

  // 如果没有数据，则初始化
  if (!data) {
    data = {
      settings: [
        {
          title: "时间格式",
          text: "24小时制",
          name: "time",
        },
        {
          title: "搜索引擎",
          text: "百度搜索",
          name: "engine",
          engineImg: "https://www.baidu.com/favicon.ico",
        },
        {
          title: "历史记录",
          text: "清除记录",
          name: "history",
        },
        {
          title: "数据设置",
          text: "清除数据",
          name: "clear",
        },
      ],
      history: [],
    };
    localStorage.setItem("data", JSON.stringify({ data }));
  }

  // 页面数据
  let page = {
    history: data.history || [], // 搜索历史
    settings: data.settings || [], // 设置
  };
  console.log(storedData);
  console.log(page);

  // 页面初始化
  function update(part) {
    if (part === "updateHistory") {
      updateHistory();
    } else if (part === "updateSetting") {
      updateSetting();
    } else if (part === "all") {
      setTime();
      updateHistory();
      updateSetting();
    } else if (part === "updateSettingString") {
      updateSettingString();
    }
    function updateHistory() {
      history.textContent = "";
      for (let i = 0; i < page.history.length; i++) {
        const div = document.createElement("div");
        div.setAttribute("title", "历史记录");
        div.textContent = page.history[i];
        div.style.animation = `show ${1 + i / 10}s ease-in-out`;
        history.appendChild(div);
      }
    }

    function updateSetting() {
      settingContent.textContent = "";
      for (let i = 0; i < page.settings.length; i++) {
        const div = document.createElement("div");
        const button = document.createElement("button");
        const span = document.createElement("span");

        button.setAttribute("name", page.settings[i].name);
        button.type = "button";
        button.textContent = page.settings[i].text;
        span.textContent = page.settings[i].title;
        div.appendChild(span);
        div.appendChild(button);
        settingContent.appendChild(div);
      }
    }
    function updateSettingString() {
      const button = settingContent.querySelectorAll("button");
      for (let i = 0; i < page.settings.length; i++) {
        button[i].textContent = page.settings[i].text;
      }
    }
    engine.src = page.settings[1].engineImg; // 更新搜索引擎图标
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
  searchBox.addEventListener("click", (e) => {
    switch (e.target.title) {
      case "历史记录":
        searchInput.value = e.target.textContent;
        showSearch();
        searchInput.value = "";
        break;
      case "搜索框":
        searchBox.style.backgroundColor = "white";
        if (page.history.length > 0) {
          searchBox.style.borderRadius = "20px 20px 0 0";
        }
        history.style.backgroundColor = "white";
        history.style.display = "flex";
        history.style.animation = "show 1s ease-in-out";
        break;
      case "搜索按钮":
        showSearch();
        break;
      case "搜索引擎":
        whichEngine();
        showWarning(page.settings[1].text);
        break;
      default:
        break;
    }
  });
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

  setting.addEventListener("click", (e) => {
    switch (e.target.name) {
      case "setting":
        show(settingContent);
        break;
      case "time":
        if (e.target.textContent === "24小时制") {
          page.settings[0].text = "12小时制";
        } else {
          page.settings[0].text = "24小时制";
        }
        setData("time");
        update("updateSettingString");
        showWarning(page.settings[0].text);
        break;
      case "engine":
        whichEngine();
        showWarning(page.settings[1].text);
        break;
      case "history":
        const result = confirm("确定要清除搜索记录吗？");
        if (result) {
          page.history = [];
          setData("history");
          update("updateHistory");
          showWarning("搜索记录已清除！");
        } else {
          showWarning("取消清除搜索记录！");
        }
        break;
      case "clear":
        const result2 = confirm("确定要清除所有数据吗？");
        if (result2) {
          localStorage.clear();
          location.reload();
        } else {
          showWarning("取消清除数据！");
        }
        break;
      default:
        break;
    }
  });

  // 函数
  function whichEngine() {
    switch (page.settings[1].text) {
      case "百度搜索":
        page.settings[1].text = "必应搜索";
        page.settings[1].engineImg = "https://www.bing.com/favicon.ico";
        break;
      case "必应搜索":
        page.settings[1].text = "谷歌搜索";
        page.settings[1].engineImg = "./static/google.png";
        break;
      case "谷歌搜索":
        page.settings[1].text = "百度搜索";
        page.settings[1].engineImg = "https://www.baidu.com/favicon.ico";
        break;
      default:
        break;
    }
    setData("engine");
    setData("engineImg");
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

      if (page.settings[0].text === "12小时制") {
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
      showWarning("请输入搜索内容！");
      return;
    }

    // 调用搜索
    switch (page.settings[1].text) {
      case "百度搜索":
        window.location.href =
          "https://www.baidu.com/s?wd=" + encodeURIComponent(searchText);
        break;
      case "必应搜索":
        window.location.href =
          "https://cn.bing.com/search?q=" + encodeURIComponent(searchText);
        break;
      case "谷歌搜索":
        window.location.href =
          "https://www.google.com/search?q=" + encodeURIComponent(searchText);
        break;
      default:
        break;
    }

    // 记录搜索历史
    if (page.history.length < 10) {
      if (page.history.includes(searchText)) {
        showWarning("该搜索内容已在搜索历史中！");
        return;
      } else {
        page.history.unshift(searchText);
        setData("history");
        update("updateHistory");
      }
    }
    searchInput.value = "";
  }

  // 弹窗
  async function showWarning(text) {
    let warning = document.createElement("div");
    warning.classList.add("warning");
    document.body.appendChild(warning);
    warning.textContent = text;
    await wait(2000);
    warning.remove();
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
});
