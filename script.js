monthcolor=[,];
const initialColor="#FFFFFF";//チャートのセルの初期カラー
const todayLineStyle="3px solid rgb(255,51,171)"
const fireRed="#AA2244"
const completeColor="#977797"

//インジェクション対策
function escapeURL(str){
	str=str.replace(/&/g, '&amp')
	str=str.replace(/</g, '&lt')
	str=str.replace(/>/g, '&gt')
	str=str.replace(/"/g, '&quot')
	str=str.replace(/'/g, '&#39')

	return str
}

function setPM0(date, timezone){
	date.setHours(0)
	date.setMinutes(0)
	date.setSeconds(0)
	date.setMilliseconds(0)

	return date
}

function mkcalendar(startdate,length){
	today=setPM0(new Date)
	ganttable=document.getElementById("gant-table");
	
	monthRow=ganttable.insertRow();
	dayRow=ganttable.insertRow();


	newCell=monthRow.insertCell();
	newCell.align="center";
	newCell.innerHTML="月";

	newCell=dayRow.insertCell();
	newCell.align="center";
	newCell.innerHTML="日";

	monthlength=0;
	for(let i=0;i<length;i+=1){
		currentday=new Date(startdate);
		nextday=new Date(startdate);
		currentday.setDate(startdate.getDate()+i);
		nextday.setDate(startdate.getDate()+i+1);

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
		newCell.style.background=initialColor;

		if (currentday-today==0){
			newCell.style.borderRight=todayLineStyle
		}

	}
	if (monthlength!=0){
		newCell=monthRow.insertCell();
		newCell.colSpan=monthlength;
		newCell.align="center";
		newCell.innerHTML=currentday.getMonth()+1+"月";
	}
}

taskCells=[]
nameCells=[]
function mkdata(tasks,length,startday){
	ganttable=document.getElementById("gant-table");

	x=0;
	nextday=new Date(startday);
	tasks.map(task=>{
		x+=1;
		newRow=ganttable.insertRow()
		newCell=newRow.insertCell()
		nameCells.push(new NameCell(newCell,task))

		taskCellsd=[];
		for(i=0; i<length; i+=1){
			date=new Date(startday)		
			date.setDate(startday.getDate()+i);

			newCell=newRow.insertCell();

			newGantCell=new GantCell(newCell,date, task, task.color);
		
			taskCellsd.push(newGantCell);
		}
		taskCells.push(taskCellsd);
		drawCell2(taskCells, task);
	});
}

class NameCell{
	constructor(cell,task){
		this.cell=cell
		this.task=task

		this.cell.innerHTML=this.task.name
		this.cell.onclick=()=>this.click()
	}

	click(){
		let newname=window.prompt("新しいタスク名#色コード\n空白の入力で行の削除",this.task.name+this.task.color)
		if (newname==""){
			//空白の入力で削除
			newname="_"
			for (i=0; i<tasks.length; i+=1){
				if (tasks[i].num==this.task.num){
					tasks.splice(i,1)
					const parent=this.cell.closest("tr")
					parent.remove()
				}
			}
		}
		else{
			const splitted=newname.split("#")
			this.task.name=escapeURL(splitted[0])
			if (splitted.length!=1 && splitted[1].match(/([A-fa-f0-9]{6}|[A-fa-f0-9]{3})/)){
				this.task.color=escapeURL("#"+splitted[1])
				
				drawCell2(taskCells, this.task)
			}
			this.cell.innerHTML=this.task.name
		}

		savetask()
	}
}

//ミリ秒を日付に単位変換する定数
TIME_TO_DATE=86400000;
class GantCell{
	constructor(cell,date, task, color){
		this.date=date;
		this.cell=cell;
		this.task=task;

		this.cell.onclick=()=>this.click();

		this.colors=[initialColor,color,"#977797"]
		this.clicknum=0;
		this.cell.style.background=initialColor
	}
	
	click(){
		//taskのStartdayが決まっていない時
		if (this.task.startdate==null){
			this.task.startdate=this.date.valueOf()
			this.task.enddate=this.date.valueOf()
		}
		else{
			if (this.date<this.task.startdate){
				//durationの左外だった場合
				this.task.startdate=this.date.valueOf()
			}
			else if (this.task.enddate<this.date){
				//durationの右外だった場合
				this.task.enddate=this.date.valueOf()
			}
			else{
				//durationの中だった場合
				if (this.date-this.task.startdate.valueOf()==0){
					//startdateをクリックしたとき
					if (this.task.complete){
						this.task.startdate=this.task.enddate
						this.task.complete=false
					}
					else{
						this.task.complete=true
					}
				}
				else if (this.date-this.task.enddate.valueOf()==0){
					//enddateをクリックしたとき
					if (this.task.complete){
						this.task.complete=false
					}
					else{
						this.task.enddate=this.task.startdate
					}
				}
				else{
					//それ以外
					this.task.enddate=this.date.valueOf()
				}
			}
		}

		drawCell2(taskCells, this.task)
		savetask()
	}
}

function drawCell2(taskCellses, task){
	today=setPM0(new Date)
	taskCellses.map(taskCells=>{
		taskCells.map(taskCell=>{
			if (taskCell.task.num==task.num){
				if (task.startdate!=null && task.enddate!=null){
					if (task.startdate<=taskCell.date 
							&& taskCell.date<task.enddate+TIME_TO_DATE){
						
						if (task.complete==false && taskCell.date-today<=0){
							taskCell.cell.style.background=fireRed
						}
						else if (task.complete){ 
							taskCell.cell.style.background=completeColor
						}
						else{
							taskCell.cell.style.background=task.color
						}
					}
					else{
						taskCell.cell.style.background=taskCell.colors[0]
					}
				}
				else{
					taskCell.cell.style.background=taskCell.colors[0]
				}
			}

			if (taskCell.date-today==0){
				taskCell.cell.style.borderRight=todayLineStyle
			}
		})
	})
}

class Task{
	constructor(num, name, color, start=null, end=null){
		this.num=num
		this.name=name
		this.color=color//1回クリックした時の色

		this.startdate=start
		this.enddate=end

		this.complete=false
	}
}

function savetask(){
	cookielife=(60*60*24*30)
	const encodeddata=encodeURI(JSON.stringify(tasks))
	document.cookie="tasks="+encodeddata+"; max-age="+cookielife+";"
}

function addTask(){
	max=0
	tasks.map(task=>{
		if (max<=task.num){
			max=task.num+1
		}
	})

	newTask=new Task(max, "newtask", "#aF008F")
	tasks.push(newTask)
	mkdata([newTask], calendarLength, startdate)
}

addEventListener('load', function(e) {
  console.log('gant')

	startdate=new Date()
	startdate.setDate(1)

	const timezone=9
	setPM0(startdate, timezone)
	
	calendarLength=35//カレンダーの長さ
	tasks=[
		new Task(0, "task0","#aF008F"),
		new Task(1, "task1","#00aF8F"),
		new Task(2, "task2","#00aF8F"),
		new Task(3, "task3","#aF8F00", Date.UTC(2022,10,29),Date.UTC(2022,11,10)),
		new Task(4, "task4","#aF008F"),
	]

	
	if (document.cookie != ""){
		console.log(decodeURI(document.cookie))
		tasks=JSON.parse(decodeURI(document.cookie).split("=")[1])
	}

	mkcalendar(startdate,calendarLength)
	mkdata(tasks, calendarLength, startdate)
})
