var Insect = React.createClass({
	render: function() {
		return <img id="insect" className={this.props.direction} src="../img/insect.png" />;
	}
});

var Cell = React.createClass({
	render: function() {
		return (
			<td className={'cell ' + this.props.color}>
				{this.props.children}
			</td>
		);
	}
});

var Grid = React.createClass({
	render: function() {
		var direction = this.props.direction;
		var grid = this.props.gridData.map(function(gridRow, j) {
			var cells = gridRow.map(function(gridCell, i) {
				return (<Cell color={gridCell.color} key={'cell-' + i + '-' + j}>
					{(gridCell.occupied === true) && <Insect direction={direction} />}
				</Cell>)
			});

			return <tr key={'row-' + j}>{cells}</tr>;
		});
		
		return (
			<div>
				<table className="grid">
					<tbody>
						{grid}
					</tbody>
				</table>
			</div>
		);
	}
});

var toggleColor = function(color) {
	return (color === 'white') ? 'black' : 'white';
}

var plotGrid = function(gridState, newPosX, newPosY, currentPosX, currentPosY) {
	var initialize = (gridState.length === 0) ? true : false;
	for(var j = 0; j < 50; j++) {
		var cellGroup = [];
		for(var i = 0; i < 50; i++) {
			if(initialize) {
				cellGroup.push({
					occupied: (i === newPosX && j === newPosY) ? true : false,
					color: 'white',
				});
			}
			else {
				if(i === currentPosX && j === currentPosY) {
					gridState[j][i].color = toggleColor(gridState[j][i].color);
					gridState[j][i].occupied = false;
				}
				if(i === newPosX && j === newPosY) {
					gridState[j][i].occupied = true;
				}
			}
		}
		initialize && gridState.push(cellGroup);
	}
	return gridState;
};

var moveInsect = function(gridState, currentDir) {
	var currentX, currentY, newX, newY, newDir, directionIndex, newPositionIndex, confirmMove;
	var directionMap = [];

	for(var j = 0; j < 50; j++) {
		for(var i = 0; i < 50; i++) {
			if(gridState[j][i].occupied === true) {
				currentX = i;
				currentY = j;

				break;
			}
			if(currentX !== undefined && currentY !== undefined) {
				break;
			}
		};
	};
	console.log(currentX + ' ' + currentY);

	if(gridState[currentY][currentX].color === 'white') {
		directionMap = ['up', 'right', 'down', 'left'];
	}
	else {
		directionMap = ['up', 'left', 'down', 'right'];
	}

	directionIndex = directionMap.indexOf(currentDir);
	confirmMove = false;
	do {
		newPositionIndex = (directionIndex + 1) % 4;
		switch(directionMap[newPositionIndex]) {
			case 'up':
				newX = currentX;
				newY = currentY - 1;
				if(newY > -1) {
					confirmMove = true;
					console.log('move up');
				}
				else {
					directionIndex = newPositionIndex;
				}
			break;
			case 'down':
				newX = currentX;
				newY = currentY + 1;
				if(newY < 50) {
					confirmMove = true;
					console.log('move down');
				}
				else {
					directionIndex = newPositionIndex;
				}
			break;
			case 'left':
				newX = currentX - 1;
				newY = currentY;
				if(newX > -1) {
					confirmMove = true;
					console.log('move left');
				}
				else {
					directionIndex = newPositionIndex;
				}
			break;
			case 'right':
				newX = currentX + 1;
				newY = currentY;
				if(newX < 50) {
					confirmMove = true;
					console.log('move right');
				}
				else {
					directionIndex = newPositionIndex;
				}
		}
	} while(confirmMove === false);

	newDir = directionMap[newPositionIndex];
	gridState = plotGrid(gridState, newX, newY, currentX, currentY);

	return {
		direction: newDir,
		gridState: gridState
	}
};

(function() {
	var renderGrid = function() {
		ReactDOM.render(<Grid gridData={gridState} direction={direction} />, document.getElementById('app'));
	}

	var gridState = [];
	var direction = 'up';
	var intervalCtr = 0;
	var currentX, currentY;

	gridState = plotGrid(gridState, 24, 24);
	renderGrid();

	var renderInterval = setInterval(function() {
		var newInsectData = moveInsect(gridState, direction);
		gridState = newInsectData.gridState;
		direction = newInsectData.direction;
		renderGrid();
		intervalCtr++;

		if(intervalCtr === 2000) {
			clearInterval(renderInterval);
		}
	}, 400);
})();