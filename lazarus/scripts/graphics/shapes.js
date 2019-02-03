var triangle_vertices = [
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5,
]

var triangle_colors = [
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0
]

var rect_vertices = [
    1.0, 1.0,
    -1.0, 1.0,
    -1.0, -1.0,
    1.0, -1.0,
]

var rect_colors = [
    1.0, 0.5, 0.5,
    0.5, 1.0, 0.5,
    0.5, 0.5, 1.0,
    0.5, 0.5, 0.5
]

var circle_vertices = []
var circle_colors = [1.0, 0, 1.0]
var circle_indices = []
var center = [0.0, 0.0]
circle_vertices.push(center[0])
circle_vertices.push(center[1])
var n_points_circle = 360
var r = 1
for (var i = 0; i < n_points_circle; i++){
    circle_vertices.push(center[0] + r*Math.cos(i*2*Math.PI/n_points_circle))
    circle_vertices.push(center[1] + r*Math.sin(i*2*Math.PI/n_points_circle))
    circle_colors.push(1.0)
    circle_colors.push(i/n_points_circle)
    circle_colors.push(1.0)
    circle_indices.push(0)
    circle_indices.push(i+1)
    circle_indices.push((i+1)%n_points_circle+1)
}

export var circle_def = {
    data: {
	vertPosition: circle_vertices,
	// vertColor: circle_colors
    },
    indices: circle_indices,
    n_vertices: n_points_circle + 1
}


export var triangle_def = {
    data: {
	vertPosition: triangle_vertices,
	// vertColor: triangle_colors 
    },
    indices: [
	0, 1, 2
    ],
    n_vertices: 3
}

export var rect_def = {
    data: {
	vertPosition: rect_vertices,
	// vertColor: rect_colors
    },
    indices: [
	0, 1, 2,
	0, 2, 3
    ],
    n_vertices: 4
}
