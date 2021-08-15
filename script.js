let addBtn = document.querySelector(".add");
let delBtn = document.querySelector(".delete");

let delMode = false;

let body = document.querySelector("body");

let grid = document.querySelector(".grid");

let colors = ["pink","blue", "green", "black"];


let allFiltersChildren = document.querySelectorAll(".filter div");
for(let i=0; i<allFiltersChildren.length; i++){
    allFiltersChildren[i].addEventListener("click", function(e){
        if(e.currentTarget.classList.contains("selected")){
            e.currentTarget.classList.remove("selected");
            loadTask();
            return;
        }else{
            e.currentTarget.classList.add("selected")
        }


        
        let filterColor = e.currentTarget.classList[0];
        loadTask(filterColor);
    });
}

if(localStorage.getItem("AllTickets") == undefined){
    //create an object 
    let allTickets = {};

    allTickets = JSON.stringify(allTickets);

    localStorage.setItem("AllTickets", allTickets);
}

loadTask();


delBtn.addEventListener("click", function(e){
    if(e.currentTarget.classList.contains("delete-selected")){
        e.currentTarget.classList.remove("delete-selected");
        delMode = false;
    }else{
        e.currentTarget.classList.add("delete-selected");
        delMode = true;
    }
});




addBtn.addEventListener("click", function(){

    //delete mode ko bnd krna hai

    delBtn.classList.remove("delete-selected");
    delMode = false;


    let preModal = document.querySelector(".modal");

    if(preModal != null) return;


    let div = document.createElement("div"); //<div></div

    div.classList.add("modal"); //<div class = "modal"></div>

    div.innerHTML = `<div class="task-section">
    <div class="task-inner-container" contenteditable="true"></div>
 </div>
 <div class="modal-priority-section">
    <div class="priority-inner-container">
        <div class="modal-priority pink"></div>
        <div class="modal-priority blue"></div>
        <div class="modal-priority green"></div>
        <div class="modal-priority black selected"></div>
    </div>
 </div>`;

 let ticketColor = "black";

 let allModalPriority = div.querySelectorAll(".modal-priority");

 for(let i=0; i<allModalPriority.length; i++){
    allModalPriority[i].addEventListener("click", function(e){
        for(let j=0; j<allModalPriority.length; j++){
            allModalPriority[j].classList.remove("selected")

        }

        e.currentTarget.classList.add("selected")

        ticketColor = e.currentTarget.classList[1];

    });
 }

 let taskInnerContainer = div.querySelector(".task-inner-container");
 
 

 taskInnerContainer.addEventListener("keydown", function(e){
    if(e.key == "Enter"){

        let id = uid();
        let task = e.currentTarget.innerText;

        //step1=> jobhi data hai localstorage use lekr ao

        let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

        //step2=> usko update kro

        let ticketObj = {
            color: ticketColor,
            taskValue: task,
        };

        allTickets[id] = ticketObj; 

        //step3=> wapis updated object ko localstorage me save krdo

        localStorage.setItem("AllTickets", JSON.stringify(allTickets));

       let ticketDiv = document.createElement("div");
       ticketDiv.classList.add("ticket");  

       ticketDiv.setAttribute("data-id",id);

       ticketDiv.innerHTML = `<div data-id = "${id}" class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">
          #${id}
        </div>
        <div data-id = "${id}" class="actual-task" contenteditable = "true">
          ${task}
        </div>`;    


        let actualTaskDiv = ticketDiv.querySelector(".actual-task");

        actualTaskDiv.addEventListener("input", function(e){
            let updatedTask = e.currentTarget.innerText;

            // console.log(updatedTask);

            let currTicketId = e.currentTarget.getAttribute("data-id");
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            allTickets[currTicketId].taskValue = updatedTask;

            
            localStorage.setItem("AllTickets", JSON.stringify(allTickets)); 
        });

       
        
        ticketDiv.addEventListener("click", function(e){
            if(delMode){
                let currTicketId = e.currentTarget.getAttribute("data-id");

                e.currentTarget.remove();

                let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

                delete allTickets[currTicketId];

                localStorage.setItem("AllTickets", JSON.stringify(allTickets));
            }
        });

        let ticketColorDiv = ticketDiv.querySelector(".ticket-color");
        
        ticketColorDiv.addEventListener("click", function (e) {

            let currTicketId = e.currentTarget.getAttribute("data-id");

            let currColor = e.currentTarget.classList[1];
            
            let index = -1;
            for(let i=0; i<colors.length; i++){
                if(colors[i] == currColor) index = i;
            }

            index++;
            index = index % 4;

            let newColor = colors[index];

            //1-all tickets lana ; 2-usko update krna ; 3-wapis se save krna

            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            allTickets[currTicketId].color = newColor;

            localStorage.setItem("AllTickets", JSON.stringify(allTickets));

            ticketColorDiv.classList.remove(currColor);
            ticketColorDiv.classList.add(newColor);            

        });

        grid.append(ticketDiv);

        div.remove();

    }else if(e.key == "Escape"){
        div.remove();
    }
 });

    body.append(div);
});

function loadTask(color){

    let ticketsOnUi = document.querySelectorAll(".ticket");

    for(let i=0; i<ticketsOnUi.length; i++){
        ticketsOnUi[i].remove();
    }



    //1- fetch alltickets data

    let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

    //2- create ticket ui for each ticket obj

    for(x in allTickets){
        let currTicketId = x;
        let singleTicketObj = allTickets[x];

         
        if(color){
            if(color != singleTicketObj.color) continue;
        } 

        let ticketDiv = document.createElement("div");
        ticketDiv.classList.add("ticket");  

        ticketDiv.setAttribute("data-id",currTicketId);

        ticketDiv.innerHTML = `<div data-id = "${currTicketId}" class="ticket-color ${singleTicketObj.color}"></div>
        <div class="ticket-id">
          #${currTicketId}
        </div>
        <div data-id = "${currTicketId}" class="actual-task" contenteditable = "true">
          ${singleTicketObj.taskValue}
        </div>`;    

        

        let ticketColorDiv = ticketDiv.querySelector(".ticket-color");

        let actualTaskDiv = ticketDiv.querySelector(".actual-task");

        actualTaskDiv.addEventListener("input", function(e){
            let updatedTask = e.currentTarget.innerText;

            // console.log(updatedTask);

            let currTicketId = e.currentTarget.getAttribute("data-id");
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            allTickets[currTicketId].taskValue = updatedTask;

            
            localStorage.setItem("AllTickets", JSON.stringify(allTickets)); 
        });
       
        ticketColorDiv.addEventListener("click", function (e) {

            let currTicketId = e.currentTarget.getAttribute("data-id");

            let currColor = e.currentTarget.classList[1];
            
            let index = -1;
            for(let i=0; i<colors.length; i++){
                if(colors[i] == currColor) index = i;
            }

            index++;
            index = index % 4;

            let newColor = colors[index];

            //1-all tickets lana ; 2-usko update krna ; 3-wapis se save krna

            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            allTickets[currTicketId].color = newColor;

            localStorage.setItem("AllTickets", JSON.stringify(allTickets));

            ticketColorDiv.classList.remove(currColor);
            ticketColorDiv.classList.add(newColor);            

        });

        ticketDiv.addEventListener("click", function(e){
            if(delMode){
                let currTicketId = e.currentTarget.getAttribute("data-id");

                e.currentTarget.remove();

                let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

                delete allTickets[currTicketId];

                localStorage.setItem("AllTickets", JSON.stringify(allTickets));
            }
        });
        

        grid.append(ticketDiv);


    }
    //3- attach required listeners
    //4- add tickets in the grid section of ui.........all done
}






