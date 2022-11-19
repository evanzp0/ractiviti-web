/**
 * Copyright (c) 2006-2015, JGraph Ltd
 */

/**
 * Registers shapes.
 */
(function()
{
	// Link shape
	function LinkShape()
	{
		mxArrowConnector.call(this);
		this.spacing = 0;
	};
	mxUtils.extend(LinkShape, mxArrowConnector);
	LinkShape.prototype.defaultWidth = 4;
	
	LinkShape.prototype.isOpenEnded = function()
	{
		return true;
	};

	LinkShape.prototype.getEdgeWidth = function()
	{
		return mxUtils.getNumber(this.style, 'width', this.defaultWidth) + Math.max(0, this.strokewidth - 1);
	};
	
	LinkShape.prototype.isArrowRounded = function()
	{
		return this.isRounded;
	};

	// Registers the link shape
	mxCellRenderer.registerShape('link', LinkShape);

	// Generic arrow
	function FlexArrowShape()
	{
		mxArrowConnector.call(this);
		this.spacing = 0;
	};
	mxUtils.extend(FlexArrowShape, mxArrowConnector);
	FlexArrowShape.prototype.defaultWidth = 10;
	FlexArrowShape.prototype.defaultArrowWidth = 20;

	FlexArrowShape.prototype.getStartArrowWidth = function()
	{
		return this.getEdgeWidth() + mxUtils.getNumber(this.style, 'startWidth', this.defaultArrowWidth);
	};

	FlexArrowShape.prototype.getEndArrowWidth = function()
	{
		return this.getEdgeWidth() + mxUtils.getNumber(this.style, 'endWidth', this.defaultArrowWidth);;
	};

	FlexArrowShape.prototype.getEdgeWidth = function()
	{
		return mxUtils.getNumber(this.style, 'width', this.defaultWidth) + Math.max(0, this.strokewidth - 1);
	};
	
	// Registers the link shape
	mxCellRenderer.registerShape('flexArrow', FlexArrowShape);

	// State Shapes derives from double ellipse
	function EndEventShape()
	{
		mxDoubleEllipse.call(this);
	};
	mxUtils.extend(EndEventShape, mxDoubleEllipse);
	EndEventShape.prototype.outerStroke = true;
	EndEventShape.prototype.paintVertexShape = function(c, x, y, w, h)
	{
		c.setFillColor("#000000");
		var inset = Math.min(7, Math.min(w / 5, h / 5));
		
		if (w > 0 && h > 0)
		{
			c.ellipse(x + inset, y + inset, w - 2 * inset, h - 2 * inset);
			c.fillAndStroke();
		}
		
		c.setShadow(false);

		if (this.outerStroke)
		{
			c.ellipse(x, y, w, h);
			c.stroke();			
		}
	};

	mxCellRenderer.registerShape('endEvent', EndEventShape);

	// ExclusiveGatewayShape
	function ExclusiveGatewayShape()
	{
		mxEllipse.call(this);
	};
	mxUtils.extend(ExclusiveGatewayShape, mxRhombus);
	ExclusiveGatewayShape.prototype.paintVertexShape = function(c, x, y, w, h)
	{
		mxRhombus.prototype.paintVertexShape.apply(this, arguments);

		c.setShadow(false);
		c.begin();
		c.moveTo(x + w / 2, y + h * 1 / 4);
		c.lineTo(x + w / 2, y + h * 3 / 4);
		c.end();
		c.stroke();

		c.begin();
		c.moveTo(x + w * 1 / 4, y + h / 2);
		c.lineTo(x + w * 3 / 4, y + h / 2);
		c.end();
		c.stroke();
	};

	mxCellRenderer.registerShape('exclusiveGateway', ExclusiveGatewayShape);

	
	// ExclusiveGatewayShape
	function ParallelGatewayShape()
	{
		mxEllipse.call(this);
	};
	mxUtils.extend(ParallelGatewayShape, mxRhombus);
	ParallelGatewayShape.prototype.paintVertexShape = function(c, x, y, w, h)
	{
		mxRhombus.prototype.paintVertexShape.apply(this, arguments);

		c.setShadow(false);
		c.begin();
		c.moveTo(x + w / 2, y + h * 1 / 4);
		c.lineTo(x + w / 2, y + h * 3 / 4);
		c.end();
		c.stroke();

		c.begin();
		c.moveTo(x + w * 1 / 4, y + h / 2);
		c.lineTo(x + w * 3 / 4, y + h / 2);
		c.end();
		c.stroke();

		var a = 3.232 / 10;
		var b = 6.768 / 10;
		c.begin();
		c.moveTo(x + a * w, y + a * h);
		c.lineTo(x + b * w, y + b * h);
		c.end();
		c.stroke();

		c.begin();
		c.moveTo(x + b * w, y + a * h);
		c.lineTo(x + a * w, y + b * h);
		c.end();
		c.stroke();
	};

	mxCellRenderer.registerShape('parallelGateway', ParallelGatewayShape);
	
	// UserIcon Shape
	function UserIcon()
	{
        mxShape.call(this);
	};
	
	mxUtils.extend(UserIcon, mxShape);
	
	UserIcon.prototype.paintVertexShape = function(c, x, y, w, h)
	{
		c.translate(x, y);
		c.begin();
		// this.redrawPath(c, x, y, w, h);
		c.fillAndStroke();

		this.paintForeground(c, x, y, w, h);
	};
	
	UserIcon.prototype.redrawPath = function(c, x, y, w, h) {

		c.moveTo(0, h);
		c.curveTo(0, 3 * h / 5, 0, 2 * h / 5, w / 2, 2 * h / 5);
		c.curveTo(w / 2 - width, 2 * h / 5, w / 2 - width, 0, w / 2, 0);
		c.curveTo(w / 2 + width, 0, w / 2 + width, 2 * h / 5, w / 2, 2 * h / 5);
		c.curveTo(w, 2 * h / 5, w, 3 * h / 5, w, h);
		c.close();
	}

	UserIcon.prototype.paintForeground = function(c, x, y, w, h) {
		var s = 94/w
		c.begin();
		c.moveTo(0, 91.81 / s);
		c.lineTo(0, 63.81 / s);
		c.arcTo(50 / s, 50 / s, 0, 0, 1, 24 / s, 42.81 / s);
		c.arcTo(25 / s, 25 / s, 0, 0, 1, 33 / s, 41.81 / s);
		c.arcTo(17 / s, 17 / s, 0, 0, 0, 48 / s, 58.81 / s);
		c.arcTo(17 / s, 17 / s, 0, 0, 0, 66 / s, 41.81 / s);
		c.arcTo(25 / s, 25 / s, 0, 0, 1, 76.8 / s, 42.81 / s);
		c.arcTo(35 / s, 35 / s, 0, 0, 1, 94 / s, 63.81 / s);
		c.lineTo(94 / s, 91.81 / s);
		c.close();
		c.moveTo(66 / s, 41.81 / s);
		c.arcTo(17 / s, 17 / s, 0, 0, 1, 48 / s, 58.81 / s);
		c.arcTo(17 / s, 17 / s, 0, 0, 1, 33 / s, 41.81 / s);
		c.arcTo(25 / s, 25 / s, 0, 0, 0, 38 / s, 40.81 / s);
		c.lineTo(39 / s, 36.8 / s);
		c.arcTo(10 / s, 10 / s, 0, 0, 1 / s, 32 / s, 30.81 / s);
		c.arcTo(18 / s, 12 / s, 0, 1, 1, 66 / s, 30.81 / s);
		c.arcTo(12 / s, 12 / s, 0, 0, 1, 58 / s, 36.81 / s);
		c.lineTo(59 / s, 40.81 / s);
		c.close();
		c.end();

		c.fillAndStroke();
		c.begin();
		c.moveTo(16 / s, 75.81 / s);
		c.lineTo(16 / s, 90.81 / s);
        c.moveTo(75 / s, 75.81 / s);
        c.lineTo(75 / s, 90.81 / s);
        c.stroke();
        c.end();
        
        c.begin();
        c.setFillColor("#000000");
        c.fill("#000000");
        c.moveTo(32 / s, 30.81 / s);
        c.arcTo(15 / s, 15 / s, 0, 0, 1, 29 / s, 13.81 / s);
        c.arcTo(22 / s, 22 / s, 0, 0, 1, 48 / s, 0.81 / s);
        c.arcTo(22 / s, 22 / s, 0, 0, 1, 70 / s, 13.81 / s);
        c.arcTo(15 / s, 15 / s, 0, 0, 1, 66 / s, 30.81 / s);
        c.arcTo(15 / s, 15 / s, 0, 0, 0, 64 / s, 21.81 / s);
        c.arcTo(15 / s, 15 / s, 0, 0, 0, 50 / s, 20.81 / s);
        c.arcTo(15 / s, 15 / s, 0, 0, 0, 35 / s, 21.81 / s);
        c.arcTo(15 / s, 15 / s, 0, 0, 0, 32 / s, 30.81 / s);
        c.close();
		c.end();
		c.fillAndStroke();
	}
	mxCellRenderer.registerShape('userIcon', UserIcon);

	// UserTask Shape
	function UserTask() {
		mxRectangleShape.call(this);
	}
	mxUtils.extend(UserTask, mxRectangleShape);

	UserTask.prototype.paintVertexShape = function(c, x, y, wd, ht) {
		var w = 16;
		var h = 16;
		var width = w/3;
		var xo = 10;
		var yo = 10;
		var conner = 10;

		var wd = (wd >= 2 * xo + w) ? wd : (2 * xo + w);
		var ht = (ht >= 2 * yo + h) ? ht : (2 * yo + h);

		c.translate(x, y);

		// draw round rect
		c.setStrokeWidth(2);
		c.begin();
		c.moveTo(0, ht - conner);
		c.lineTo(0, 0 + conner);
		c.arcTo(10, 10, 0, 0, 1, 10, 0);
		c.lineTo(wd - 10, 0);
		c.arcTo(10, 10, 0, 0, 1, wd, 10);
		c.lineTo(wd, ht - conner);
		c.arcTo(10, 10, 0, 0, 1, wd - conner, ht);
		c.lineTo(0 + conner, ht);
		c.arcTo(10, 10, 0, 0, 1, 0, ht - conner);
		c.close();

		c.end();
		c.fillAndStroke();

		// draw actor
		c.setStrokeWidth(1);
		c.begin();
		c.moveTo(0 + xo, h + yo);
		c.curveTo(0 + xo, 3 * h / 5 + yo, 0 + xo, 2 * h / 5 + yo, w / 2 + xo, 2 * h / 5 + yo);
		c.curveTo(w / 2 - width + xo, 2 * h / 5 + yo, w / 2 - width + xo, 0 + yo, w / 2 + xo, 0 + yo);
		c.curveTo(w / 2 + width + xo, 0 + yo, w / 2 + width + xo, 2 * h / 5 + yo, w / 2 + xo, 2 * h / 5 + yo);
		c.curveTo(w + xo, 2 * h / 5 + yo, w + xo, 3 * h / 5 + yo, w + xo, h + yo);
		c.close();
		c.end();
		c.fillAndStroke();
		
	}
	mxCellRenderer.registerShape('userTask', UserTask);

	// ServiceTask Shape
	function ServiceTask() {
		mxRectangleShape.call(this);
	}
	mxUtils.extend(ServiceTask, mxRectangleShape);

	ServiceTask.prototype.paintVertexShape = function(c, x, y, wd, ht) {
		var w = 16;
		var h = 16;
		var width = w/3;
		var xo = 5;
		var yo = 5;
		var conner = 10;
		var scale = 4.3;

		var wd = (wd >= 2 * xo + w) ? wd : (2 * xo + w);
		var ht = (ht >= 2 * yo + h) ? ht : (2 * yo + h);

		c.translate(x, y);

		// draw round rect
		c.setStrokeWidth(2);
		c.begin();
		c.moveTo(0, ht - conner);
		c.lineTo(0, 0 + conner);
		c.arcTo(10, 10, 0, 0, 1, 10, 0);
		c.lineTo(wd - 10, 0);
		c.arcTo(10, 10, 0, 0, 1, wd, 10);
		c.lineTo(wd, ht - conner);
		c.arcTo(10, 10, 0, 0, 1, wd - conner, ht);
		c.lineTo(0 + conner, ht);
		c.arcTo(10, 10, 0, 0, 1, 0, ht - conner);
		c.close();

		c.end();
		c.fillAndStroke();

		// draw gear
		c.setStrokeWidth(1);
		c.begin();
		c.moveTo(16.46 / scale + xo, 41.42 / scale + yo);
		c.lineTo(24.57 / scale + xo, 47.75 / scale + yo);
		c.lineTo(23.69 / scale + xo, 54.53 / scale + yo);
		c.lineTo(14.4 / scale + xo, 58.22 / scale + yo);
		c.lineTo(17.35 / scale + xo, 71.04 / scale + yo);
		c.lineTo(27.81 / scale + xo, 69.72 / scale + yo);
		c.lineTo(31.79 / scale + xo, 75.32 / scale + yo);
		c.lineTo(27.96 / scale + xo, 84.46 / scale + yo);
		c.lineTo(38.87 / scale + xo, 91.24 / scale + yo);
		c.lineTo(45.21 / scale + xo, 83.13/ scale + yo);
		c.lineTo(52.28 / scale + xo, 84.01/ scale + yo);
		c.lineTo(55.97 / scale + xo, 93.3/ scale + yo);
		c.lineTo(68.64 / scale + xo, 90.35 / scale + yo);
		c.lineTo(67.46 / scale + xo, 79.74 / scale + yo);
		c.lineTo(72.92 / scale + xo, 75.32 / scale + yo);
		c.lineTo(81.61 / scale + xo, 79.89 / scale + yo);
		c.lineTo(88.98 / scale + xo, 68.68 / scale + yo);
		c.lineTo(80.43 / scale + xo, 62.05 / scale + yo);
		c.lineTo(81.32 / scale + xo, 55.42 / scale + yo);
		c.lineTo(90.9 / scale + xo, 51.73 / scale + yo);
		c.lineTo(88.1 / scale + xo, 39.06 / scale + yo);
		c.lineTo(77.04 / scale + xo, 40.24 / scale + yo);
		c.lineTo(73.21 / scale + xo, 35.22 / scale + yo);
		c.lineTo(77.19 / scale + xo, 25.5 / scale + yo);
		c.lineTo(66.14 / scale + xo, 19.01 / scale + yo);
		c.lineTo(59.21 / scale + xo, 27.27 / scale + yo);
		c.lineTo(52.43 / scale + xo, 26.23 / scale + yo);
		c.lineTo(48.15 / scale + xo, 16.8 / scale + yo);
		c.lineTo(35.92 / scale + xo, 20.04 / scale + yo);
		c.lineTo(37.1 / scale + xo, 30.36 / scale + yo);
		c.lineTo(32.53 / scale + xo, 34.34 / scale + yo);
		c.lineTo(23.1 / scale + xo, 30.36/ scale + yo);
		c.close();
		c.end();
		c.fillAndStroke();

		c.begin();
		c.ellipse(14.5, 15.5, 5, 5);
		c.close();
		c.end();
		c.fillAndStroke();
	}
	mxCellRenderer.registerShape('serviceTask', ServiceTask);


	// Dummy entries to avoid NPE in embed mode
	Graph.createHandle = function() {};
	Graph.handleFactory = {};
	
	mxRectangleShape.prototype.constraints = [new mxConnectionConstraint(new mxPoint(0, 0), true),
											  new mxConnectionConstraint(new mxPoint(0.25, 0), true),
	                                          new mxConnectionConstraint(new mxPoint(0.5, 0), true),
	                                          new mxConnectionConstraint(new mxPoint(0.75, 0), true),
	                                          new mxConnectionConstraint(new mxPoint(1, 0), true),
	        	              		 new mxConnectionConstraint(new mxPoint(0, 0.25), true),
	        	              		 new mxConnectionConstraint(new mxPoint(0, 0.5), true),
	        	              		 new mxConnectionConstraint(new mxPoint(0, 0.75), true),
	        	            		 new mxConnectionConstraint(new mxPoint(1, 0.25), true),
	        	            		 new mxConnectionConstraint(new mxPoint(1, 0.5), true),
	        	            		 new mxConnectionConstraint(new mxPoint(1, 0.75), true),
	        	            		 new mxConnectionConstraint(new mxPoint(0, 1), true),
	        	            		 new mxConnectionConstraint(new mxPoint(0.25, 1), true),
	        	            		 new mxConnectionConstraint(new mxPoint(0.5, 1), true),
	        	            		 new mxConnectionConstraint(new mxPoint(0.75, 1), true),
	        	            		 new mxConnectionConstraint(new mxPoint(1, 1), true)];
	mxEllipse.prototype.constraints = [new mxConnectionConstraint(new mxPoint(0, 0), true), new mxConnectionConstraint(new mxPoint(1, 0), true),
	                                   new mxConnectionConstraint(new mxPoint(0, 1), true), new mxConnectionConstraint(new mxPoint(1, 1), true),
	                                   new mxConnectionConstraint(new mxPoint(0.5, 0), true), new mxConnectionConstraint(new mxPoint(0.5, 1), true),
	          	              		   new mxConnectionConstraint(new mxPoint(0, 0.5), true), new mxConnectionConstraint(new mxPoint(1, 0.5))];
	mxDoubleEllipse.prototype.constraints = mxEllipse.prototype.constraints;
	mxRhombus.prototype.constraints = mxEllipse.prototype.constraints;
	mxTriangle.prototype.constraints = [new mxConnectionConstraint(new mxPoint(0, 0.25), true),
	                                    new mxConnectionConstraint(new mxPoint(0, 0.5), true),
	                                   new mxConnectionConstraint(new mxPoint(0, 0.75), true),
	                                   new mxConnectionConstraint(new mxPoint(0.5, 0), true),
	                                   new mxConnectionConstraint(new mxPoint(0.5, 1), true),
	                                   new mxConnectionConstraint(new mxPoint(1, 0.5), true)];
})();
