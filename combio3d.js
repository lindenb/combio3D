function Combio()
	{
	
	}




Combio.prototype.intValue=function(id)
	{
	var input = document.getElementById(id);
	var n = parseInt(input.value, 10);
	if (Number( input.value)=== n ) return n;
	throw "Bad Integer for "+id;
	};
	
Combio.prototype.vertex=function(point)
	{
	return "   vertex "+point[0]+" "+point[1]+" "+point[2]+"\n";
	};
	

Combio.prototype.facet=function(points,normal)
	{
	var i,f="";
	f+=" facet normal "+normal[0]+" "+normal[1]+" "+normal[2]+"\n";
	f+="  outer loop\n";
	for(i=0;i< 3;++i)
		{
		f+= this.vertex(points[i]);
		}
	f+="  endloop\n";
	f+=" endfacet\n";
	return f;
	};

Combio.prototype.square=function(points,normal)
	{
	f= this.facet(points,normal);
	f+= this.facet([
		points[0],
			[
			points[2][0] + (points[0][0] - points[1][0]), 
			points[2][1] + (points[0][1] - points[1][1]), 
			points[2][2] + (points[0][2] - points[1][2])
			],
		points[2]
		],normal);
	return f;
	};

Combio.prototype.repaint=function(evt)
	{
	var i,path="",x=0,y=0,width=0,height=0;
	try
		{
		var  nTeeth = this.intValue("nTeeth");
		for(i=0; i < nTeeth;++i)
			{
			//stl+= this.square([[1,2,3],[4,5,6],[4,5,6]]);
			}
		
		path  ="0,0";
		y+=this.intValue("a") ; path += " "+x+","+y;
		x+=this.intValue("b") ; path += " "+x+","+y;
		y+=this.intValue("c") ; path += " "+x+","+y;
		height = y;
		for(i = 0;i< nTeeth;++i)
			{
			y+=this.intValue("d") ; path += " "+x+","+y; height = y;
			x+=this.intValue("e") ; path += " "+x+","+y;
			y-=this.intValue("d") ; path += " "+x+","+y;
			if(i+1<nTeeth)
				{
				x+=this.intValue("f") ; path += " "+x+","+y;
				}
			}
		y-=this.intValue("c") ; path += " "+x+","+y;
		x+=this.intValue("b") ; path += " "+x+","+y; width=x;
		y-=this.intValue("a") ; path += " "+x+","+y;
		path += " 0,0";
		width+=this.intValue("thickness")+1;
		height+=this.intValue("thickness")+1;
		document.getElementById("transform").setAttribute(
			"transform","translate("+this.intValue("thickness")+","+this.intValue("thickness")+")");
		document.getElementById("path0").setAttribute("points",path);
		document.getElementById("path1").setAttribute("points",path);
		document.getElementById("image").setAttribute("width",width);
		document.getElementById("image").setAttribute("height",height);
		}
	catch(err)
		{
		console.log(err.message);
		}

	};

Combio.prototype.cubeface=function(x,y,width,height)
	{
	var s="";
	var z=this.intValue("thickness");
	// face I
	s+= this.square([
		[x,y+height,0],
		[x,y,0],
		[x+width,y,0],
		],[0,0,-1]);
	
	//face VI
	s+= this.square([
		[x,y+height,z],
		[x,y,z],
		[x+width,y,z],
		],[0,0,1]);
	
	//face II
	s+= this.square([
		[x,y,0],
		[x,y,z],
		[x,y+height,z],
		],[-1,0,0]);
	
	//face IV
	s+= this.square([
		[x+width,y,0],
		[x+width,y,z],
		[x+width,y+height,z],
		],[1,0,0]);
	
	// face I
	s+= this.square([
		[x,y,0],
		[x,y,z],
		[x+width,y,z],
		],[0,-1,0]);
	// face IV
	s+= this.square([
		[x,y+height,0],
		[x,y+height,z],
		[x+width,y+height,z],
		],[0,1,0]);
	
	return s;
	};

Combio.prototype.update=function(evt)
	{
	var i,stl="solid comb\n",
		pre = document.getElementById("output");
	
	
	while(pre.hasChildNodes()) pre.removeChild( pre.firstChild );
	try
		{
		var  nTeeth = this.intValue("nTeeth");
		stl += this.cubeface(0,0,
				2*this.intValue("b") + nTeeth*this.intValue("e") + (nTeeth-1)*this.intValue("f"),
				this.intValue("a")
				);
		
		stl += this.cubeface(
				this.intValue("b"),
				this.intValue("a"),
				nTeeth*this.intValue("e") + (nTeeth-1)*this.intValue("f"),
				this.intValue("c")
				);
		
		for(i=0; i < nTeeth;++i)
			{
			stl += this.cubeface(
				this.intValue("b")+i*(this.intValue("e")+this.intValue("f")),
				this.intValue("a")+this.intValue("c"),
				this.intValue("e"),
				this.intValue("d")
				);
			}
		stl += "endsolid comb\n";
		this.repaint();
		}
	catch(err)
		{
		stl="#Error ("+ err.message+")";
		}
	pre.appendChild(document.createTextNode(stl));
	};
	


window.addEventListener("load",function()
	{
	var main = new Combio();
	var i,inputs = document.getElementsByTagName("input");
	var callback = function(evt)
		{
		
		main.update();
		};
	main.repaint();
	for(i=0;i < inputs.length;++i)
		{
		inputs[i].addEventListener("change",callback,false);
		}
	},false);

