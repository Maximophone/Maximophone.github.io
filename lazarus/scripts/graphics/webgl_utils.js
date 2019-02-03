import { gl } from "./gl.js"

export class Shape{
    constructor(shape_def){
	this.vertex_buffer = gl.createBuffer()
	this.index_buffer = gl.createBuffer()
	this.attrib_params = Shape.get_attrib_params(shape_def)
	var data = Shape.get_data(shape_def)
	var indices = new Uint16Array(shape_def.indices)
	this.indices_length = indices.length
	this.total_elements = data.length/shape_def.n_vertices
	console.log(data)
	console.log(this.attrib_params)
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer)
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
	gl.bindBuffer(gl.ARRAY_BUFFER, null)
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER ,this.index_buffer)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    }
    static get_data(shape_def){
	var data = []
	var n_elements = 0
	for(var i = 0; i<shape_def.n_vertices; i++){
	    for(var attrib_name in shape_def.data){
		n_elements = shape_def.data[attrib_name].length/shape_def.n_vertices
		data = data.concat(shape_def.data[attrib_name].slice(i*n_elements, (i+1)*n_elements))
	    }
	}
	return new Float32Array(data)
    }
    static get_attrib_params(shape_def){
	var attrib_params = {}
	var offset = 0
	for(var attrib_name in shape_def.data){
	    attrib_params[attrib_name] = {
		n_elements: shape_def.data[attrib_name].length/shape_def.n_vertices,
		offset: offset
	    }
	    offset += shape_def.data[attrib_name].length/shape_def.n_vertices
	}
	return attrib_params
    }
    init(program){
	var attrib_locations = []
	for(var attrib in this.attrib_params){
	    var attrib_location = gl.getAttribLocation(program, attrib)
	    var params = this.attrib_params[attrib]
	    gl.vertexAttribPointer(
		attrib_location,
		params.n_elements,
		gl.FLOAT,
		gl.FALSE,
		this.total_elements*Float32Array.BYTES_PER_ELEMENT,
		params.offset*Float32Array.BYTES_PER_ELEMENT
	    )
	    gl.enableVertexAttribArray(attrib_location)
	}
    }
    draw(program){
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer)
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer)
	this.init(program)
	gl.drawElements(gl.TRIANGLES, this.indices_length, gl.UNSIGNED_SHORT, 0)
	gl.bindBuffer(gl.ARRAY_BUFFER, null)
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
	
    }
}

export class Uniform{
    constructor(program, uniform_name, type="mat4"){
	this.unif_location = gl.getUniformLocation(program, uniform_name)
	this.type = type
    }
    set(value){
	switch(this.type){
	case "mat4":
            gl.uniformMatrix4fv(this.unif_location, gl.FALSE, value)
            break
	case "vec4":
	    gl.uniform4fv(this.unif_location, value)
	    break
	case "float":
	    gl.uniform1f(this.unif_location, value)
	    break
	case "int":
	    gl.uniform1i(this.unif_location, value)
	    break
	}
    }
}

export function set_position_mat(position_mat, x, y, angle, scale){
    vec3.set(translation, x, y, 0)
    vec3.set(scale_vec, scale, scale, 1)
    mat4.translate(translation_mat, identity_mat, translation)
    mat4.rotate(rotation_mat, identity_mat, angle, [0, 0, 1])
    mat4.scale(scale_mat, identity_mat, scale_vec)
    
    
    mat4.mul(position_mat, rotation_mat, translation_mat)
    mat4.mul(position_mat, position_mat, scale_mat)
}

export function get_gl(canvas){
    var gl = canvas.getContext("webgl")
    if(!gl){
	console.log("Can't get webgl context, using experimental")
	gl = canvas.getContext("experimental-webgl")
    }
    if(!gl){
	alert("WebGL Not supported")
	return
    }
    //gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    //gl.depthFunc(gl.LESS)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0., 0., 0., 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    return gl
}

export function createShader(gl, source, shader_type){
    // shader type can be gl.VERTEX_SHADER 
    // or gl.FRAGMENT_SHADER
    var shader = gl.createShader(shader_type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
	console.error("Error compiling shader", gl.getShaderInfoLog(shader))
	return
    }
    return shader
}

export function createProgram(gl, vertex_shader, fragment_shader, debug=true){
    var program = gl.createProgram()
    console.log("empty program created")
    gl.attachShader(program, vertex_shader)
    console.log("vertex shader attached")
    gl.attachShader(program, fragment_shader)
    console.log("shaders attached")
    gl.linkProgram(program)
    console.log("program linked")
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
	console.error("Error linking program ", gl.getProgamInfoLog(program))
	return
    }
    if(debug){
	gl.validateProgram(program)
	if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
	    console.error("Error validating program ", gl.getProgramInfoLog(program))
	    return
	}
    } 
    return program
}

export function createBuffer(gl, vertices, buffer_type){
    // buffer type can be gl.ARRAY_BUFFER
    var buffer = gl.createBuffer()
    console.log("empty buffer created")
    gl.bindBuffer(buffer_type, buffer)
    gl.bufferData(buffer_type, new Float32Array(vertices), gl.STATIC_DRAW)
    //gl.bindBuffer(bufferType, null)
    return buffer
}
