//优先级队列，用于启发式搜索
function PriorityQueue(){
    this.dataStore = [];
    this.enqueue = enqueue;
    this.dequeue = dequeue;
    this.empty = empty;
}

//入队，就是在数组的末尾添加一个元素
function enqueue(element){
    if (this.empty()) {
        this.dataStore.push(element);
    }
    else {
        var added = false;
        for (var i_1 = 0; i_1 < this.dataStore.length; i_1++) {
            if (element.priority < this.dataStore[i_1].priority) {
                this.dataStore.splice(i_1, 0, element);
                added = true;
                break;
            }
        }
        if (!added) {
            this.dataStore.push(element);
        }
    }
}
//出队，判断优先级删除，注意这里用的是数组的splice方法，不是slice方法
function dequeue(){
    return this.dataStore.shift();
}

function empty(){
    if(this.dataStore.length == 0){
        return true;
    }else{
        return false;
    }
}

//定义一个总的状态，包括(优先级、当前状态、0的位置、搜索深度、从起始到这一状态的操作)
function state(priority, board, pos0, depth, process){
    this.priority = priority;
    this.board = board;
    this.pos0 = pos0;
    this.depth = depth;
    this.process = process;
}
//计算曼哈顿距离，作为启发函数
function calDistance(node,w){
    let dis = 0;
    for (i = 0; i < node.length; i++) {
        if (node[i] === 0) { continue; }
        dis += Math.abs(Math.floor(i / w) - Math.floor((node[i] - 1) / w)) + Math.abs(i % w - (node[i] - 1) % w);
    }
    return dis;
}
//3*3求解
function solve_3(board){
    let target = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    let dir = [-1,1,-3,3];
    var pQueue = new PriorityQueue();
    var s0 = new state(0, board, board.indexOf(0), 0, []);
    pQueue.enqueue(s0);
  let seen = {};
  seen[board] = true;

  while (! pQueue.empty()){
    state1 = pQueue.dequeue();
    console.log(state1.priority);
    if (state1.board.toString() == target.toString()){
      return [state1.depth, state1.process];
    }
    for (let i = 0; i < 4;i++){
      let nei = state1.pos0 + dir[i];
      if (Math.abs(Math.floor(nei / 3) - Math.floor(state1.pos0  / 3)) + Math.abs(nei % 3 - state1.pos0 % 3) != 1){
        continue;
      }
      if (nei>=0 && nei <9){
        let newboard = [...state1.board];
        [newboard[state1.pos0] ,newboard[nei]] = [newboard[nei], newboard[state1.pos0]];
        if (!seen[newboard.toString()]){
          let new_state = new state(state1.depth+1 + +0.9 * calDistance(newboard,3), newboard, nei, state1.depth+1, state1.process.concat(dir[i]));
          pQueue.enqueue(new_state);
          seen[state1.board.toString()] = true;
        }
      }
    }
  }
}
//4*4求解,如你所见，和3x3几乎没区别，但我暂时懒得整了
function solve_4(board){
    let target = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    let dir = [-1,1,-4,4];
    var pQueue = new PriorityQueue();
    var s0 = new state(calDistance(board,4), board, board.indexOf(0), 0, []);
    pQueue.enqueue(s0);
    let seen = {};
    seen[board] = true;

    while (! pQueue.empty()){
        state1 = pQueue.dequeue();
        console.log(state1.priority);
        
        if (state1.board.toString() == target.toString()){
          return [state1.depth, state1.process];
        }else if (state1.board.join(" ") in pre_sol){
            let pre_solution = pre_sol[state1.board.join(" ")];
            return [state1.depth + pre_solution.length, state1.process.concat(pre_solution)];
        }
        for (let i = 0; i < 4;i++){
          let nei = state1.pos0 + dir[i];
          if (Math.abs(Math.floor(nei / 4) - Math.floor(state1.pos0  / 4)) + Math.abs(nei % 4 - state1.pos0 % 4) != 1){
            continue;
          }
          if (nei>=0 && nei <16){
            let newboard = [...state1.board];
            [newboard[state1.pos0] ,newboard[nei]] = [newboard[nei], newboard[state1.pos0]];
            if (!seen[newboard.toString()]){
              let new_state = new state(state1.depth+1+0.5 * calDistance(newboard,4), newboard, nei, state1.depth+1, state1.process.concat(dir[i]));
              pQueue.enqueue(new_state);
              seen[state1.board.toString()] = true;
            }
          }
        }
      }
}

//逆序数判断状态有无解
function canUse(numbers) {
    var ivsNumber = 0;
    for (let i = 0; i < numbers.length; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
            if (numbers[i] > numbers[j] && numbers[i] * numbers[j] != 0) {
                ivsNumber++;
            }
        }
    }
    //四阶数字华容道续判断0的行数，若为奇数，则逆序数应为奇数
    if (numbers.length == 16){
        ivsNumber += 3 - parseInt(numbers.indexOf(0)/4)
    }
    if (ivsNumber % 2 == 0) {
        return true;
    } else {
        return false;
    }
}

//定义了几个全局变量
var op = 3;
var state_input = [];
var solutions;
var flag;
//vuejs实现的几个按钮
var vm = new Vue({
    //DOM元素，挂载视图模式
    el:'#main',
    //定义属性，设置初始值
    data:{
        message:'',
        active:'three',
        puzzle:3,
        example:'2,0,6,1,3,5,4,7,8',
        steps:'',
        solutions:''
    }, 
    methods:{
        makeActive:function(item){
        this.active=item;
        switch (item){
            case "three":
                this.puzzle = 3;
                this.example = '2,0,6,1,3,5,4,7,8';
                op = 3;
                break;
            default:
                this.puzzle = 4;
                this.example = '5,1,4,7,2,11,3,8,9,6,14,15,13,10,0,12';
                op = 4;
        }
        },
        fly:function(event){
            this.solutions = '';
            this.steps = '';
              
            if(this.message.match(',')){
                    var puzzle = this.message.split(',');
            } else if (this.message.match('，')){
                var puzzle = this.message.split('，');
            } else{
                var puzzle = this.message.split(' ');
            }
                  
            var arr = [];
            for (var i in puzzle) {
                arr.push(puzzle[i]*1);
            }
            if (arr.length != this.puzzle ** 2){
              alert("请按正确格式与长度输入。");
              return;
            }
            
            if (!canUse(arr)){
                alert("当前状态无解！");
                flag = 0;
                return;
            }
            state_input = arr;
            flag = 1;
            if (this.puzzle == 3){
              var solution = solve_3(arr);
            }else{
              var solution = solve_4(arr);
            }
            this.steps = '步数：' + solution[0];
            for (let j in solution[1]) {
              let d = solution[1][j]*1;
              switch (d) {
                case -1:
                  this.solutions += "左 ";
                  break;
                case 1:
                  this.solutions += "右 ";
                  break;
                case -4:
                case -3:
                    this.solutions += "上 ";
                  break;
                default:
                  this.solutions += "下 ";
              }
            //this.solutions = solution[1];
            }
            solutions = solution[1];
        }
    }
})


//以下为展示部分 jQuery实现
//上色
function setColor(tds,op) {
    var nullTd = tds.filter(function() {
        return $(this).html() == 0;
    });
    nullTd.css({
        "backgroundColor": "#FFFAE8",
        "color":"transparent",
        "borderColor": "black"
    });
	var firstTd = tds.filter(function() {
		var firstlist = [1,2,3,4];
		if (op == 3){firstlist = [1,2,3];}
        return firstlist.indexOf(Number($(this).html())) != -1;
    });
	firstTd.css({
		"backgroundColor": "#707070",
        "color": "white",
        "borderColor": "black"
	});
	var firstTd2 = tds.filter(function() {
		var firstlist2 = [5,9,13];
		if (op == 3){firstlist2 = [4,7];}
        return firstlist2.indexOf(Number($(this).html())) != -1;
    });
	firstTd2.css({
		"backgroundColor": "#444444",
        "color": "white",
        "borderColor": "black"
	});
	
	var secondTd = tds.filter(function() {
		var secondlist = [6,7,8];
		if (op == 3){secondlist = [5,6];}
        return secondlist.indexOf(Number($(this).html())) != -1;
    });
	secondTd.css({
		"backgroundColor": "#00c91a",
        "color": "white",
        "borderColor": "black"
	});
	
	var secondTd2 = tds.filter(function() {
		var secondlist2 = [10,14];
		if (op == 3){secondlist2 = [8];}
        return secondlist2.indexOf(Number($(this).html())) != -1;
    });
	secondTd2.css({
		"backgroundColor": "#008314",
        "color": "white",
        "borderColor": "black"
	});
	
	var thirdTd = tds.filter(function() {
		var thirdlist = [11,15,12];
        return thirdlist.indexOf(Number($(this).html())) != -1;
    });
	thirdTd.css({
		"backgroundColor": "#006fff",
        "color": "white",
        "borderColor": "black"
	});
}
//交换两个方块
function setContentAndStep(cell0, cell1) {
    cell1.html(cell0.html());
    cell0.html(0);
}

function display(op){
    pos_0 = state_input.indexOf(0);

    var index = 0;
    var timer = null;
    timer = setInterval(() => {
        if (index == solutions.length) {
            clearInterval(timer);
        } else{
            var cell0 = $("tr td").eq(pos_0);
            var cell_e = $("tr td").eq(pos_0 + solutions[index]);
            setContentAndStep(cell_e, cell0);
            pos_0 = pos_0 + solutions[index];
            setColor($("tr td"), op);
            index++;
        }
    }, 100);
}

$(document).ready(function() {
    var gameDiv = $("#gameDiv");
        
    GenerateTables(op, [1,2,3,4,5,6,7,8,0]);
    $(".three").click(function(e) {
        GenerateTables(op, [1,2,3,4,5,6,7,8,0]);
        e.stopPropagation();
        e.preventDefault();
    });
    $(".four").click(function(e) {
        GenerateTables(op, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0]);
        e.stopPropagation();
        e.preventDefault();
    });
    $(".button").click(function() {
        if (state_input.length == op ** 2){
            GenerateTables(op, state_input);
        }
        if (flag){
            var sleep = setTimeout(display(op), 2020);
            //display();
        }
    });
    $("#button_r").click(function() {
        if (state_input.length == op ** 2){
            GenerateTables(op, state_input);
        }
        if (flag){
            var sleep = setTimeout(display(op), 2020);
        }
    });
    //生成图表
    function GenerateTables(op, numbers) {
        gameDiv.append("<table  align='center' id='gameTable'></table>");
        var gameTable = $("#gameTable");
        gameTable.html("");//初始化一下

        for (var i = 0; i < op; i++) {
            gameTable.append("<tr></tr>");
            //设置行的样式
            $("tr").css({
                "textAlign": "center",
                "fontSize": "50px",
                "background-color": "#3CAAD1"
            });
            for (var j = 0; j < op; j++) {
                $("tr").eq(i).append("<td></td>");
                //设置列的样式
                $("td").css({
                    "height": 420/op+"px",
                    "width": 420/op+"px",
                    "cursor": "pointer"                             
                });
            }
        }

        for (var i = 0; i < $("tr td").length; i++) {
            $("tr>td").eq(i).html(numbers[i]);
            $("tr td").eq(i).attr("id", i + 1);
        }

        setColor($("tr td"), op);
    }
})
