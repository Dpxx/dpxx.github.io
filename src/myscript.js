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
//判断数组是否为空
function empty(){
    if(this.dataStore.length == 0){
        return true;
    }else{
        return false;
    }
}


function state(priority, board, pos0, depth, process){
	this.priority = priority;
	this.board = board;
	this.pos0 = pos0;
	this.depth = depth;
	this.process = process;
}

function calDistance(node,w){
    let dis = 0;
	for (i = 0; i < node.length; i++) {
		if (node[i] === 0) { continue; }
		dis += Math.abs(Math.floor(i / w) - Math.floor((node[i] - 1) / w)) + Math.abs(i % w - (node[i] - 1) % w);
	}
	return dis;
}

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
          let new_state = new state(state1.depth+1, newboard, nei, state1.depth+1, state1.process.concat(dir[i]));
          pQueue.enqueue(new_state);
          seen[state1.board.toString()] = true;
        }
      }
    }
  }
}

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
            let new_state = new state(state1.depth+1+0.9 * calDistance(newboard,4), newboard, nei, state1.depth+1, state1.process.concat(dir[i]));
            pQueue.enqueue(new_state);
            seen[state1.board.toString()] = true;
          }
        }
      }
    }
}




/*
var slidingPuzzle = function(board) {
    let row = board.length, col = board[0].length;
    let target = [...Array(row * col)].map((_, i) => i + 1);
    target[row * col - 1] = 0
    let queue = [[].concat(...board)]
    let visited = {}, step = 0

    const gNeighbor = () => {
        return start.map((_, i) => {
            let r = (i / col) | 0, c = (i % col) | 0
            let arr = []

            if (r > 0) arr.push((r - 1) * col + c)
            if (r < row - 1) arr.push((r + 1) * col + c);
            if (c > 0) arr.push(i - 1);
            if (c < col - 1) arr.push(i + 1);
            return arr
        })
    }

    let neighbor = gNeighbor()

    while (queue.length) {
        let len = queue.length
        while (len--) {
            const cur = queue.shift();
            if (cur.toString() === target.toString()) return step
            let idx = cur.findIndex(v => !v)
            for (let j = 0; j < neighbor[idx].length; j++) {
                let adj = neighbor[idx][j]
                let list = [...cur];
                [list[adj], list[idx]] = [list[idx], list[adj]]
                if (!visited[list.toString()]) {
                    queue.push(list)
                    visited[list.toString()] = true
                }
            }
        }
        step++
    }
    return -1
}

function PriorityQueue(){
        this.dataStore = [];
        this.enqueue = enqueue;
        this.dequeue = dequeue;
        this.empty = empty;
}

//入队，就是在数组的末尾添加一个元素
function enqueue(element){
    this.dataStore.push(element);
}
//出队，判断优先级删除，注意这里用的是数组的splice方法，不是slice方法
function dequeue(){
    var priority = this.dataStore[0].priority;
    var fromIndex = 0;
    for (var i=1; i<this.dataStore.length; ++i) {
        if (this.dataStore[i].priority < priority) {
            fromIndex = i;
        }
    }
    return this.dataStore.splice(fromIndex, 1);
}
//判断数组是否为空
function empty(){
    if(this.dataStore.length == 0){
        return true;
    }else{
        return false;
    }
}
*/

var vm = new Vue({
    //DOM元素，挂载视图模式
    el:'#main',
    //定义属性，设置初始值
    data:{
        message:'',
        active:'three',
        puzzle:3,
        example:'1,2,3,4,5,6,7,0,8',
        steps:'',
        solutions:''
    }, 
    methods:{
        makeActive:function(item){
        this.active=item;
	switch (item){
	    case "three":
	        this.puzzle = 3;
	        this.example = '1,2,3,4,5,6,7,0,8';
	        break;
	    default:
		this.puzzle = 4;
		this.example = '1,2,3,4,5,6,7,8,9,10,11,12,13,14,0,15';
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
			  //alert(puzzle.indexOf(0));
			  if (this.puzzle == 3){
			    var solution = solve_3(arr);
			  }else{
			    var solution = solve_4(arr);
			  }
			  this.steps = '最少步：' + solution[0];
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
		    }
        }
    })
