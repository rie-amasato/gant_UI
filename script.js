startday=new Date();

monthcolor=[,];
const initialColor="#FFFFFF";//チャートのセルの初期カラー

function mkcalendar(startday,length){
	ganttable=document.getElementById("gant-table");
	
	monthRow=ganttable.insertRow();
	dayRow=ganttable.insertRow();


	newCell=monthRow.insertCell();
	newCell.innerHTML="月";

	newCell=dayRow.insertCell();
	newCell.innerHTML="日";

	monthlength=0;
	for(let i=0;i<length;i+=1){
		currentday=new Date(startday);
		nextday=new Date(startday);
		currentday.setDate(startday.getDate()+i);
		nextday.setDate(startday.getDate()+i+1);

		monthlength+=1;
		if (nextday.getMonth()!=currentday.getMonth()){
			newCell=monthRow.insertCell();
			newCell.colSpan=monthlength;
			newCell.align="center";
			newCell.innerHTML=currentday.getMonth()+1+"月";

			monthlength=0;
		}

		newCell=dayRow.insertCell();
		newCell.width=20;
		newCell.align="center";
		newCell.innerHTML=currentday.getDate();
		newCell.style="background-color: "+initialColor;
	}
	if (monthlength!=0){
		newCell=monthRow.insertCell();
		newCell.colSpan=monthlength;
		newCell.align="center";
		newCell.innerHTML=currentday.getMonth()+1+"月";
	}
}

taskCells=[]
function mkdata(tasks,length){
	ganttable=document.getElementById("gant-table");
	x=-1;
	tasks.map(task=>{
		x+=1;
		newRow=ganttable.insertRow();
		newCell=newRow.insertCell();
		newCell.innerHTML=task.name;

		for(i=0; i<length; i+=1){
			newCell=newRow.insertCell();

			newGantCell=new gantCell(newCell,x*length+i,task.color);
			taskCells.push(newGantCell);
		}
	});
}

class gantCell{
	constructor(cell,i,color){
		this.i=i;
		this.cell=cell;

		this.cell.onclick=()=>this.click();

		this.colors=[initialColor,color,"#977797"]
		this.clicknum=0;
		this.cell.style="background-color: "+initialColor;
	}
	
	click(){
		this.clicknum=(this.clicknum+1)%this.colors.length;
		
		this.cell.style="background-color: "+this.colors[this.clicknum];
	}
}

class task{
	constructor(name,color){
		this.name=name;
		this.color=color;//1回クリックした時の色
	}
}

addEventListener('load', function(e) {
  console.log('gant');

	calendarLength=30;//カレンダーの長さ
	mkcalendar(startday,calendarLength);
	tasks=[
		new task("task0","#aF008F"),
		new task("task1","#00aF8F"),
		new task("task2","#00aF8F"),
		new task("task3","#aF8F00"),
		new task("task4","#aF008F"),
	];
	mkdata(tasks,calendarLength);
});
