    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/theList/sw.js', {scope: '/theList/'}).then(function (reg) {
            // регистрация сработала
            console.log('Registration succeeded. Scope is ' + reg.scope);
        }).catch(function (error) {
            // регистрация прошла неудачно
            console.log('Registration failed with ' + error);
        });
    };

    var TimeToTime = document.getElementsByClassName("activeDay")[0].getAttribute("sdate");     //время до
    var activeTime = {
        date: null,
        name: null
    };     //текущее мероприятие
    var activeEl; //активное мероприятие в списке

    var interval;
    var notificationArray = [];

    var els = document.getElementsByClassName("setNotification");
    var elsDays = document.getElementsByClassName("itemDay");   //выбор времени

    for (i = 0; i < els.length; i++) {
        els[i].addEventListener("click", openDialog, false);
    }
    for (i = 0; i < elsDays.length; i++) {
        elsDays[i].addEventListener("click", setDay, false);
    }

    document.getElementsByClassName("exit")[0].addEventListener("click", closeDialog);
    document.getElementsByClassName("set")[0].addEventListener("click", setNotification);

    function openDialog(e) {
        //showNotification();
        document.getElementsByClassName("blur")[0].classList.add("active");
        document.getElementsByClassName("sdate")[0].innerHTML = e.target.previousElementSibling.getAttribute("datetime");

        activeTime.name = e.target.previousElementSibling.previousElementSibling.innerHTML;
        activeTime.date = e.target.previousElementSibling.getAttribute("datetime");

        activeEl = e.target.parentElement;

        //console.log(activeTime);
    }

    function closeDialog(e) {
        document.getElementsByClassName("blur")[0].classList.remove("active");
    }

    function setDay(e) {
        for (i = 0; i < elsDays.length; i++) {
            elsDays[i].classList.remove("activeDay");
        }
        e.target.classList.add("activeDay");
        TimeToTime = e.target.getAttribute("sdate");
    }

    function setNotification() {
        var date = new Date();
        var eventDate = new Date(activeTime.date);

        if (date < eventDate) {
            if (date < eventDate - (24 * 60 * 60 * 1000) * TimeToTime) {
                notificationArray.push({
                    date: eventDate,
                    name: activeTime.name,
                    timeTo: eventDate - (24 * 60 * 60 * 1000) * TimeToTime
                });

                console.log(notificationArray);
                clearInterval(interval);
                interval = window.setInterval(check, 1000*60*30);
                closeDialog();
                var str = "dd" + TimeToTime;
                activeEl.classList.add("active", str);
            }
            else {
                alert("Мероприятие начнётся в более ранний срок");
            }
        }
        else {
            alert("Мероприятие уже прошло :C");
        }
    }

    function check() {
        console.log("check");
        var now = new Date();
        for (var i = 0; i < notificationArray.length; i++) {
            var date = new Date(notificationArray[i].timeTo);
            if (date.getDate() == now.getDate() && date.getMonth() == now.getMonth() && date.getFullYear() == now.getFullYear()) {
                console.log("Ура, одно из событий уже скоро!");
                createNotification(i);
            }
            /*else {
             console.log(date.getDate() + " = " + now.getDate() + " | " + date.getMonth() + " = " + now.getMonth()  + " | " +  date.getFullYear() + " = " + now.getFullYear());
             }*/
        }
    }

    function createNotification(i) {
        var name = notificationArray[i].name;
        var date = notificationArray[i].date;
        notificationArray.splice(i, 1);
        if (notificationArray.length < 1) clearInterval(interval);
        //console.log(name + "|" + date);
        showNotification(name, date)
    }

    Notification.requestPermission(function (result) {
    });
    function showNotification(name, date) {
        setTimeout(function () {
            Notification.requestPermission(function (result) {
                if (result === 'granted') {
                    navigator.serviceWorker.ready.then(function (registration) {
                        registration.showNotification('Ура, уже скоро мероприятие ' + name, {
                            body: 'Мероприятие состоится ' + date
                        });
                    });
                }
            });
        }, 2000);
    }

    /*window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.IndexedDB;
     var request = self.indexedDB.open('helperDB', 1);
     request.onsuccess = function(event) {

     var db = event.target.result;
     var transaction = db.transaction('notification', 'readwrite');
     var notificationStore = transaction.objectStore('notification');
     if(notificationStore.count()>0)
     {
     console.log("wow");
     }
     else
     {
     var t = [{id :1, name: "asd"},"asdd"];
     var db_op_req = notificationStore.add(t[0]);
     }
     }

     request.onerror = function(event) {
     console.log('[onerror]', request.error);
     };
     request.onupgradeneeded = function(event) {
     var db = event.target.result;
     var notificationStore = db.createObjectStore('notification', { keyPath: "id" });
     };
     */