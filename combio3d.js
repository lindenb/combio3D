function $(id)
	{
	return document.getElementById(id);
	}

function intgtzero(id)
	{
	var input = $(id);
	var n = parseInt(input.value, 10);
	if (Number( input.value)=== n ) return n;
	throw "Bad Integer for "+id;
	}
	
function vertex(point)
	{
	return "   vertex "+point.x+" "+point.y+" "+point.z+"\n";
	}	
	

function facet(points)
	{
	var i,f="";
	f+=" facet normal 0 -1 0\n";
	f+="  outer loop\n";
	for(i=0;i< 3;++i)
		{
		f+= vertex(points[i]);
		}
	f+="  endloop\n";
	f+=" endfacet\n";
	return f;
	}

function square(points)
	{
	f= facet(points);
	f+= facet([
		points[0],
			{
			x: points[2].x + (points[0].x - points[1].x), 
			y: points[2].y + (points[0].y - points[1].y), 
			z: points[2].z + (points[0].z - points[1].z)
			},
		points[2]
		]);
	return f;
	}

function cub(points,height)
	{
	//top face
	f=  square(points);
	//bottom face
	f+= square([
		{x:points[0].x,y:points[0].y,z:points[0].z - height},
		{x:points[0].x,y:points[0].y,z:points[0].z - height},
		{x:points[0].x,y:points[0].y,z:points[0].z - height}
		]);
	return f;
	}

function update_stl(evt)
	{
	var i,stl="solid comb\n", pre = $("output");
	while(pre.hasChildNodes()) pre.removeChild( pre.firstChild );
	try
		{
		var  n = intgtzero("N");
		for(i=0;i<n;++i)
			{
			stl+= square([{x:1,y:2,z:3},{x:1,y:-2,z:3},{x:10,y:2,z:23}]);
			}
		stl += "endsolid comb\n";
		}
	catch(err)
		{
		stl="#Error "+ err.message;
		}
	pre.appendChild(document.createTextNode(stl));
	}

window.addEventListener("load",function()
	{
	var i,inputs = document.getElementsByTagName("input");
	
	for(i=0;i < inputs.length;++i)
		{
		inputs[i].addEventListener("change",update_stl,false);
		}   
	},false);

