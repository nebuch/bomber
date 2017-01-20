﻿var cr = {};
cr.plugins_ = {};
cr.behaviors = {};
if (typeof Object.getPrototypeOf !== "function")
{
	if (typeof "test".__proto__ === "object")
	{
		Object.getPrototypeOf = function(object) {
			return object.__proto__;
		};
	}
	else
	{
		Object.getPrototypeOf = function(object) {
			return object.constructor.prototype;
		};
	}
}
(function(){
	cr.logexport = function (msg)
	{
		if (window.console && window.console.log)
			window.console.log(msg);
	};
	cr.logerror = function (msg)
	{
		if (window.console && window.console.error)
			window.console.error(msg);
	};
	cr.seal = function(x)
	{
		return x;
	};
	cr.freeze = function(x)
	{
		return x;
	};
	cr.is_undefined = function (x)
	{
		return typeof x === "undefined";
	};
	cr.is_number = function (x)
	{
		return typeof x === "number";
	};
	cr.is_string = function (x)
	{
		return typeof x === "string";
	};
	cr.isPOT = function (x)
	{
		return x > 0 && ((x - 1) & x) === 0;
	};
	cr.nextHighestPowerOfTwo = function(x) {
		--x;
		for (var i = 1; i < 32; i <<= 1) {
			x = x | x >> i;
		}
		return x + 1;
	}
	cr.abs = function (x)
	{
		return (x < 0 ? -x : x);
	};
	cr.max = function (a, b)
	{
		return (a > b ? a : b);
	};
	cr.min = function (a, b)
	{
		return (a < b ? a : b);
	};
	cr.PI = Math.PI;
	cr.round = function (x)
	{
		return (x + 0.5) | 0;
	};
	cr.floor = function (x)
	{
		if (x >= 0)
			return x | 0;
		else
			return (x | 0) - 1;		// correctly round down when negative
	};
	cr.ceil = function (x)
	{
		var f = x | 0;
		return (f === x ? f : f + 1);
	};
	function Vector2(x, y)
	{
		this.x = x;
		this.y = y;
		cr.seal(this);
	};
	Vector2.prototype.offset = function (px, py)
	{
		this.x += px;
		this.y += py;
		return this;
	};
	Vector2.prototype.mul = function (px, py)
	{
		this.x *= px;
		this.y *= py;
		return this;
	};
	cr.vector2 = Vector2;
	cr.segments_intersect = function(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y)
	{
		var max_ax, min_ax, max_ay, min_ay, max_bx, min_bx, max_by, min_by;
		if (a1x < a2x)
		{
			min_ax = a1x;
			max_ax = a2x;
		}
		else
		{
			min_ax = a2x;
			max_ax = a1x;
		}
		if (b1x < b2x)
		{
			min_bx = b1x;
			max_bx = b2x;
		}
		else
		{
			min_bx = b2x;
			max_bx = b1x;
		}
		if (max_ax < min_bx || min_ax > max_bx)
			return false;
		if (a1y < a2y)
		{
			min_ay = a1y;
			max_ay = a2y;
		}
		else
		{
			min_ay = a2y;
			max_ay = a1y;
		}
		if (b1y < b2y)
		{
			min_by = b1y;
			max_by = b2y;
		}
		else
		{
			min_by = b2y;
			max_by = b1y;
		}
		if (max_ay < min_by || min_ay > max_by)
			return false;
		var dpx = b1x - a1x + b2x - a2x;
		var dpy = b1y - a1y + b2y - a2y;
		var qax = a2x - a1x;
		var qay = a2y - a1y;
		var qbx = b2x - b1x;
		var qby = b2y - b1y;
		var d = cr.abs(qay * qbx - qby * qax);
		var la = qbx * dpy - qby * dpx;
		if (cr.abs(la) > d)
			return false;
		var lb = qax * dpy - qay * dpx;
		return cr.abs(lb) <= d;
	};
	function Rect(left, top, right, bottom)
	{
		this.set(left, top, right, bottom);
		cr.seal(this);
	};
	Rect.prototype.set = function (left, top, right, bottom)
	{
		this.left = left;
		this.top = top;
		this.right = right;
		this.bottom = bottom;
	};
	Rect.prototype.copy = function (r)
	{
		this.left = r.left;
		this.top = r.top;
		this.right = r.right;
		this.bottom = r.bottom;
	};
	Rect.prototype.width = function ()
	{
		return this.right - this.left;
	};
	Rect.prototype.height = function ()
	{
		return this.bottom - this.top;
	};
	Rect.prototype.offset = function (px, py)
	{
		this.left += px;
		this.top += py;
		this.right += px;
		this.bottom += py;
		return this;
	};
	Rect.prototype.normalize = function ()
	{
		var temp = 0;
		if (this.left > this.right)
		{
			temp = this.left;
			this.left = this.right;
			this.right = temp;
		}
		if (this.top > this.bottom)
		{
			temp = this.top;
			this.top = this.bottom;
			this.bottom = temp;
		}
	};
	Rect.prototype.intersects_rect = function (rc)
	{
		return !(rc.right < this.left || rc.bottom < this.top || rc.left > this.right || rc.top > this.bottom);
	};
	Rect.prototype.intersects_rect_off = function (rc, ox, oy)
	{
		return !(rc.right + ox < this.left || rc.bottom + oy < this.top || rc.left + ox > this.right || rc.top + oy > this.bottom);
	};
	Rect.prototype.contains_pt = function (x, y)
	{
		return (x >= this.left && x <= this.right) && (y >= this.top && y <= this.bottom);
	};
	Rect.prototype.equals = function (r)
	{
		return this.left === r.left && this.top === r.top && this.right === r.right && this.bottom === r.bottom;
	};
	cr.rect = Rect;
	function Quad()
	{
		this.tlx = 0;
		this.tly = 0;
		this.trx = 0;
		this.try_ = 0;	// is a keyword otherwise!
		this.brx = 0;
		this.bry = 0;
		this.blx = 0;
		this.bly = 0;
		cr.seal(this);
	};
	Quad.prototype.set_from_rect = function (rc)
	{
		this.tlx = rc.left;
		this.tly = rc.top;
		this.trx = rc.right;
		this.try_ = rc.top;
		this.brx = rc.right;
		this.bry = rc.bottom;
		this.blx = rc.left;
		this.bly = rc.bottom;
	};
	Quad.prototype.set_from_rotated_rect = function (rc, a)
	{
		if (a === 0)
		{
			this.set_from_rect(rc);
		}
		else
		{
			var sin_a = Math.sin(a);
			var cos_a = Math.cos(a);
			var left_sin_a = rc.left * sin_a;
			var top_sin_a = rc.top * sin_a;
			var right_sin_a = rc.right * sin_a;
			var bottom_sin_a = rc.bottom * sin_a;
			var left_cos_a = rc.left * cos_a;
			var top_cos_a = rc.top * cos_a;
			var right_cos_a = rc.right * cos_a;
			var bottom_cos_a = rc.bottom * cos_a;
			this.tlx = left_cos_a - top_sin_a;
			this.tly = top_cos_a + left_sin_a;
			this.trx = right_cos_a - top_sin_a;
			this.try_ = top_cos_a + right_sin_a;
			this.brx = right_cos_a - bottom_sin_a;
			this.bry = bottom_cos_a + right_sin_a;
			this.blx = left_cos_a - bottom_sin_a;
			this.bly = bottom_cos_a + left_sin_a;
		}
	};
	Quad.prototype.offset = function (px, py)
	{
		this.tlx += px;
		this.tly += py;
		this.trx += px;
		this.try_ += py;
		this.brx += px;
		this.bry += py;
		this.blx += px;
		this.bly += py;
		return this;
	};
	var minresult = 0;
	var maxresult = 0;
	function minmax4(a, b, c, d)
	{
		if (a < b)
		{
			if (c < d)
			{
				if (a < c)
					minresult = a;
				else
					minresult = c;
				if (b > d)
					maxresult = b;
				else
					maxresult = d;
			}
			else
			{
				if (a < d)
					minresult = a;
				else
					minresult = d;
				if (b > c)
					maxresult = b;
				else
					maxresult = c;
			}
		}
		else
		{
			if (c < d)
			{
				if (b < c)
					minresult = b;
				else
					minresult = c;
				if (a > d)
					maxresult = a;
				else
					maxresult = d;
			}
			else
			{
				if (b < d)
					minresult = b;
				else
					minresult = d;
				if (a > c)
					maxresult = a;
				else
					maxresult = c;
			}
		}
	};
	Quad.prototype.bounding_box = function (rc)
	{
		minmax4(this.tlx, this.trx, this.brx, this.blx);
		rc.left = minresult;
		rc.right = maxresult;
		minmax4(this.tly, this.try_, this.bry, this.bly);
		rc.top = minresult;
		rc.bottom = maxresult;
	};
	Quad.prototype.contains_pt = function (x, y)
	{
		var tlx = this.tlx;
		var tly = this.tly;
		var v0x = this.trx - tlx;
		var v0y = this.try_ - tly;
		var v1x = this.brx - tlx;
		var v1y = this.bry - tly;
		var v2x = x - tlx;
		var v2y = y - tly;
		var dot00 = v0x * v0x + v0y * v0y
		var dot01 = v0x * v1x + v0y * v1y
		var dot02 = v0x * v2x + v0y * v2y
		var dot11 = v1x * v1x + v1y * v1y
		var dot12 = v1x * v2x + v1y * v2y
		var invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
		var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
		var v = (dot00 * dot12 - dot01 * dot02) * invDenom;
		if ((u >= 0.0) && (v > 0.0) && (u + v < 1))
			return true;
		v0x = this.blx - tlx;
		v0y = this.bly - tly;
		var dot00 = v0x * v0x + v0y * v0y
		var dot01 = v0x * v1x + v0y * v1y
		var dot02 = v0x * v2x + v0y * v2y
		invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
		u = (dot11 * dot02 - dot01 * dot12) * invDenom;
		v = (dot00 * dot12 - dot01 * dot02) * invDenom;
		return (u >= 0.0) && (v > 0.0) && (u + v < 1);
	};
	Quad.prototype.at = function (i, xory)
	{
		if (xory)
		{
			switch (i)
			{
				case 0: return this.tlx;
				case 1: return this.trx;
				case 2: return this.brx;
				case 3: return this.blx;
				case 4: return this.tlx;
				default: return this.tlx;
			}
		}
		else
		{
			switch (i)
			{
				case 0: return this.tly;
				case 1: return this.try_;
				case 2: return this.bry;
				case 3: return this.bly;
				case 4: return this.tly;
				default: return this.tly;
			}
		}
	};
	Quad.prototype.midX = function ()
	{
		return (this.tlx + this.trx  + this.brx + this.blx) / 4;
	};
	Quad.prototype.midY = function ()
	{
		return (this.tly + this.try_ + this.bry + this.bly) / 4;
	};
	Quad.prototype.intersects_segment = function (x1, y1, x2, y2)
	{
		if (this.contains_pt(x1, y1) || this.contains_pt(x2, y2))
			return true;
		var a1x, a1y, a2x, a2y;
		var i;
		for (i = 0; i < 4; i++)
		{
			a1x = this.at(i, true);
			a1y = this.at(i, false);
			a2x = this.at(i + 1, true);
			a2y = this.at(i + 1, false);
			if (cr.segments_intersect(x1, y1, x2, y2, a1x, a1y, a2x, a2y))
				return true;
		}
		return false;
	};
	Quad.prototype.intersects_quad = function (rhs)
	{
		var midx = rhs.midX();
		var midy = rhs.midY();
		if (this.contains_pt(midx, midy))
			return true;
		midx = this.midX();
		midy = this.midY();
		if (rhs.contains_pt(midx, midy))
			return true;
		var a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y;
		var i, j;
		for (i = 0; i < 4; i++)
		{
			for (j = 0; j < 4; j++)
			{
				a1x = this.at(i, true);
				a1y = this.at(i, false);
				a2x = this.at(i + 1, true);
				a2y = this.at(i + 1, false);
				b1x = rhs.at(j, true);
				b1y = rhs.at(j, false);
				b2x = rhs.at(j + 1, true);
				b2y = rhs.at(j + 1, false);
				if (cr.segments_intersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y))
					return true;
			}
		}
		return false;
	};
	cr.quad = Quad;
	cr.RGB = function (red, green, blue)
	{
		return Math.max(Math.min(red, 255), 0)
			 | (Math.max(Math.min(green, 255), 0) << 8)
			 | (Math.max(Math.min(blue, 255), 0) << 16);
	};
	cr.GetRValue = function (rgb)
	{
		return rgb & 0xFF;
	};
	cr.GetGValue = function (rgb)
	{
		return (rgb & 0xFF00) >> 8;
	};
	cr.GetBValue = function (rgb)
	{
		return (rgb & 0xFF0000) >> 16;
	};
	cr.shallowCopy = function (a, b, allowOverwrite)
	{
		var attr;
		for (attr in b)
		{
			if (b.hasOwnProperty(attr))
			{
;
				a[attr] = b[attr];
			}
		}
		return a;
	};
	cr.arrayRemove = function (arr, index)
	{
		var i, len;
		index = cr.floor(index);
		if (index < 0 || index >= arr.length)
			return;							// index out of bounds
		for (i = index, len = arr.length - 1; i < len; i++)
			arr[i] = arr[i + 1];
		cr.truncateArray(arr, len);
	};
	cr.truncateArray = function (arr, index)
	{
		arr.length = index;
	};
	cr.clearArray = function (arr)
	{
		cr.truncateArray(arr, 0);
	};
	cr.shallowAssignArray = function (dest, src)
	{
		cr.clearArray(dest);
		var i, len;
		for (i = 0, len = src.length; i < len; ++i)
			dest[i] = src[i];
	};
	cr.appendArray = function (a, b)
	{
		a.push.apply(a, b);
	};
	cr.fastIndexOf = function (arr, item)
	{
		var i, len;
		for (i = 0, len = arr.length; i < len; ++i)
		{
			if (arr[i] === item)
				return i;
		}
		return -1;
	};
	cr.arrayFindRemove = function (arr, item)
	{
		var index = cr.fastIndexOf(arr, item);
		if (index !== -1)
			cr.arrayRemove(arr, index);
	};
	cr.clamp = function(x, a, b)
	{
		if (x < a)
			return a;
		else if (x > b)
			return b;
		else
			return x;
	};
	cr.to_radians = function(x)
	{
		return x / (180.0 / cr.PI);
	};
	cr.to_degrees = function(x)
	{
		return x * (180.0 / cr.PI);
	};
	cr.clamp_angle_degrees = function (a)
	{
		a %= 360;       // now in (-360, 360) range
		if (a < 0)
			a += 360;   // now in [0, 360) range
		return a;
	};
	cr.clamp_angle = function (a)
	{
		a %= 2 * cr.PI;       // now in (-2pi, 2pi) range
		if (a < 0)
			a += 2 * cr.PI;   // now in [0, 2pi) range
		return a;
	};
	cr.to_clamped_degrees = function (x)
	{
		return cr.clamp_angle_degrees(cr.to_degrees(x));
	};
	cr.to_clamped_radians = function (x)
	{
		return cr.clamp_angle(cr.to_radians(x));
	};
	cr.angleTo = function(x1, y1, x2, y2)
	{
		var dx = x2 - x1;
        var dy = y2 - y1;
		return Math.atan2(dy, dx);
	};
	cr.angleDiff = function (a1, a2)
	{
		if (a1 === a2)
			return 0;
		var s1 = Math.sin(a1);
		var c1 = Math.cos(a1);
		var s2 = Math.sin(a2);
		var c2 = Math.cos(a2);
		var n = s1 * s2 + c1 * c2;
		if (n >= 1)
			return 0;
		if (n <= -1)
			return cr.PI;
		return Math.acos(n);
	};
	cr.angleRotate = function (start, end, step)
	{
		var ss = Math.sin(start);
		var cs = Math.cos(start);
		var se = Math.sin(end);
		var ce = Math.cos(end);
		if (Math.acos(ss * se + cs * ce) > step)
		{
			if (cs * se - ss * ce > 0)
				return cr.clamp_angle(start + step);
			else
				return cr.clamp_angle(start - step);
		}
		else
			return cr.clamp_angle(end);
	};
	cr.angleClockwise = function (a1, a2)
	{
		var s1 = Math.sin(a1);
		var c1 = Math.cos(a1);
		var s2 = Math.sin(a2);
		var c2 = Math.cos(a2);
		return c1 * s2 - s1 * c2 <= 0;
	};
	cr.rotatePtAround = function (px, py, a, ox, oy, getx)
	{
		if (a === 0)
			return getx ? px : py;
		var sin_a = Math.sin(a);
		var cos_a = Math.cos(a);
		px -= ox;
		py -= oy;
		var left_sin_a = px * sin_a;
		var top_sin_a = py * sin_a;
		var left_cos_a = px * cos_a;
		var top_cos_a = py * cos_a;
		px = left_cos_a - top_sin_a;
		py = top_cos_a + left_sin_a;
		px += ox;
		py += oy;
		return getx ? px : py;
	}
	cr.distanceTo = function(x1, y1, x2, y2)
	{
		var dx = x2 - x1;
        var dy = y2 - y1;
		return Math.sqrt(dx*dx + dy*dy);
	};
	cr.xor = function (x, y)
	{
		return !x !== !y;
	};
	cr.lerp = function (a, b, x)
	{
		return a + (b - a) * x;
	};
	cr.unlerp = function (a, b, c)
	{
		if (a === b)
			return 0;		// avoid divide by 0
		return (c - a) / (b - a);
	};
	cr.anglelerp = function (a, b, x)
	{
		var diff = cr.angleDiff(a, b);
		if (cr.angleClockwise(b, a))
		{
			return a + diff * x;
		}
		else
		{
			return a - diff * x;
		}
	};
	cr.qarp = function (a, b, c, x)
	{
		return cr.lerp(cr.lerp(a, b, x), cr.lerp(b, c, x), x);
	};
	cr.cubic = function (a, b, c, d, x)
	{
		return cr.lerp(cr.qarp(a, b, c, x), cr.qarp(b, c, d, x), x);
	};
	cr.cosp = function (a, b, x)
	{
		return (a + b + (a - b) * Math.cos(x * Math.PI)) / 2;
	};
	cr.hasAnyOwnProperty = function (o)
	{
		var p;
		for (p in o)
		{
			if (o.hasOwnProperty(p))
				return true;
		}
		return false;
	};
	cr.wipe = function (obj)
	{
		var p;
		for (p in obj)
		{
			if (obj.hasOwnProperty(p))
				delete obj[p];
		}
	};
	var startup_time = +(new Date());
	cr.performance_now = function()
	{
		if (typeof window["performance"] !== "undefined")
		{
			var winperf = window["performance"];
			if (typeof winperf.now !== "undefined")
				return winperf.now();
			else if (typeof winperf["webkitNow"] !== "undefined")
				return winperf["webkitNow"]();
			else if (typeof winperf["mozNow"] !== "undefined")
				return winperf["mozNow"]();
			else if (typeof winperf["msNow"] !== "undefined")
				return winperf["msNow"]();
		}
		return Date.now() - startup_time;
	};
	var isChrome = false;
	var isSafari = false;
	var isiOS = false;
	var isEjecta = false;
	if (typeof window !== "undefined")		// not c2 editor
	{
		isChrome = /chrome/i.test(navigator.userAgent) || /chromium/i.test(navigator.userAgent);
		isSafari = !isChrome && /safari/i.test(navigator.userAgent);
		isiOS = /(iphone|ipod|ipad)/i.test(navigator.userAgent);
		isEjecta = window["c2ejecta"];
	}
	var supports_set = ((!isSafari && !isEjecta && !isiOS) && (typeof Set !== "undefined" && typeof Set.prototype["forEach"] !== "undefined"));
	function ObjectSet_()
	{
		this.s = null;
		this.items = null;			// lazy allocated (hopefully results in better GC performance)
		this.item_count = 0;
		if (supports_set)
		{
			this.s = new Set();
		}
		this.values_cache = [];
		this.cache_valid = true;
		cr.seal(this);
	};
	ObjectSet_.prototype.contains = function (x)
	{
		if (this.isEmpty())
			return false;
		if (supports_set)
			return this.s["has"](x);
		else
			return (this.items && this.items.hasOwnProperty(x));
	};
	ObjectSet_.prototype.add = function (x)
	{
		if (supports_set)
		{
			if (!this.s["has"](x))
			{
				this.s["add"](x);
				this.cache_valid = false;
			}
		}
		else
		{
			var str = x.toString();
			var items = this.items;
			if (!items)
			{
				this.items = {};
				this.items[str] = x;
				this.item_count = 1;
				this.cache_valid = false;
			}
			else if (!items.hasOwnProperty(str))
			{
				items[str] = x;
				this.item_count++;
				this.cache_valid = false;
			}
		}
	};
	ObjectSet_.prototype.remove = function (x)
	{
		if (this.isEmpty())
			return;
		if (supports_set)
		{
			if (this.s["has"](x))
			{
				this.s["delete"](x);
				this.cache_valid = false;
			}
		}
		else if (this.items)
		{
			var str = x.toString();
			var items = this.items;
			if (items.hasOwnProperty(str))
			{
				delete items[str];
				this.item_count--;
				this.cache_valid = false;
			}
		}
	};
	ObjectSet_.prototype.clear = function (/*wipe_*/)
	{
		if (this.isEmpty())
			return;
		if (supports_set)
		{
			this.s["clear"]();			// best!
		}
		else
		{
				this.items = null;		// creates garbage; will lazy allocate on next add()
			this.item_count = 0;
		}
		cr.clearArray(this.values_cache);
		this.cache_valid = true;
	};
	ObjectSet_.prototype.isEmpty = function ()
	{
		return this.count() === 0;
	};
	ObjectSet_.prototype.count = function ()
	{
		if (supports_set)
			return this.s["size"];
		else
			return this.item_count;
	};
	var current_arr = null;
	var current_index = 0;
	function set_append_to_arr(x)
	{
		current_arr[current_index++] = x;
	};
	ObjectSet_.prototype.update_cache = function ()
	{
		if (this.cache_valid)
			return;
		if (supports_set)
		{
			cr.clearArray(this.values_cache);
			current_arr = this.values_cache;
			current_index = 0;
			this.s["forEach"](set_append_to_arr);
;
			current_arr = null;
			current_index = 0;
		}
		else
		{
			var values_cache = this.values_cache;
			cr.clearArray(values_cache);
			var p, n = 0, items = this.items;
			if (items)
			{
				for (p in items)
				{
					if (items.hasOwnProperty(p))
						values_cache[n++] = items[p];
				}
			}
;
		}
		this.cache_valid = true;
	};
	ObjectSet_.prototype.valuesRef = function ()
	{
		this.update_cache();
		return this.values_cache;
	};
	cr.ObjectSet = ObjectSet_;
	var tmpSet = new cr.ObjectSet();
	cr.removeArrayDuplicates = function (arr)
	{
		var i, len;
		for (i = 0, len = arr.length; i < len; ++i)
		{
			tmpSet.add(arr[i]);
		}
		cr.shallowAssignArray(arr, tmpSet.valuesRef());
		tmpSet.clear();
	};
	cr.arrayRemoveAllFromObjectSet = function (arr, remset)
	{
		if (supports_set)
			cr.arrayRemoveAll_set(arr, remset.s);
		else
			cr.arrayRemoveAll_arr(arr, remset.valuesRef());
	};
	cr.arrayRemoveAll_set = function (arr, s)
	{
		var i, j, len, item;
		for (i = 0, j = 0, len = arr.length; i < len; ++i)
		{
			item = arr[i];
			if (!s["has"](item))					// not an item to remove
				arr[j++] = item;					// keep it
		}
		cr.truncateArray(arr, j);
	};
	cr.arrayRemoveAll_arr = function (arr, rem)
	{
		var i, j, len, item;
		for (i = 0, j = 0, len = arr.length; i < len; ++i)
		{
			item = arr[i];
			if (cr.fastIndexOf(rem, item) === -1)	// not an item to remove
				arr[j++] = item;					// keep it
		}
		cr.truncateArray(arr, j);
	};
	function KahanAdder_()
	{
		this.c = 0;
        this.y = 0;
        this.t = 0;
        this.sum = 0;
		cr.seal(this);
	};
	KahanAdder_.prototype.add = function (v)
	{
		this.y = v - this.c;
	    this.t = this.sum + this.y;
	    this.c = (this.t - this.sum) - this.y;
	    this.sum = this.t;
	};
    KahanAdder_.prototype.reset = function ()
    {
        this.c = 0;
        this.y = 0;
        this.t = 0;
        this.sum = 0;
    };
	cr.KahanAdder = KahanAdder_;
	cr.regexp_escape = function(text)
	{
		return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	};
	function CollisionPoly_(pts_array_)
	{
		this.pts_cache = [];
		this.bboxLeft = 0;
		this.bboxTop = 0;
		this.bboxRight = 0;
		this.bboxBottom = 0;
		this.convexpolys = null;		// for physics behavior to cache separated polys
		this.set_pts(pts_array_);
		cr.seal(this);
	};
	CollisionPoly_.prototype.set_pts = function(pts_array_)
	{
		this.pts_array = pts_array_;
		this.pts_count = pts_array_.length / 2;			// x, y, x, y... in array
		this.pts_cache.length = pts_array_.length;
		this.cache_width = -1;
		this.cache_height = -1;
		this.cache_angle = 0;
	};
	CollisionPoly_.prototype.is_empty = function()
	{
		return !this.pts_array.length;
	};
	CollisionPoly_.prototype.update_bbox = function ()
	{
		var myptscache = this.pts_cache;
		var bboxLeft_ = myptscache[0];
		var bboxRight_ = bboxLeft_;
		var bboxTop_ = myptscache[1];
		var bboxBottom_ = bboxTop_;
		var x, y, i = 1, i2, len = this.pts_count;
		for ( ; i < len; ++i)
		{
			i2 = i*2;
			x = myptscache[i2];
			y = myptscache[i2+1];
			if (x < bboxLeft_)
				bboxLeft_ = x;
			if (x > bboxRight_)
				bboxRight_ = x;
			if (y < bboxTop_)
				bboxTop_ = y;
			if (y > bboxBottom_)
				bboxBottom_ = y;
		}
		this.bboxLeft = bboxLeft_;
		this.bboxRight = bboxRight_;
		this.bboxTop = bboxTop_;
		this.bboxBottom = bboxBottom_;
	};
	CollisionPoly_.prototype.set_from_rect = function(rc, offx, offy)
	{
		this.pts_cache.length = 8;
		this.pts_count = 4;
		var myptscache = this.pts_cache;
		myptscache[0] = rc.left - offx;
		myptscache[1] = rc.top - offy;
		myptscache[2] = rc.right - offx;
		myptscache[3] = rc.top - offy;
		myptscache[4] = rc.right - offx;
		myptscache[5] = rc.bottom - offy;
		myptscache[6] = rc.left - offx;
		myptscache[7] = rc.bottom - offy;
		this.cache_width = rc.right - rc.left;
		this.cache_height = rc.bottom - rc.top;
		this.update_bbox();
	};
	CollisionPoly_.prototype.set_from_quad = function(q, offx, offy, w, h)
	{
		this.pts_cache.length = 8;
		this.pts_count = 4;
		var myptscache = this.pts_cache;
		myptscache[0] = q.tlx - offx;
		myptscache[1] = q.tly - offy;
		myptscache[2] = q.trx - offx;
		myptscache[3] = q.try_ - offy;
		myptscache[4] = q.brx - offx;
		myptscache[5] = q.bry - offy;
		myptscache[6] = q.blx - offx;
		myptscache[7] = q.bly - offy;
		this.cache_width = w;
		this.cache_height = h;
		this.update_bbox();
	};
	CollisionPoly_.prototype.set_from_poly = function (r)
	{
		this.pts_count = r.pts_count;
		cr.shallowAssignArray(this.pts_cache, r.pts_cache);
		this.bboxLeft = r.bboxLeft;
		this.bboxTop - r.bboxTop;
		this.bboxRight = r.bboxRight;
		this.bboxBottom = r.bboxBottom;
	};
	CollisionPoly_.prototype.cache_poly = function(w, h, a)
	{
		if (this.cache_width === w && this.cache_height === h && this.cache_angle === a)
			return;		// cache up-to-date
		this.cache_width = w;
		this.cache_height = h;
		this.cache_angle = a;
		var i, i2, i21, len, x, y;
		var sina = 0;
		var cosa = 1;
		var myptsarray = this.pts_array;
		var myptscache = this.pts_cache;
		if (a !== 0)
		{
			sina = Math.sin(a);
			cosa = Math.cos(a);
		}
		for (i = 0, len = this.pts_count; i < len; i++)
		{
			i2 = i*2;
			i21 = i2+1;
			x = myptsarray[i2] * w;
			y = myptsarray[i21] * h;
			myptscache[i2] = (x * cosa) - (y * sina);
			myptscache[i21] = (y * cosa) + (x * sina);
		}
		this.update_bbox();
	};
	CollisionPoly_.prototype.contains_pt = function (a2x, a2y)
	{
		var myptscache = this.pts_cache;
		if (a2x === myptscache[0] && a2y === myptscache[1])
			return true;
		var i, i2, imod, len = this.pts_count;
		var a1x = this.bboxLeft - 110;
		var a1y = this.bboxTop - 101;
		var a3x = this.bboxRight + 131
		var a3y = this.bboxBottom + 120;
		var b1x, b1y, b2x, b2y;
		var count1 = 0, count2 = 0;
		for (i = 0; i < len; i++)
		{
			i2 = i*2;
			imod = ((i+1)%len)*2;
			b1x = myptscache[i2];
			b1y = myptscache[i2+1];
			b2x = myptscache[imod];
			b2y = myptscache[imod+1];
			if (cr.segments_intersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y))
				count1++;
			if (cr.segments_intersect(a3x, a3y, a2x, a2y, b1x, b1y, b2x, b2y))
				count2++;
		}
		return (count1 % 2 === 1) || (count2 % 2 === 1);
	};
	CollisionPoly_.prototype.intersects_poly = function (rhs, offx, offy)
	{
		var rhspts = rhs.pts_cache;
		var mypts = this.pts_cache;
		if (this.contains_pt(rhspts[0] + offx, rhspts[1] + offy))
			return true;
		if (rhs.contains_pt(mypts[0] - offx, mypts[1] - offy))
			return true;
		var i, i2, imod, leni, j, j2, jmod, lenj;
		var a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y;
		for (i = 0, leni = this.pts_count; i < leni; i++)
		{
			i2 = i*2;
			imod = ((i+1)%leni)*2;
			a1x = mypts[i2];
			a1y = mypts[i2+1];
			a2x = mypts[imod];
			a2y = mypts[imod+1];
			for (j = 0, lenj = rhs.pts_count; j < lenj; j++)
			{
				j2 = j*2;
				jmod = ((j+1)%lenj)*2;
				b1x = rhspts[j2] + offx;
				b1y = rhspts[j2+1] + offy;
				b2x = rhspts[jmod] + offx;
				b2y = rhspts[jmod+1] + offy;
				if (cr.segments_intersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y))
					return true;
			}
		}
		return false;
	};
	CollisionPoly_.prototype.intersects_segment = function (offx, offy, x1, y1, x2, y2)
	{
		var mypts = this.pts_cache;
		if (this.contains_pt(x1 - offx, y1 - offy))
			return true;
		var i, leni, i2, imod;
		var a1x, a1y, a2x, a2y;
		for (i = 0, leni = this.pts_count; i < leni; i++)
		{
			i2 = i*2;
			imod = ((i+1)%leni)*2;
			a1x = mypts[i2] + offx;
			a1y = mypts[i2+1] + offy;
			a2x = mypts[imod] + offx;
			a2y = mypts[imod+1] + offy;
			if (cr.segments_intersect(x1, y1, x2, y2, a1x, a1y, a2x, a2y))
				return true;
		}
		return false;
	};
	CollisionPoly_.prototype.mirror = function (px)
	{
		var i, leni, i2;
		for (i = 0, leni = this.pts_count; i < leni; ++i)
		{
			i2 = i*2;
			this.pts_cache[i2] = px * 2 - this.pts_cache[i2];
		}
	};
	CollisionPoly_.prototype.flip = function (py)
	{
		var i, leni, i21;
		for (i = 0, leni = this.pts_count; i < leni; ++i)
		{
			i21 = i*2+1;
			this.pts_cache[i21] = py * 2 - this.pts_cache[i21];
		}
	};
	CollisionPoly_.prototype.diag = function ()
	{
		var i, leni, i2, i21, temp;
		for (i = 0, leni = this.pts_count; i < leni; ++i)
		{
			i2 = i*2;
			i21 = i2+1;
			temp = this.pts_cache[i2];
			this.pts_cache[i2] = this.pts_cache[i21];
			this.pts_cache[i21] = temp;
		}
	};
	cr.CollisionPoly = CollisionPoly_;
	function SparseGrid_(cellwidth_, cellheight_)
	{
		this.cellwidth = cellwidth_;
		this.cellheight = cellheight_;
		this.cells = {};
	};
	SparseGrid_.prototype.totalCellCount = 0;
	SparseGrid_.prototype.getCell = function (x_, y_, create_if_missing)
	{
		var ret;
		var col = this.cells[x_];
		if (!col)
		{
			if (create_if_missing)
			{
				ret = allocGridCell(this, x_, y_);
				this.cells[x_] = {};
				this.cells[x_][y_] = ret;
				return ret;
			}
			else
				return null;
		}
		ret = col[y_];
		if (ret)
			return ret;
		else if (create_if_missing)
		{
			ret = allocGridCell(this, x_, y_);
			this.cells[x_][y_] = ret;
			return ret;
		}
		else
			return null;
	};
	SparseGrid_.prototype.XToCell = function (x_)
	{
		return cr.floor(x_ / this.cellwidth);
	};
	SparseGrid_.prototype.YToCell = function (y_)
	{
		return cr.floor(y_ / this.cellheight);
	};
	SparseGrid_.prototype.update = function (inst, oldrange, newrange)
	{
		var x, lenx, y, leny, cell;
		if (oldrange)
		{
			for (x = oldrange.left, lenx = oldrange.right; x <= lenx; ++x)
			{
				for (y = oldrange.top, leny = oldrange.bottom; y <= leny; ++y)
				{
					if (newrange && newrange.contains_pt(x, y))
						continue;	// is still in this cell
					cell = this.getCell(x, y, false);	// don't create if missing
					if (!cell)
						continue;	// cell does not exist yet
					cell.remove(inst);
					if (cell.isEmpty())
					{
						freeGridCell(cell);
						this.cells[x][y] = null;
					}
				}
			}
		}
		if (newrange)
		{
			for (x = newrange.left, lenx = newrange.right; x <= lenx; ++x)
			{
				for (y = newrange.top, leny = newrange.bottom; y <= leny; ++y)
				{
					if (oldrange && oldrange.contains_pt(x, y))
						continue;	// is still in this cell
					this.getCell(x, y, true).insert(inst);
				}
			}
		}
	};
	SparseGrid_.prototype.queryRange = function (rc, result)
	{
		var x, lenx, ystart, y, leny, cell;
		x = this.XToCell(rc.left);
		ystart = this.YToCell(rc.top);
		lenx = this.XToCell(rc.right);
		leny = this.YToCell(rc.bottom);
		for ( ; x <= lenx; ++x)
		{
			for (y = ystart; y <= leny; ++y)
			{
				cell = this.getCell(x, y, false);
				if (!cell)
					continue;
				cell.dump(result);
			}
		}
	};
	cr.SparseGrid = SparseGrid_;
	function RenderGrid_(cellwidth_, cellheight_)
	{
		this.cellwidth = cellwidth_;
		this.cellheight = cellheight_;
		this.cells = {};
	};
	RenderGrid_.prototype.totalCellCount = 0;
	RenderGrid_.prototype.getCell = function (x_, y_, create_if_missing)
	{
		var ret;
		var col = this.cells[x_];
		if (!col)
		{
			if (create_if_missing)
			{
				ret = allocRenderCell(this, x_, y_);
				this.cells[x_] = {};
				this.cells[x_][y_] = ret;
				return ret;
			}
			else
				return null;
		}
		ret = col[y_];
		if (ret)
			return ret;
		else if (create_if_missing)
		{
			ret = allocRenderCell(this, x_, y_);
			this.cells[x_][y_] = ret;
			return ret;
		}
		else
			return null;
	};
	RenderGrid_.prototype.XToCell = function (x_)
	{
		return cr.floor(x_ / this.cellwidth);
	};
	RenderGrid_.prototype.YToCell = function (y_)
	{
		return cr.floor(y_ / this.cellheight);
	};
	RenderGrid_.prototype.update = function (inst, oldrange, newrange)
	{
		var x, lenx, y, leny, cell;
		if (oldrange)
		{
			for (x = oldrange.left, lenx = oldrange.right; x <= lenx; ++x)
			{
				for (y = oldrange.top, leny = oldrange.bottom; y <= leny; ++y)
				{
					if (newrange && newrange.contains_pt(x, y))
						continue;	// is still in this cell
					cell = this.getCell(x, y, false);	// don't create if missing
					if (!cell)
						continue;	// cell does not exist yet
					cell.remove(inst);
					if (cell.isEmpty())
					{
						freeRenderCell(cell);
						this.cells[x][y] = null;
					}
				}
			}
		}
		if (newrange)
		{
			for (x = newrange.left, lenx = newrange.right; x <= lenx; ++x)
			{
				for (y = newrange.top, leny = newrange.bottom; y <= leny; ++y)
				{
					if (oldrange && oldrange.contains_pt(x, y))
						continue;	// is still in this cell
					this.getCell(x, y, true).insert(inst);
				}
			}
		}
	};
	RenderGrid_.prototype.queryRange = function (left, top, right, bottom, result)
	{
		var x, lenx, ystart, y, leny, cell;
		x = this.XToCell(left);
		ystart = this.YToCell(top);
		lenx = this.XToCell(right);
		leny = this.YToCell(bottom);
		for ( ; x <= lenx; ++x)
		{
			for (y = ystart; y <= leny; ++y)
			{
				cell = this.getCell(x, y, false);
				if (!cell)
					continue;
				cell.dump(result);
			}
		}
	};
	RenderGrid_.prototype.markRangeChanged = function (rc)
	{
		var x, lenx, ystart, y, leny, cell;
		x = rc.left;
		ystart = rc.top;
		lenx = rc.right;
		leny = rc.bottom;
		for ( ; x <= lenx; ++x)
		{
			for (y = ystart; y <= leny; ++y)
			{
				cell = this.getCell(x, y, false);
				if (!cell)
					continue;
				cell.is_sorted = false;
			}
		}
	};
	cr.RenderGrid = RenderGrid_;
	var gridcellcache = [];
	function allocGridCell(grid_, x_, y_)
	{
		var ret;
		SparseGrid_.prototype.totalCellCount++;
		if (gridcellcache.length)
		{
			ret = gridcellcache.pop();
			ret.grid = grid_;
			ret.x = x_;
			ret.y = y_;
			return ret;
		}
		else
			return new cr.GridCell(grid_, x_, y_);
	};
	function freeGridCell(c)
	{
		SparseGrid_.prototype.totalCellCount--;
		c.objects.clear();
		if (gridcellcache.length < 1000)
			gridcellcache.push(c);
	};
	function GridCell_(grid_, x_, y_)
	{
		this.grid = grid_;
		this.x = x_;
		this.y = y_;
		this.objects = new cr.ObjectSet();
	};
	GridCell_.prototype.isEmpty = function ()
	{
		return this.objects.isEmpty();
	};
	GridCell_.prototype.insert = function (inst)
	{
		this.objects.add(inst);
	};
	GridCell_.prototype.remove = function (inst)
	{
		this.objects.remove(inst);
	};
	GridCell_.prototype.dump = function (result)
	{
		cr.appendArray(result, this.objects.valuesRef());
	};
	cr.GridCell = GridCell_;
	var rendercellcache = [];
	function allocRenderCell(grid_, x_, y_)
	{
		var ret;
		RenderGrid_.prototype.totalCellCount++;
		if (rendercellcache.length)
		{
			ret = rendercellcache.pop();
			ret.grid = grid_;
			ret.x = x_;
			ret.y = y_;
			return ret;
		}
		else
			return new cr.RenderCell(grid_, x_, y_);
	};
	function freeRenderCell(c)
	{
		RenderGrid_.prototype.totalCellCount--;
		c.reset();
		if (rendercellcache.length < 1000)
			rendercellcache.push(c);
	};
	function RenderCell_(grid_, x_, y_)
	{
		this.grid = grid_;
		this.x = x_;
		this.y = y_;
		this.objects = [];		// array which needs to be sorted by Z order
		this.is_sorted = true;	// whether array is in correct sort order or not
		this.pending_removal = new cr.ObjectSet();
		this.any_pending_removal = false;
	};
	RenderCell_.prototype.isEmpty = function ()
	{
		if (!this.objects.length)
		{
;
;
			return true;
		}
		if (this.objects.length > this.pending_removal.count())
			return false;
;
		this.flush_pending();		// takes fast path and just resets state
		return true;
	};
	RenderCell_.prototype.insert = function (inst)
	{
		if (this.pending_removal.contains(inst))
		{
			this.pending_removal.remove(inst);
			if (this.pending_removal.isEmpty())
				this.any_pending_removal = false;
			return;
		}
		if (this.objects.length)
		{
			var top = this.objects[this.objects.length - 1];
			if (top.get_zindex() > inst.get_zindex())
				this.is_sorted = false;		// 'inst' should be somewhere beneath 'top'
			this.objects.push(inst);
		}
		else
		{
			this.objects.push(inst);
			this.is_sorted = true;
		}
;
	};
	RenderCell_.prototype.remove = function (inst)
	{
		this.pending_removal.add(inst);
		this.any_pending_removal = true;
		if (this.pending_removal.count() >= 30)
			this.flush_pending();
	};
	RenderCell_.prototype.flush_pending = function ()
	{
;
		if (!this.any_pending_removal)
			return;		// not changed
		if (this.pending_removal.count() === this.objects.length)
		{
			this.reset();
			return;
		}
		cr.arrayRemoveAllFromObjectSet(this.objects, this.pending_removal);
		this.pending_removal.clear();
		this.any_pending_removal = false;
	};
	function sortByInstanceZIndex(a, b)
	{
		return a.zindex - b.zindex;
	};
	RenderCell_.prototype.ensure_sorted = function ()
	{
		if (this.is_sorted)
			return;		// already sorted
		this.objects.sort(sortByInstanceZIndex);
		this.is_sorted = true;
	};
	RenderCell_.prototype.reset = function ()
	{
		cr.clearArray(this.objects);
		this.is_sorted = true;
		this.pending_removal.clear();
		this.any_pending_removal = false;
	};
	RenderCell_.prototype.dump = function (result)
	{
		this.flush_pending();
		this.ensure_sorted();
		if (this.objects.length)
			result.push(this.objects);
	};
	cr.RenderCell = RenderCell_;
	var fxNames = [ "lighter",
					"xor",
					"copy",
					"destination-over",
					"source-in",
					"destination-in",
					"source-out",
					"destination-out",
					"source-atop",
					"destination-atop"];
	cr.effectToCompositeOp = function(effect)
	{
		if (effect <= 0 || effect >= 11)
			return "source-over";
		return fxNames[effect - 1];	// not including "none" so offset by 1
	};
	cr.setGLBlend = function(this_, effect, gl)
	{
		if (!gl)
			return;
		this_.srcBlend = gl.ONE;
		this_.destBlend = gl.ONE_MINUS_SRC_ALPHA;
		switch (effect) {
		case 1:		// lighter (additive)
			this_.srcBlend = gl.ONE;
			this_.destBlend = gl.ONE;
			break;
		case 2:		// xor
			break;	// todo
		case 3:		// copy
			this_.srcBlend = gl.ONE;
			this_.destBlend = gl.ZERO;
			break;
		case 4:		// destination-over
			this_.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this_.destBlend = gl.ONE;
			break;
		case 5:		// source-in
			this_.srcBlend = gl.DST_ALPHA;
			this_.destBlend = gl.ZERO;
			break;
		case 6:		// destination-in
			this_.srcBlend = gl.ZERO;
			this_.destBlend = gl.SRC_ALPHA;
			break;
		case 7:		// source-out
			this_.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this_.destBlend = gl.ZERO;
			break;
		case 8:		// destination-out
			this_.srcBlend = gl.ZERO;
			this_.destBlend = gl.ONE_MINUS_SRC_ALPHA;
			break;
		case 9:		// source-atop
			this_.srcBlend = gl.DST_ALPHA;
			this_.destBlend = gl.ONE_MINUS_SRC_ALPHA;
			break;
		case 10:	// destination-atop
			this_.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this_.destBlend = gl.SRC_ALPHA;
			break;
		}
	};
	cr.round6dp = function (x)
	{
		return Math.round(x * 1000000) / 1000000;
	};
	/*
	var localeCompare_options = {
		"usage": "search",
		"sensitivity": "accent"
	};
	var has_localeCompare = !!"a".localeCompare;
	var localeCompare_works1 = (has_localeCompare && "a".localeCompare("A", undefined, localeCompare_options) === 0);
	var localeCompare_works2 = (has_localeCompare && "a".localeCompare("á", undefined, localeCompare_options) !== 0);
	var supports_localeCompare = (has_localeCompare && localeCompare_works1 && localeCompare_works2);
	*/
	cr.equals_nocase = function (a, b)
	{
		if (typeof a !== "string" || typeof b !== "string")
			return false;
		if (a.length !== b.length)
			return false;
		if (a === b)
			return true;
		/*
		if (supports_localeCompare)
		{
			return (a.localeCompare(b, undefined, localeCompare_options) === 0);
		}
		else
		{
		*/
			return a.toLowerCase() === b.toLowerCase();
	};
	cr.isCanvasInputEvent = function (e)
	{
		var target = e.target;
		if (!target)
			return true;
		if (target === document || target === window)
			return true;
		if (document && document.body && target === document.body)
			return true;
		if (cr.equals_nocase(target.tagName, "canvas"))
			return true;
		return false;
	};
}());
var MatrixArray=typeof Float32Array!=="undefined"?Float32Array:Array,glMatrixArrayType=MatrixArray,vec3={},mat3={},mat4={},quat4={};vec3.create=function(a){var b=new MatrixArray(3);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2]);return b};vec3.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];return b};vec3.add=function(a,b,c){if(!c||a===c)return a[0]+=b[0],a[1]+=b[1],a[2]+=b[2],a;c[0]=a[0]+b[0];c[1]=a[1]+b[1];c[2]=a[2]+b[2];return c};
vec3.subtract=function(a,b,c){if(!c||a===c)return a[0]-=b[0],a[1]-=b[1],a[2]-=b[2],a;c[0]=a[0]-b[0];c[1]=a[1]-b[1];c[2]=a[2]-b[2];return c};vec3.negate=function(a,b){b||(b=a);b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];return b};vec3.scale=function(a,b,c){if(!c||a===c)return a[0]*=b,a[1]*=b,a[2]*=b,a;c[0]=a[0]*b;c[1]=a[1]*b;c[2]=a[2]*b;return c};
vec3.normalize=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=Math.sqrt(c*c+d*d+e*e);if(g){if(g===1)return b[0]=c,b[1]=d,b[2]=e,b}else return b[0]=0,b[1]=0,b[2]=0,b;g=1/g;b[0]=c*g;b[1]=d*g;b[2]=e*g;return b};vec3.cross=function(a,b,c){c||(c=a);var d=a[0],e=a[1],a=a[2],g=b[0],f=b[1],b=b[2];c[0]=e*b-a*f;c[1]=a*g-d*b;c[2]=d*f-e*g;return c};vec3.length=function(a){var b=a[0],c=a[1],a=a[2];return Math.sqrt(b*b+c*c+a*a)};vec3.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]};
vec3.direction=function(a,b,c){c||(c=a);var d=a[0]-b[0],e=a[1]-b[1],a=a[2]-b[2],b=Math.sqrt(d*d+e*e+a*a);if(!b)return c[0]=0,c[1]=0,c[2]=0,c;b=1/b;c[0]=d*b;c[1]=e*b;c[2]=a*b;return c};vec3.lerp=function(a,b,c,d){d||(d=a);d[0]=a[0]+c*(b[0]-a[0]);d[1]=a[1]+c*(b[1]-a[1]);d[2]=a[2]+c*(b[2]-a[2]);return d};vec3.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+"]"};
mat3.create=function(a){var b=new MatrixArray(9);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8]);return b};mat3.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];return b};mat3.identity=function(a){a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=1;a[5]=0;a[6]=0;a[7]=0;a[8]=1;return a};
mat3.transpose=function(a,b){if(!b||a===b){var c=a[1],d=a[2],e=a[5];a[1]=a[3];a[2]=a[6];a[3]=c;a[5]=a[7];a[6]=d;a[7]=e;return a}b[0]=a[0];b[1]=a[3];b[2]=a[6];b[3]=a[1];b[4]=a[4];b[5]=a[7];b[6]=a[2];b[7]=a[5];b[8]=a[8];return b};mat3.toMat4=function(a,b){b||(b=mat4.create());b[15]=1;b[14]=0;b[13]=0;b[12]=0;b[11]=0;b[10]=a[8];b[9]=a[7];b[8]=a[6];b[7]=0;b[6]=a[5];b[5]=a[4];b[4]=a[3];b[3]=0;b[2]=a[2];b[1]=a[1];b[0]=a[0];return b};
mat3.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+"]"};mat4.create=function(a){var b=new MatrixArray(16);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8],b[9]=a[9],b[10]=a[10],b[11]=a[11],b[12]=a[12],b[13]=a[13],b[14]=a[14],b[15]=a[15]);return b};
mat4.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=a[12];b[13]=a[13];b[14]=a[14];b[15]=a[15];return b};mat4.identity=function(a){a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=0;a[5]=1;a[6]=0;a[7]=0;a[8]=0;a[9]=0;a[10]=1;a[11]=0;a[12]=0;a[13]=0;a[14]=0;a[15]=1;return a};
mat4.transpose=function(a,b){if(!b||a===b){var c=a[1],d=a[2],e=a[3],g=a[6],f=a[7],h=a[11];a[1]=a[4];a[2]=a[8];a[3]=a[12];a[4]=c;a[6]=a[9];a[7]=a[13];a[8]=d;a[9]=g;a[11]=a[14];a[12]=e;a[13]=f;a[14]=h;return a}b[0]=a[0];b[1]=a[4];b[2]=a[8];b[3]=a[12];b[4]=a[1];b[5]=a[5];b[6]=a[9];b[7]=a[13];b[8]=a[2];b[9]=a[6];b[10]=a[10];b[11]=a[14];b[12]=a[3];b[13]=a[7];b[14]=a[11];b[15]=a[15];return b};
mat4.determinant=function(a){var b=a[0],c=a[1],d=a[2],e=a[3],g=a[4],f=a[5],h=a[6],i=a[7],j=a[8],k=a[9],l=a[10],n=a[11],o=a[12],m=a[13],p=a[14],a=a[15];return o*k*h*e-j*m*h*e-o*f*l*e+g*m*l*e+j*f*p*e-g*k*p*e-o*k*d*i+j*m*d*i+o*c*l*i-b*m*l*i-j*c*p*i+b*k*p*i+o*f*d*n-g*m*d*n-o*c*h*n+b*m*h*n+g*c*p*n-b*f*p*n-j*f*d*a+g*k*d*a+j*c*h*a-b*k*h*a-g*c*l*a+b*f*l*a};
mat4.inverse=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=a[4],h=a[5],i=a[6],j=a[7],k=a[8],l=a[9],n=a[10],o=a[11],m=a[12],p=a[13],r=a[14],s=a[15],A=c*h-d*f,B=c*i-e*f,t=c*j-g*f,u=d*i-e*h,v=d*j-g*h,w=e*j-g*i,x=k*p-l*m,y=k*r-n*m,z=k*s-o*m,C=l*r-n*p,D=l*s-o*p,E=n*s-o*r,q=1/(A*E-B*D+t*C+u*z-v*y+w*x);b[0]=(h*E-i*D+j*C)*q;b[1]=(-d*E+e*D-g*C)*q;b[2]=(p*w-r*v+s*u)*q;b[3]=(-l*w+n*v-o*u)*q;b[4]=(-f*E+i*z-j*y)*q;b[5]=(c*E-e*z+g*y)*q;b[6]=(-m*w+r*t-s*B)*q;b[7]=(k*w-n*t+o*B)*q;b[8]=(f*D-h*z+j*x)*q;
b[9]=(-c*D+d*z-g*x)*q;b[10]=(m*v-p*t+s*A)*q;b[11]=(-k*v+l*t-o*A)*q;b[12]=(-f*C+h*y-i*x)*q;b[13]=(c*C-d*y+e*x)*q;b[14]=(-m*u+p*B-r*A)*q;b[15]=(k*u-l*B+n*A)*q;return b};mat4.toRotationMat=function(a,b){b||(b=mat4.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};
mat4.toMat3=function(a,b){b||(b=mat3.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[4];b[4]=a[5];b[5]=a[6];b[6]=a[8];b[7]=a[9];b[8]=a[10];return b};mat4.toInverseMat3=function(a,b){var c=a[0],d=a[1],e=a[2],g=a[4],f=a[5],h=a[6],i=a[8],j=a[9],k=a[10],l=k*f-h*j,n=-k*g+h*i,o=j*g-f*i,m=c*l+d*n+e*o;if(!m)return null;m=1/m;b||(b=mat3.create());b[0]=l*m;b[1]=(-k*d+e*j)*m;b[2]=(h*d-e*f)*m;b[3]=n*m;b[4]=(k*c-e*i)*m;b[5]=(-h*c+e*g)*m;b[6]=o*m;b[7]=(-j*c+d*i)*m;b[8]=(f*c-d*g)*m;return b};
mat4.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],f=a[3],h=a[4],i=a[5],j=a[6],k=a[7],l=a[8],n=a[9],o=a[10],m=a[11],p=a[12],r=a[13],s=a[14],a=a[15],A=b[0],B=b[1],t=b[2],u=b[3],v=b[4],w=b[5],x=b[6],y=b[7],z=b[8],C=b[9],D=b[10],E=b[11],q=b[12],F=b[13],G=b[14],b=b[15];c[0]=A*d+B*h+t*l+u*p;c[1]=A*e+B*i+t*n+u*r;c[2]=A*g+B*j+t*o+u*s;c[3]=A*f+B*k+t*m+u*a;c[4]=v*d+w*h+x*l+y*p;c[5]=v*e+w*i+x*n+y*r;c[6]=v*g+w*j+x*o+y*s;c[7]=v*f+w*k+x*m+y*a;c[8]=z*d+C*h+D*l+E*p;c[9]=z*e+C*i+D*n+E*r;c[10]=z*g+C*
j+D*o+E*s;c[11]=z*f+C*k+D*m+E*a;c[12]=q*d+F*h+G*l+b*p;c[13]=q*e+F*i+G*n+b*r;c[14]=q*g+F*j+G*o+b*s;c[15]=q*f+F*k+G*m+b*a;return c};mat4.multiplyVec3=function(a,b,c){c||(c=b);var d=b[0],e=b[1],b=b[2];c[0]=a[0]*d+a[4]*e+a[8]*b+a[12];c[1]=a[1]*d+a[5]*e+a[9]*b+a[13];c[2]=a[2]*d+a[6]*e+a[10]*b+a[14];return c};
mat4.multiplyVec4=function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2],b=b[3];c[0]=a[0]*d+a[4]*e+a[8]*g+a[12]*b;c[1]=a[1]*d+a[5]*e+a[9]*g+a[13]*b;c[2]=a[2]*d+a[6]*e+a[10]*g+a[14]*b;c[3]=a[3]*d+a[7]*e+a[11]*g+a[15]*b;return c};
mat4.translate=function(a,b,c){var d=b[0],e=b[1],b=b[2],g,f,h,i,j,k,l,n,o,m,p,r;if(!c||a===c)return a[12]=a[0]*d+a[4]*e+a[8]*b+a[12],a[13]=a[1]*d+a[5]*e+a[9]*b+a[13],a[14]=a[2]*d+a[6]*e+a[10]*b+a[14],a[15]=a[3]*d+a[7]*e+a[11]*b+a[15],a;g=a[0];f=a[1];h=a[2];i=a[3];j=a[4];k=a[5];l=a[6];n=a[7];o=a[8];m=a[9];p=a[10];r=a[11];c[0]=g;c[1]=f;c[2]=h;c[3]=i;c[4]=j;c[5]=k;c[6]=l;c[7]=n;c[8]=o;c[9]=m;c[10]=p;c[11]=r;c[12]=g*d+j*e+o*b+a[12];c[13]=f*d+k*e+m*b+a[13];c[14]=h*d+l*e+p*b+a[14];c[15]=i*d+n*e+r*b+a[15];
return c};mat4.scale=function(a,b,c){var d=b[0],e=b[1],b=b[2];if(!c||a===c)return a[0]*=d,a[1]*=d,a[2]*=d,a[3]*=d,a[4]*=e,a[5]*=e,a[6]*=e,a[7]*=e,a[8]*=b,a[9]*=b,a[10]*=b,a[11]*=b,a;c[0]=a[0]*d;c[1]=a[1]*d;c[2]=a[2]*d;c[3]=a[3]*d;c[4]=a[4]*e;c[5]=a[5]*e;c[6]=a[6]*e;c[7]=a[7]*e;c[8]=a[8]*b;c[9]=a[9]*b;c[10]=a[10]*b;c[11]=a[11]*b;c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15];return c};
mat4.rotate=function(a,b,c,d){var e=c[0],g=c[1],c=c[2],f=Math.sqrt(e*e+g*g+c*c),h,i,j,k,l,n,o,m,p,r,s,A,B,t,u,v,w,x,y,z;if(!f)return null;f!==1&&(f=1/f,e*=f,g*=f,c*=f);h=Math.sin(b);i=Math.cos(b);j=1-i;b=a[0];f=a[1];k=a[2];l=a[3];n=a[4];o=a[5];m=a[6];p=a[7];r=a[8];s=a[9];A=a[10];B=a[11];t=e*e*j+i;u=g*e*j+c*h;v=c*e*j-g*h;w=e*g*j-c*h;x=g*g*j+i;y=c*g*j+e*h;z=e*c*j+g*h;e=g*c*j-e*h;g=c*c*j+i;d?a!==d&&(d[12]=a[12],d[13]=a[13],d[14]=a[14],d[15]=a[15]):d=a;d[0]=b*t+n*u+r*v;d[1]=f*t+o*u+s*v;d[2]=k*t+m*u+A*
v;d[3]=l*t+p*u+B*v;d[4]=b*w+n*x+r*y;d[5]=f*w+o*x+s*y;d[6]=k*w+m*x+A*y;d[7]=l*w+p*x+B*y;d[8]=b*z+n*e+r*g;d[9]=f*z+o*e+s*g;d[10]=k*z+m*e+A*g;d[11]=l*z+p*e+B*g;return d};mat4.rotateX=function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[4],g=a[5],f=a[6],h=a[7],i=a[8],j=a[9],k=a[10],l=a[11];c?a!==c&&(c[0]=a[0],c[1]=a[1],c[2]=a[2],c[3]=a[3],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[4]=e*b+i*d;c[5]=g*b+j*d;c[6]=f*b+k*d;c[7]=h*b+l*d;c[8]=e*-d+i*b;c[9]=g*-d+j*b;c[10]=f*-d+k*b;c[11]=h*-d+l*b;return c};
mat4.rotateY=function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[0],g=a[1],f=a[2],h=a[3],i=a[8],j=a[9],k=a[10],l=a[11];c?a!==c&&(c[4]=a[4],c[5]=a[5],c[6]=a[6],c[7]=a[7],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[0]=e*b+i*-d;c[1]=g*b+j*-d;c[2]=f*b+k*-d;c[3]=h*b+l*-d;c[8]=e*d+i*b;c[9]=g*d+j*b;c[10]=f*d+k*b;c[11]=h*d+l*b;return c};
mat4.rotateZ=function(a,b,c){var d=Math.sin(b),b=Math.cos(b),e=a[0],g=a[1],f=a[2],h=a[3],i=a[4],j=a[5],k=a[6],l=a[7];c?a!==c&&(c[8]=a[8],c[9]=a[9],c[10]=a[10],c[11]=a[11],c[12]=a[12],c[13]=a[13],c[14]=a[14],c[15]=a[15]):c=a;c[0]=e*b+i*d;c[1]=g*b+j*d;c[2]=f*b+k*d;c[3]=h*b+l*d;c[4]=e*-d+i*b;c[5]=g*-d+j*b;c[6]=f*-d+k*b;c[7]=h*-d+l*b;return c};
mat4.frustum=function(a,b,c,d,e,g,f){f||(f=mat4.create());var h=b-a,i=d-c,j=g-e;f[0]=e*2/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=e*2/i;f[6]=0;f[7]=0;f[8]=(b+a)/h;f[9]=(d+c)/i;f[10]=-(g+e)/j;f[11]=-1;f[12]=0;f[13]=0;f[14]=-(g*e*2)/j;f[15]=0;return f};mat4.perspective=function(a,b,c,d,e){a=c*Math.tan(a*Math.PI/360);b*=a;return mat4.frustum(-b,b,-a,a,c,d,e)};
mat4.ortho=function(a,b,c,d,e,g,f){f||(f=mat4.create());var h=b-a,i=d-c,j=g-e;f[0]=2/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=2/i;f[6]=0;f[7]=0;f[8]=0;f[9]=0;f[10]=-2/j;f[11]=0;f[12]=-(a+b)/h;f[13]=-(d+c)/i;f[14]=-(g+e)/j;f[15]=1;return f};
mat4.lookAt=function(a,b,c,d){d||(d=mat4.create());var e,g,f,h,i,j,k,l,n=a[0],o=a[1],a=a[2];g=c[0];f=c[1];e=c[2];c=b[1];j=b[2];if(n===b[0]&&o===c&&a===j)return mat4.identity(d);c=n-b[0];j=o-b[1];k=a-b[2];l=1/Math.sqrt(c*c+j*j+k*k);c*=l;j*=l;k*=l;b=f*k-e*j;e=e*c-g*k;g=g*j-f*c;(l=Math.sqrt(b*b+e*e+g*g))?(l=1/l,b*=l,e*=l,g*=l):g=e=b=0;f=j*g-k*e;h=k*b-c*g;i=c*e-j*b;(l=Math.sqrt(f*f+h*h+i*i))?(l=1/l,f*=l,h*=l,i*=l):i=h=f=0;d[0]=b;d[1]=f;d[2]=c;d[3]=0;d[4]=e;d[5]=h;d[6]=j;d[7]=0;d[8]=g;d[9]=i;d[10]=k;d[11]=
0;d[12]=-(b*n+e*o+g*a);d[13]=-(f*n+h*o+i*a);d[14]=-(c*n+j*o+k*a);d[15]=1;return d};mat4.fromRotationTranslation=function(a,b,c){c||(c=mat4.create());var d=a[0],e=a[1],g=a[2],f=a[3],h=d+d,i=e+e,j=g+g,a=d*h,k=d*i;d*=j;var l=e*i;e*=j;g*=j;h*=f;i*=f;f*=j;c[0]=1-(l+g);c[1]=k+f;c[2]=d-i;c[3]=0;c[4]=k-f;c[5]=1-(a+g);c[6]=e+h;c[7]=0;c[8]=d+i;c[9]=e-h;c[10]=1-(a+l);c[11]=0;c[12]=b[0];c[13]=b[1];c[14]=b[2];c[15]=1;return c};
mat4.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+", "+a[9]+", "+a[10]+", "+a[11]+", "+a[12]+", "+a[13]+", "+a[14]+", "+a[15]+"]"};quat4.create=function(a){var b=new MatrixArray(4);a&&(b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3]);return b};quat4.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];return b};
quat4.calculateW=function(a,b){var c=a[0],d=a[1],e=a[2];if(!b||a===b)return a[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e)),a;b[0]=c;b[1]=d;b[2]=e;b[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e));return b};quat4.inverse=function(a,b){if(!b||a===b)return a[0]*=-1,a[1]*=-1,a[2]*=-1,a;b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];b[3]=a[3];return b};quat4.length=function(a){var b=a[0],c=a[1],d=a[2],a=a[3];return Math.sqrt(b*b+c*c+d*d+a*a)};
quat4.normalize=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=Math.sqrt(c*c+d*d+e*e+g*g);if(f===0)return b[0]=0,b[1]=0,b[2]=0,b[3]=0,b;f=1/f;b[0]=c*f;b[1]=d*f;b[2]=e*f;b[3]=g*f;return b};quat4.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],a=a[3],f=b[0],h=b[1],i=b[2],b=b[3];c[0]=d*b+a*f+e*i-g*h;c[1]=e*b+a*h+g*f-d*i;c[2]=g*b+a*i+d*h-e*f;c[3]=a*b-d*f-e*h-g*i;return c};
quat4.multiplyVec3=function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2],b=a[0],f=a[1],h=a[2],a=a[3],i=a*d+f*g-h*e,j=a*e+h*d-b*g,k=a*g+b*e-f*d,d=-b*d-f*e-h*g;c[0]=i*a+d*-b+j*-h-k*-f;c[1]=j*a+d*-f+k*-b-i*-h;c[2]=k*a+d*-h+i*-f-j*-b;return c};quat4.toMat3=function(a,b){b||(b=mat3.create());var c=a[0],d=a[1],e=a[2],g=a[3],f=c+c,h=d+d,i=e+e,j=c*f,k=c*h;c*=i;var l=d*h;d*=i;e*=i;f*=g;h*=g;g*=i;b[0]=1-(l+e);b[1]=k+g;b[2]=c-h;b[3]=k-g;b[4]=1-(j+e);b[5]=d+f;b[6]=c+h;b[7]=d-f;b[8]=1-(j+l);return b};
quat4.toMat4=function(a,b){b||(b=mat4.create());var c=a[0],d=a[1],e=a[2],g=a[3],f=c+c,h=d+d,i=e+e,j=c*f,k=c*h;c*=i;var l=d*h;d*=i;e*=i;f*=g;h*=g;g*=i;b[0]=1-(l+e);b[1]=k+g;b[2]=c-h;b[3]=0;b[4]=k-g;b[5]=1-(j+e);b[6]=d+f;b[7]=0;b[8]=c+h;b[9]=d-f;b[10]=1-(j+l);b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};
quat4.slerp=function(a,b,c,d){d||(d=a);var e=a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3],g,f;if(Math.abs(e)>=1)return d!==a&&(d[0]=a[0],d[1]=a[1],d[2]=a[2],d[3]=a[3]),d;g=Math.acos(e);f=Math.sqrt(1-e*e);if(Math.abs(f)<0.001)return d[0]=a[0]*0.5+b[0]*0.5,d[1]=a[1]*0.5+b[1]*0.5,d[2]=a[2]*0.5+b[2]*0.5,d[3]=a[3]*0.5+b[3]*0.5,d;e=Math.sin((1-c)*g)/f;c=Math.sin(c*g)/f;d[0]=a[0]*e+b[0]*c;d[1]=a[1]*e+b[1]*c;d[2]=a[2]*e+b[2]*c;d[3]=a[3]*e+b[3]*c;return d};
quat4.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+"]"};
(function()
{
	var MAX_VERTICES = 8000;						// equates to 2500 objects being drawn
	var MAX_INDICES = (MAX_VERTICES / 2) * 3;		// 6 indices for every 4 vertices
	var MAX_POINTS = 8000;
	var MULTI_BUFFERS = 4;							// cycle 4 buffers to try and avoid blocking
	var BATCH_NULL = 0;
	var BATCH_QUAD = 1;
	var BATCH_SETTEXTURE = 2;
	var BATCH_SETOPACITY = 3;
	var BATCH_SETBLEND = 4;
	var BATCH_UPDATEMODELVIEW = 5;
	var BATCH_RENDERTOTEXTURE = 6;
	var BATCH_CLEAR = 7;
	var BATCH_POINTS = 8;
	var BATCH_SETPROGRAM = 9;
	var BATCH_SETPROGRAMPARAMETERS = 10;
	var BATCH_SETTEXTURE1 = 11;
	var BATCH_SETCOLOR = 12;
	var BATCH_SETDEPTHTEST = 13;
	var BATCH_SETEARLYZMODE = 14;
	/*
	var lose_ext = null;
	window.lose_context = function ()
	{
		if (!lose_ext)
		{
			console.log("WEBGL_lose_context not supported");
			return;
		}
		lose_ext.loseContext();
	};
	window.restore_context = function ()
	{
		if (!lose_ext)
		{
			console.log("WEBGL_lose_context not supported");
			return;
		}
		lose_ext.restoreContext();
	};
	*/
	var tempMat4 = mat4.create();
	function GLWrap_(gl, isMobile, enableFrontToBack)
	{
		this.isIE = /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
		this.width = 0;		// not yet known, wait for call to setSize()
		this.height = 0;
		this.enableFrontToBack = !!enableFrontToBack;
		this.isEarlyZPass = false;
		this.isBatchInEarlyZPass = false;
		this.currentZ = 0;
		this.zNear = 1;
		this.zFar = 1000;
		this.zIncrement = ((this.zFar - this.zNear) / 32768);
		this.zA = this.zFar / (this.zFar - this.zNear);
		this.zB = this.zFar * this.zNear / (this.zNear - this.zFar);
		this.kzA = 65536 * this.zA;
		this.kzB = 65536 * this.zB;
		this.cam = vec3.create([0, 0, 100]);			// camera position
		this.look = vec3.create([0, 0, 0]);				// lookat position
		this.up = vec3.create([0, 1, 0]);				// up vector
		this.worldScale = vec3.create([1, 1, 1]);		// world scaling factor
		this.enable_mipmaps = true;
		this.matP = mat4.create();						// perspective matrix
		this.matMV = mat4.create();						// model view matrix
		this.lastMV = mat4.create();
		this.currentMV = mat4.create();
		this.gl = gl;
		this.initState();
	};
	GLWrap_.prototype.initState = function ()
	{
		var gl = this.gl;
		var i, len;
		this.lastOpacity = 1;
		this.lastTexture0 = null;			// last bound to TEXTURE0
		this.lastTexture1 = null;			// last bound to TEXTURE1
		this.currentOpacity = 1;
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		gl.disable(gl.CULL_FACE);
		gl.disable(gl.STENCIL_TEST);
		gl.disable(gl.DITHER);
		if (this.enableFrontToBack)
		{
			gl.enable(gl.DEPTH_TEST);
			gl.depthFunc(gl.LEQUAL);
		}
		else
		{
			gl.disable(gl.DEPTH_TEST);
		}
		this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
		this.lastSrcBlend = gl.ONE;
		this.lastDestBlend = gl.ONE_MINUS_SRC_ALPHA;
		this.vertexData = new Float32Array(MAX_VERTICES * (this.enableFrontToBack ? 3 : 2));
		this.texcoordData = new Float32Array(MAX_VERTICES * 2);
		this.pointData = new Float32Array(MAX_POINTS * 4);
		this.pointBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.pointBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.pointData.byteLength, gl.DYNAMIC_DRAW);
		this.vertexBuffers = new Array(MULTI_BUFFERS);
		this.texcoordBuffers = new Array(MULTI_BUFFERS);
		for (i = 0; i < MULTI_BUFFERS; i++)
		{
			this.vertexBuffers[i] = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffers[i]);
			gl.bufferData(gl.ARRAY_BUFFER, this.vertexData.byteLength, gl.DYNAMIC_DRAW);
			this.texcoordBuffers[i] = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffers[i]);
			gl.bufferData(gl.ARRAY_BUFFER, this.texcoordData.byteLength, gl.DYNAMIC_DRAW);
		}
		this.curBuffer = 0;
		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		var indexData = new Uint16Array(MAX_INDICES);
		i = 0, len = MAX_INDICES;
		var fv = 0;
		while (i < len)
		{
			indexData[i++] = fv;		// top left
			indexData[i++] = fv + 1;	// top right
			indexData[i++] = fv + 2;	// bottom right (first tri)
			indexData[i++] = fv;		// top left
			indexData[i++] = fv + 2;	// bottom right
			indexData[i++] = fv + 3;	// bottom left
			fv += 4;
		}
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
		this.vertexPtr = 0;
		this.texPtr = 0;
		this.pointPtr = 0;
		var fsSource, vsSource;
		this.shaderPrograms = [];
		fsSource = [
			"varying mediump vec2 vTex;",
			"uniform lowp float opacity;",
			"uniform lowp sampler2D samplerFront;",
			"void main(void) {",
			"	gl_FragColor = texture2D(samplerFront, vTex);",
			"	gl_FragColor *= opacity;",
			"}"
		].join("\n");
		if (this.enableFrontToBack)
		{
			vsSource = [
				"attribute highp vec3 aPos;",
				"attribute mediump vec2 aTex;",
				"varying mediump vec2 vTex;",
				"uniform highp mat4 matP;",
				"uniform highp mat4 matMV;",
				"void main(void) {",
				"	gl_Position = matP * matMV * vec4(aPos.x, aPos.y, aPos.z, 1.0);",
				"	vTex = aTex;",
				"}"
			].join("\n");
		}
		else
		{
			vsSource = [
				"attribute highp vec2 aPos;",
				"attribute mediump vec2 aTex;",
				"varying mediump vec2 vTex;",
				"uniform highp mat4 matP;",
				"uniform highp mat4 matMV;",
				"void main(void) {",
				"	gl_Position = matP * matMV * vec4(aPos.x, aPos.y, 0.0, 1.0);",
				"	vTex = aTex;",
				"}"
			].join("\n");
		}
		var shaderProg = this.createShaderProgram({src: fsSource}, vsSource, "<default>");
;
		this.shaderPrograms.push(shaderProg);		// Default shader is always shader 0
		fsSource = [
			"uniform mediump sampler2D samplerFront;",
			"varying lowp float opacity;",
			"void main(void) {",
			"	gl_FragColor = texture2D(samplerFront, gl_PointCoord);",
			"	gl_FragColor *= opacity;",
			"}"
		].join("\n");
		var pointVsSource = [
			"attribute vec4 aPos;",
			"varying float opacity;",
			"uniform mat4 matP;",
			"uniform mat4 matMV;",
			"void main(void) {",
			"	gl_Position = matP * matMV * vec4(aPos.x, aPos.y, 0.0, 1.0);",
			"	gl_PointSize = aPos.z;",
			"	opacity = aPos.w;",
			"}"
		].join("\n");
		shaderProg = this.createShaderProgram({src: fsSource}, pointVsSource, "<point>");
;
		this.shaderPrograms.push(shaderProg);		// Point shader is always shader 1
		fsSource = [
			"varying mediump vec2 vTex;",
			"uniform lowp sampler2D samplerFront;",
			"void main(void) {",
			"	if (texture2D(samplerFront, vTex).a < 1.0)",
			"		discard;",						// discarding non-opaque fragments
			"}"
		].join("\n");
		var shaderProg = this.createShaderProgram({src: fsSource}, vsSource, "<earlyz>");
;
		this.shaderPrograms.push(shaderProg);		// Early-Z shader is always shader 2
		fsSource = [
			"uniform lowp vec4 colorFill;",
			"void main(void) {",
			"	gl_FragColor = colorFill;",
			"}"
		].join("\n");
		var shaderProg = this.createShaderProgram({src: fsSource}, vsSource, "<fill>");
;
		this.shaderPrograms.push(shaderProg);		// Fill-color shader is always shader 3
		for (var shader_name in cr.shaders)
		{
			if (cr.shaders.hasOwnProperty(shader_name))
				this.shaderPrograms.push(this.createShaderProgram(cr.shaders[shader_name], vsSource, shader_name));
		}
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, null);
		this.batch = [];
		this.batchPtr = 0;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
		this.lastProgram = -1;				// start -1 so first switchProgram can do work
		this.currentProgram = -1;			// current program during batch execution
		this.currentShader = null;
		this.fbo = gl.createFramebuffer();
		this.renderToTex = null;
		this.depthBuffer = null;
		this.attachedDepthBuffer = false;	// wait until first size call to attach, otherwise it has no storage
		if (this.enableFrontToBack)
		{
			this.depthBuffer = gl.createRenderbuffer();
		}
		this.tmpVec3 = vec3.create([0, 0, 0]);
;
		var pointsizes = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);
		this.minPointSize = pointsizes[0];
		this.maxPointSize = pointsizes[1];
		if (this.maxPointSize > 2048)
			this.maxPointSize = 2048;
;
		this.switchProgram(0);
		cr.seal(this);
	};
	function GLShaderProgram(gl, shaderProgram, name)
	{
		this.gl = gl;
		this.shaderProgram = shaderProgram;
		this.name = name;
		this.locAPos = gl.getAttribLocation(shaderProgram, "aPos");
		this.locATex = gl.getAttribLocation(shaderProgram, "aTex");
		this.locMatP = gl.getUniformLocation(shaderProgram, "matP");
		this.locMatMV = gl.getUniformLocation(shaderProgram, "matMV");
		this.locOpacity = gl.getUniformLocation(shaderProgram, "opacity");
		this.locColorFill = gl.getUniformLocation(shaderProgram, "colorFill");
		this.locSamplerFront = gl.getUniformLocation(shaderProgram, "samplerFront");
		this.locSamplerBack = gl.getUniformLocation(shaderProgram, "samplerBack");
		this.locDestStart = gl.getUniformLocation(shaderProgram, "destStart");
		this.locDestEnd = gl.getUniformLocation(shaderProgram, "destEnd");
		this.locSeconds = gl.getUniformLocation(shaderProgram, "seconds");
		this.locPixelWidth = gl.getUniformLocation(shaderProgram, "pixelWidth");
		this.locPixelHeight = gl.getUniformLocation(shaderProgram, "pixelHeight");
		this.locLayerScale = gl.getUniformLocation(shaderProgram, "layerScale");
		this.locLayerAngle = gl.getUniformLocation(shaderProgram, "layerAngle");
		this.locViewOrigin = gl.getUniformLocation(shaderProgram, "viewOrigin");
		this.locScrollPos = gl.getUniformLocation(shaderProgram, "scrollPos");
		this.hasAnyOptionalUniforms = !!(this.locPixelWidth || this.locPixelHeight || this.locSeconds || this.locSamplerBack || this.locDestStart || this.locDestEnd || this.locLayerScale || this.locLayerAngle || this.locViewOrigin || this.locScrollPos);
		this.lpPixelWidth = -999;		// set to something unlikely so never counts as cached on first set
		this.lpPixelHeight = -999;
		this.lpOpacity = 1;
		this.lpDestStartX = 0.0;
		this.lpDestStartY = 0.0;
		this.lpDestEndX = 1.0;
		this.lpDestEndY = 1.0;
		this.lpLayerScale = 1.0;
		this.lpLayerAngle = 0.0;
		this.lpViewOriginX = 0.0;
		this.lpViewOriginY = 0.0;
		this.lpScrollPosX = 0.0;
		this.lpScrollPosY = 0.0;
		this.lpSeconds = 0.0;
		this.lastCustomParams = [];
		this.lpMatMV = mat4.create();
		if (this.locOpacity)
			gl.uniform1f(this.locOpacity, 1);
		if (this.locColorFill)
			gl.uniform4f(this.locColorFill, 1.0, 1.0, 1.0, 1.0);
		if (this.locSamplerFront)
			gl.uniform1i(this.locSamplerFront, 0);
		if (this.locSamplerBack)
			gl.uniform1i(this.locSamplerBack, 1);
		if (this.locDestStart)
			gl.uniform2f(this.locDestStart, 0.0, 0.0);
		if (this.locDestEnd)
			gl.uniform2f(this.locDestEnd, 1.0, 1.0);
		if (this.locLayerScale)
			gl.uniform1f(this.locLayerScale, 1.0);
		if (this.locLayerAngle)
			gl.uniform1f(this.locLayerAngle, 0.0);
		if (this.locViewOrigin)
			gl.uniform2f(this.locViewOrigin, 0.0, 0.0);
		if (this.locScrollPos)
			gl.uniform2f(this.locScrollPos, 0.0, 0.0);
		if (this.locSeconds)
			gl.uniform1f(this.locSeconds, 0.0);
		this.hasCurrentMatMV = false;		// matMV needs updating
	};
	function areMat4sEqual(a, b)
	{
		return a[0]===b[0]&&a[1]===b[1]&&a[2]===b[2]&&a[3]===b[3]&&
			   a[4]===b[4]&&a[5]===b[5]&&a[6]===b[6]&&a[7]===b[7]&&
			   a[8]===b[8]&&a[9]===b[9]&&a[10]===b[10]&&a[11]===b[11]&&
			   a[12]===b[12]&&a[13]===b[13]&&a[14]===b[14]&&a[15]===b[15];
	};
	GLShaderProgram.prototype.updateMatMV = function (mv)
	{
		if (areMat4sEqual(this.lpMatMV, mv))
			return;		// no change, save the expensive GL call
		mat4.set(mv, this.lpMatMV);
		this.gl.uniformMatrix4fv(this.locMatMV, false, mv);
	};
	GLWrap_.prototype.createShaderProgram = function(shaderEntry, vsSource, name)
	{
		var gl = this.gl;
		var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragmentShader, shaderEntry.src);
		gl.compileShader(fragmentShader);
		if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
		{
;
			gl.deleteShader(fragmentShader);
			return null;
		}
		var vertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertexShader, vsSource);
		gl.compileShader(vertexShader);
		if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
		{
;
			gl.deleteShader(fragmentShader);
			gl.deleteShader(vertexShader);
			return null;
		}
		var shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, fragmentShader);
		gl.attachShader(shaderProgram, vertexShader);
		gl.linkProgram(shaderProgram);
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
		{
;
			gl.deleteShader(fragmentShader);
			gl.deleteShader(vertexShader);
			gl.deleteProgram(shaderProgram);
			return null;
		}
		gl.useProgram(shaderProgram);
		gl.deleteShader(fragmentShader);
		gl.deleteShader(vertexShader);
		var ret = new GLShaderProgram(gl, shaderProgram, name);
		ret.extendBoxHorizontal = shaderEntry.extendBoxHorizontal || 0;
		ret.extendBoxVertical = shaderEntry.extendBoxVertical || 0;
		ret.crossSampling = !!shaderEntry.crossSampling;
		ret.preservesOpaqueness = !!shaderEntry.preservesOpaqueness;
		ret.animated = !!shaderEntry.animated;
		ret.parameters = shaderEntry.parameters || [];
		var i, len;
		for (i = 0, len = ret.parameters.length; i < len; i++)
		{
			ret.parameters[i][1] = gl.getUniformLocation(shaderProgram, ret.parameters[i][0]);
			ret.lastCustomParams.push(0);
			gl.uniform1f(ret.parameters[i][1], 0);
		}
		cr.seal(ret);
		return ret;
	};
	GLWrap_.prototype.getShaderIndex = function(name_)
	{
		var i, len;
		for (i = 0, len = this.shaderPrograms.length; i < len; i++)
		{
			if (this.shaderPrograms[i].name === name_)
				return i;
		}
		return -1;
	};
	GLWrap_.prototype.project = function (x, y, out)
	{
		var mv = this.matMV;
		var proj = this.matP;
		var fTempo = [0, 0, 0, 0, 0, 0, 0, 0];
		fTempo[0] = mv[0]*x+mv[4]*y+mv[12];
		fTempo[1] = mv[1]*x+mv[5]*y+mv[13];
		fTempo[2] = mv[2]*x+mv[6]*y+mv[14];
		fTempo[3] = mv[3]*x+mv[7]*y+mv[15];
		fTempo[4] = proj[0]*fTempo[0]+proj[4]*fTempo[1]+proj[8]*fTempo[2]+proj[12]*fTempo[3];
		fTempo[5] = proj[1]*fTempo[0]+proj[5]*fTempo[1]+proj[9]*fTempo[2]+proj[13]*fTempo[3];
		fTempo[6] = proj[2]*fTempo[0]+proj[6]*fTempo[1]+proj[10]*fTempo[2]+proj[14]*fTempo[3];
		fTempo[7] = -fTempo[2];
		if(fTempo[7]===0.0)	//The w value
			return;
		fTempo[7]=1.0/fTempo[7];
		fTempo[4]*=fTempo[7];
		fTempo[5]*=fTempo[7];
		fTempo[6]*=fTempo[7];
		out[0]=(fTempo[4]*0.5+0.5)*this.width;
		out[1]=(fTempo[5]*0.5+0.5)*this.height;
	};
	GLWrap_.prototype.setSize = function(w, h, force)
	{
		if (this.width === w && this.height === h && !force)
			return;
		this.endBatch();
		var gl = this.gl;
		this.width = w;
		this.height = h;
		gl.viewport(0, 0, w, h);
		mat4.lookAt(this.cam, this.look, this.up, this.matMV);
		if (this.enableFrontToBack)
		{
			mat4.ortho(-w/2, w/2, h/2, -h/2, this.zNear, this.zFar, this.matP);
			this.worldScale[0] = 1;
			this.worldScale[1] = 1;
		}
		else
		{
			mat4.perspective(45, w / h, this.zNear, this.zFar, this.matP);
			var tl = [0, 0];
			var br = [0, 0];
			this.project(0, 0, tl);
			this.project(1, 1, br);
			this.worldScale[0] = 1 / (br[0] - tl[0]);
			this.worldScale[1] = -1 / (br[1] - tl[1]);
		}
		var i, len, s;
		for (i = 0, len = this.shaderPrograms.length; i < len; i++)
		{
			s = this.shaderPrograms[i];
			s.hasCurrentMatMV = false;
			if (s.locMatP)
			{
				gl.useProgram(s.shaderProgram);
				gl.uniformMatrix4fv(s.locMatP, false, this.matP);
			}
		}
		gl.useProgram(this.shaderPrograms[this.lastProgram].shaderProgram);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.activeTexture(gl.TEXTURE0);
		this.lastTexture0 = null;
		this.lastTexture1 = null;
		if (this.depthBuffer)
		{
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
			gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
			if (!this.attachedDepthBuffer)
			{
				gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthBuffer);
				this.attachedDepthBuffer = true;
			}
			gl.bindRenderbuffer(gl.RENDERBUFFER, null);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			this.renderToTex = null;
		}
	};
	GLWrap_.prototype.resetModelView = function ()
	{
		mat4.lookAt(this.cam, this.look, this.up, this.matMV);
		mat4.scale(this.matMV, this.worldScale);
	};
	GLWrap_.prototype.translate = function (x, y)
	{
		if (x === 0 && y === 0)
			return;
		this.tmpVec3[0] = x;// * this.worldScale[0];
		this.tmpVec3[1] = y;// * this.worldScale[1];
		this.tmpVec3[2] = 0;
		mat4.translate(this.matMV, this.tmpVec3);
	};
	GLWrap_.prototype.scale = function (x, y)
	{
		if (x === 1 && y === 1)
			return;
		this.tmpVec3[0] = x;
		this.tmpVec3[1] = y;
		this.tmpVec3[2] = 1;
		mat4.scale(this.matMV, this.tmpVec3);
	};
	GLWrap_.prototype.rotateZ = function (a)
	{
		if (a === 0)
			return;
		mat4.rotateZ(this.matMV, a);
	};
	GLWrap_.prototype.updateModelView = function()
	{
		if (areMat4sEqual(this.lastMV, this.matMV))
			return;
		var b = this.pushBatch();
		b.type = BATCH_UPDATEMODELVIEW;
		if (b.mat4param)
			mat4.set(this.matMV, b.mat4param);
		else
			b.mat4param = mat4.create(this.matMV);
		mat4.set(this.matMV, this.lastMV);
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	/*
	var debugBatch = false;
	jQuery(document).mousedown(
		function(info) {
			if (info.which === 2)
				debugBatch = true;
		}
	);
	*/
	GLWrap_.prototype.setEarlyZIndex = function (i)
	{
		if (!this.enableFrontToBack)
			return;
		if (i > 32760)
			i = 32760;
		this.currentZ = this.cam[2] - this.zNear - i * this.zIncrement;
	};
	function GLBatchJob(type_, glwrap_)
	{
		this.type = type_;
		this.glwrap = glwrap_;
		this.gl = glwrap_.gl;
		this.opacityParam = 0;		// for setOpacity()
		this.startIndex = 0;		// for quad()
		this.indexCount = 0;		// "
		this.texParam = null;		// for setTexture()
		this.mat4param = null;		// for updateModelView()
		this.shaderParams = [];		// for user parameters
		cr.seal(this);
	};
	GLBatchJob.prototype.doSetEarlyZPass = function ()
	{
		var gl = this.gl;
		var glwrap = this.glwrap;
		if (this.startIndex !== 0)		// enable
		{
			gl.depthMask(true);			// enable depth writes
			gl.colorMask(false, false, false, false);	// disable color writes
			gl.disable(gl.BLEND);		// no color writes so disable blend
			gl.bindFramebuffer(gl.FRAMEBUFFER, glwrap.fbo);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
			gl.clear(gl.DEPTH_BUFFER_BIT);		// auto-clear depth buffer
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			glwrap.isBatchInEarlyZPass = true;
		}
		else
		{
			gl.depthMask(false);		// disable depth writes, only test existing depth values
			gl.colorMask(true, true, true, true);		// enable color writes
			gl.enable(gl.BLEND);		// turn blending back on
			glwrap.isBatchInEarlyZPass = false;
		}
	};
	GLBatchJob.prototype.doSetTexture = function ()
	{
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texParam);
	};
	GLBatchJob.prototype.doSetTexture1 = function ()
	{
		var gl = this.gl;
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.texParam);
		gl.activeTexture(gl.TEXTURE0);
	};
	GLBatchJob.prototype.doSetOpacity = function ()
	{
		var o = this.opacityParam;
		var glwrap = this.glwrap;
		glwrap.currentOpacity = o;
		var curProg = glwrap.currentShader;
		if (curProg.locOpacity && curProg.lpOpacity !== o)
		{
			curProg.lpOpacity = o;
			this.gl.uniform1f(curProg.locOpacity, o);
		}
	};
	GLBatchJob.prototype.doQuad = function ()
	{
		this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, this.startIndex);
	};
	GLBatchJob.prototype.doSetBlend = function ()
	{
		this.gl.blendFunc(this.startIndex, this.indexCount);
	};
	GLBatchJob.prototype.doUpdateModelView = function ()
	{
		var i, len, s, shaderPrograms = this.glwrap.shaderPrograms, currentProgram = this.glwrap.currentProgram;
		for (i = 0, len = shaderPrograms.length; i < len; i++)
		{
			s = shaderPrograms[i];
			if (i === currentProgram && s.locMatMV)
			{
				s.updateMatMV(this.mat4param);
				s.hasCurrentMatMV = true;
			}
			else
				s.hasCurrentMatMV = false;
		}
		mat4.set(this.mat4param, this.glwrap.currentMV);
	};
	GLBatchJob.prototype.doRenderToTexture = function ()
	{
		var gl = this.gl;
		var glwrap = this.glwrap;
		if (this.texParam)
		{
			if (glwrap.lastTexture1 === this.texParam)
			{
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, null);
				glwrap.lastTexture1 = null;
				gl.activeTexture(gl.TEXTURE0);
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, glwrap.fbo);
			if (!glwrap.isBatchInEarlyZPass)
			{
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texParam, 0);
			}
		}
		else
		{
			if (!glwrap.enableFrontToBack)
			{
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	};
	GLBatchJob.prototype.doClear = function ()
	{
		var gl = this.gl;
		var mode = this.startIndex;
		if (mode === 0)			// clear whole surface
		{
			gl.clearColor(this.mat4param[0], this.mat4param[1], this.mat4param[2], this.mat4param[3]);
			gl.clear(gl.COLOR_BUFFER_BIT);
		}
		else if (mode === 1)	// clear rectangle
		{
			gl.enable(gl.SCISSOR_TEST);
			gl.scissor(this.mat4param[0], this.mat4param[1], this.mat4param[2], this.mat4param[3]);
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.disable(gl.SCISSOR_TEST);
		}
		else					// clear depth
		{
			gl.clear(gl.DEPTH_BUFFER_BIT);
		}
	};
	GLBatchJob.prototype.doSetDepthTestEnabled = function ()
	{
		var gl = this.gl;
		var enable = this.startIndex;
		if (enable !== 0)
		{
			gl.enable(gl.DEPTH_TEST);
		}
		else
		{
			gl.disable(gl.DEPTH_TEST);
		}
	};
	GLBatchJob.prototype.doPoints = function ()
	{
		var gl = this.gl;
		var glwrap = this.glwrap;
		if (glwrap.enableFrontToBack)
			gl.disable(gl.DEPTH_TEST);
		var s = glwrap.shaderPrograms[1];
		gl.useProgram(s.shaderProgram);
		if (!s.hasCurrentMatMV && s.locMatMV)
		{
			s.updateMatMV(glwrap.currentMV);
			s.hasCurrentMatMV = true;
		}
		gl.enableVertexAttribArray(s.locAPos);
		gl.bindBuffer(gl.ARRAY_BUFFER, glwrap.pointBuffer);
		gl.vertexAttribPointer(s.locAPos, 4, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.POINTS, this.startIndex / 4, this.indexCount);
		s = glwrap.currentShader;
		gl.useProgram(s.shaderProgram);
		if (s.locAPos >= 0)
		{
			gl.enableVertexAttribArray(s.locAPos);
			gl.bindBuffer(gl.ARRAY_BUFFER, glwrap.vertexBuffers[glwrap.curBuffer]);
			gl.vertexAttribPointer(s.locAPos, glwrap.enableFrontToBack ? 3 : 2, gl.FLOAT, false, 0, 0);
		}
		if (s.locATex >= 0)
		{
			gl.enableVertexAttribArray(s.locATex);
			gl.bindBuffer(gl.ARRAY_BUFFER, glwrap.texcoordBuffers[glwrap.curBuffer]);
			gl.vertexAttribPointer(s.locATex, 2, gl.FLOAT, false, 0, 0);
		}
		if (glwrap.enableFrontToBack)
			gl.enable(gl.DEPTH_TEST);
	};
	GLBatchJob.prototype.doSetProgram = function ()
	{
		var gl = this.gl;
		var glwrap = this.glwrap;
		var s = glwrap.shaderPrograms[this.startIndex];		// recycled param to save memory
		glwrap.currentProgram = this.startIndex;			// current batch program
		glwrap.currentShader = s;
		gl.useProgram(s.shaderProgram);						// switch to
		if (!s.hasCurrentMatMV && s.locMatMV)
		{
			s.updateMatMV(glwrap.currentMV);
			s.hasCurrentMatMV = true;
		}
		if (s.locOpacity && s.lpOpacity !== glwrap.currentOpacity)
		{
			s.lpOpacity = glwrap.currentOpacity;
			gl.uniform1f(s.locOpacity, glwrap.currentOpacity);
		}
		if (s.locAPos >= 0)
		{
			gl.enableVertexAttribArray(s.locAPos);
			gl.bindBuffer(gl.ARRAY_BUFFER, glwrap.vertexBuffers[glwrap.curBuffer]);
			gl.vertexAttribPointer(s.locAPos, glwrap.enableFrontToBack ? 3 : 2, gl.FLOAT, false, 0, 0);
		}
		if (s.locATex >= 0)
		{
			gl.enableVertexAttribArray(s.locATex);
			gl.bindBuffer(gl.ARRAY_BUFFER, glwrap.texcoordBuffers[glwrap.curBuffer]);
			gl.vertexAttribPointer(s.locATex, 2, gl.FLOAT, false, 0, 0);
		}
	}
	GLBatchJob.prototype.doSetColor = function ()
	{
		var s = this.glwrap.currentShader;
		var mat4param = this.mat4param;
		this.gl.uniform4f(s.locColorFill, mat4param[0], mat4param[1], mat4param[2], mat4param[3]);
	};
	GLBatchJob.prototype.doSetProgramParameters = function ()
	{
		var i, len, s = this.glwrap.currentShader;
		var gl = this.gl;
		var mat4param = this.mat4param;
		if (s.locSamplerBack && this.glwrap.lastTexture1 !== this.texParam)
		{
			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, this.texParam);
			this.glwrap.lastTexture1 = this.texParam;
			gl.activeTexture(gl.TEXTURE0);
		}
		var v = mat4param[0];
		var v2;
		if (s.locPixelWidth && v !== s.lpPixelWidth)
		{
			s.lpPixelWidth = v;
			gl.uniform1f(s.locPixelWidth, v);
		}
		v = mat4param[1];
		if (s.locPixelHeight && v !== s.lpPixelHeight)
		{
			s.lpPixelHeight = v;
			gl.uniform1f(s.locPixelHeight, v);
		}
		v = mat4param[2];
		v2 = mat4param[3];
		if (s.locDestStart && (v !== s.lpDestStartX || v2 !== s.lpDestStartY))
		{
			s.lpDestStartX = v;
			s.lpDestStartY = v2;
			gl.uniform2f(s.locDestStart, v, v2);
		}
		v = mat4param[4];
		v2 = mat4param[5];
		if (s.locDestEnd && (v !== s.lpDestEndX || v2 !== s.lpDestEndY))
		{
			s.lpDestEndX = v;
			s.lpDestEndY = v2;
			gl.uniform2f(s.locDestEnd, v, v2);
		}
		v = mat4param[6];
		if (s.locLayerScale && v !== s.lpLayerScale)
		{
			s.lpLayerScale = v;
			gl.uniform1f(s.locLayerScale, v);
		}
		v = mat4param[7];
		if (s.locLayerAngle && v !== s.lpLayerAngle)
		{
			s.lpLayerAngle = v;
			gl.uniform1f(s.locLayerAngle, v);
		}
		v = mat4param[8];
		v2 = mat4param[9];
		if (s.locViewOrigin && (v !== s.lpViewOriginX || v2 !== s.lpViewOriginY))
		{
			s.lpViewOriginX = v;
			s.lpViewOriginY = v2;
			gl.uniform2f(s.locViewOrigin, v, v2);
		}
		v = mat4param[10];
		v2 = mat4param[11];
		if (s.locScrollPos && (v !== s.lpScrollPosX || v2 !== s.lpScrollPosY))
		{
			s.lpScrollPosX = v;
			s.lpScrollPosY = v2;
			gl.uniform2f(s.locScrollPos, v, v2);
		}
		v = mat4param[12];
		if (s.locSeconds && v !== s.lpSeconds)
		{
			s.lpSeconds = v;
			gl.uniform1f(s.locSeconds, v);
		}
		if (s.parameters.length)
		{
			for (i = 0, len = s.parameters.length; i < len; i++)
			{
				v = this.shaderParams[i];
				if (v !== s.lastCustomParams[i])
				{
					s.lastCustomParams[i] = v;
					gl.uniform1f(s.parameters[i][1], v);
				}
			}
		}
	};
	GLWrap_.prototype.pushBatch = function ()
	{
		if (this.batchPtr === this.batch.length)
			this.batch.push(new GLBatchJob(BATCH_NULL, this));
		return this.batch[this.batchPtr++];
	};
	GLWrap_.prototype.endBatch = function ()
	{
		if (this.batchPtr === 0)
			return;
		if (this.gl.isContextLost())
			return;
		var gl = this.gl;
		if (this.pointPtr > 0)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, this.pointBuffer);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.pointData.subarray(0, this.pointPtr));
			if (s && s.locAPos >= 0 && s.name === "<point>")
				gl.vertexAttribPointer(s.locAPos, 4, gl.FLOAT, false, 0, 0);
		}
		if (this.vertexPtr > 0)
		{
			var s = this.currentShader;
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffers[this.curBuffer]);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexData.subarray(0, this.vertexPtr));
			if (s && s.locAPos >= 0 && s.name !== "<point>")
				gl.vertexAttribPointer(s.locAPos, this.enableFrontToBack ? 3 : 2, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffers[this.curBuffer]);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.texcoordData.subarray(0, this.texPtr));
			if (s && s.locATex >= 0 && s.name !== "<point>")
				gl.vertexAttribPointer(s.locATex, 2, gl.FLOAT, false, 0, 0);
		}
		var i, len, b;
		for (i = 0, len = this.batchPtr; i < len; i++)
		{
			b = this.batch[i];
			switch (b.type) {
			case 1:
				b.doQuad();
				break;
			case 2:
				b.doSetTexture();
				break;
			case 3:
				b.doSetOpacity();
				break;
			case 4:
				b.doSetBlend();
				break;
			case 5:
				b.doUpdateModelView();
				break;
			case 6:
				b.doRenderToTexture();
				break;
			case 7:
				b.doClear();
				break;
			case 8:
				b.doPoints();
				break;
			case 9:
				b.doSetProgram();
				break;
			case 10:
				b.doSetProgramParameters();
				break;
			case 11:
				b.doSetTexture1();
				break;
			case 12:
				b.doSetColor();
				break;
			case 13:
				b.doSetDepthTestEnabled();
				break;
			case 14:
				b.doSetEarlyZPass();
				break;
			}
		}
		this.batchPtr = 0;
		this.vertexPtr = 0;
		this.texPtr = 0;
		this.pointPtr = 0;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
		this.isBatchInEarlyZPass = false;
		this.curBuffer++;
		if (this.curBuffer >= MULTI_BUFFERS)
			this.curBuffer = 0;
	};
	GLWrap_.prototype.setOpacity = function (op)
	{
		if (op === this.lastOpacity)
			return;
		if (this.isEarlyZPass)
			return;		// ignore
		var b = this.pushBatch();
		b.type = BATCH_SETOPACITY;
		b.opacityParam = op;
		this.lastOpacity = op;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.setTexture = function (tex)
	{
		if (tex === this.lastTexture0)
			return;
;
		var b = this.pushBatch();
		b.type = BATCH_SETTEXTURE;
		b.texParam = tex;
		this.lastTexture0 = tex;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.setBlend = function (s, d)
	{
		if (s === this.lastSrcBlend && d === this.lastDestBlend)
			return;
		if (this.isEarlyZPass)
			return;		// ignore
		var b = this.pushBatch();
		b.type = BATCH_SETBLEND;
		b.startIndex = s;		// recycle params to save memory
		b.indexCount = d;
		this.lastSrcBlend = s;
		this.lastDestBlend = d;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.isPremultipliedAlphaBlend = function ()
	{
		return (this.lastSrcBlend === this.gl.ONE && this.lastDestBlend === this.gl.ONE_MINUS_SRC_ALPHA);
	};
	GLWrap_.prototype.setAlphaBlend = function ()
	{
		this.setBlend(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
	};
	GLWrap_.prototype.setNoPremultiplyAlphaBlend = function ()
	{
		this.setBlend(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	};
	var LAST_VERTEX = MAX_VERTICES * 2 - 8;
	GLWrap_.prototype.quad = function(tlx, tly, trx, try_, brx, bry, blx, bly)
	{
		if (this.vertexPtr >= LAST_VERTEX)
			this.endBatch();
		var v = this.vertexPtr;			// vertex cursor
		var t = this.texPtr;
		var vd = this.vertexData;		// vertex data array
		var td = this.texcoordData;		// texture coord data array
		var currentZ = this.currentZ;
		if (this.hasQuadBatchTop)
		{
			this.batch[this.batchPtr - 1].indexCount += 6;
		}
		else
		{
			var b = this.pushBatch();
			b.type = BATCH_QUAD;
			b.startIndex = this.enableFrontToBack ? v : (v / 2) * 3;
			b.indexCount = 6;
			this.hasQuadBatchTop = true;
			this.hasPointBatchTop = false;
		}
		if (this.enableFrontToBack)
		{
			vd[v++] = tlx;
			vd[v++] = tly;
			vd[v++] = currentZ;
			vd[v++] = trx;
			vd[v++] = try_;
			vd[v++] = currentZ;
			vd[v++] = brx;
			vd[v++] = bry;
			vd[v++] = currentZ;
			vd[v++] = blx;
			vd[v++] = bly;
			vd[v++] = currentZ;
		}
		else
		{
			vd[v++] = tlx;
			vd[v++] = tly;
			vd[v++] = trx;
			vd[v++] = try_;
			vd[v++] = brx;
			vd[v++] = bry;
			vd[v++] = blx;
			vd[v++] = bly;
		}
		td[t++] = 0;
		td[t++] = 0;
		td[t++] = 1;
		td[t++] = 0;
		td[t++] = 1;
		td[t++] = 1;
		td[t++] = 0;
		td[t++] = 1;
		this.vertexPtr = v;
		this.texPtr = t;
	};
	GLWrap_.prototype.quadTex = function(tlx, tly, trx, try_, brx, bry, blx, bly, rcTex)
	{
		if (this.vertexPtr >= LAST_VERTEX)
			this.endBatch();
		var v = this.vertexPtr;			// vertex cursor
		var t = this.texPtr;
		var vd = this.vertexData;		// vertex data array
		var td = this.texcoordData;		// texture coord data array
		var currentZ = this.currentZ;
		if (this.hasQuadBatchTop)
		{
			this.batch[this.batchPtr - 1].indexCount += 6;
		}
		else
		{
			var b = this.pushBatch();
			b.type = BATCH_QUAD;
			b.startIndex = this.enableFrontToBack ? v : (v / 2) * 3;
			b.indexCount = 6;
			this.hasQuadBatchTop = true;
			this.hasPointBatchTop = false;
		}
		var rc_left = rcTex.left;
		var rc_top = rcTex.top;
		var rc_right = rcTex.right;
		var rc_bottom = rcTex.bottom;
		if (this.enableFrontToBack)
		{
			vd[v++] = tlx;
			vd[v++] = tly;
			vd[v++] = currentZ;
			vd[v++] = trx;
			vd[v++] = try_;
			vd[v++] = currentZ;
			vd[v++] = brx;
			vd[v++] = bry;
			vd[v++] = currentZ;
			vd[v++] = blx;
			vd[v++] = bly;
			vd[v++] = currentZ;
		}
		else
		{
			vd[v++] = tlx;
			vd[v++] = tly;
			vd[v++] = trx;
			vd[v++] = try_;
			vd[v++] = brx;
			vd[v++] = bry;
			vd[v++] = blx;
			vd[v++] = bly;
		}
		td[t++] = rc_left;
		td[t++] = rc_top;
		td[t++] = rc_right;
		td[t++] = rc_top;
		td[t++] = rc_right;
		td[t++] = rc_bottom;
		td[t++] = rc_left;
		td[t++] = rc_bottom;
		this.vertexPtr = v;
		this.texPtr = t;
	};
	GLWrap_.prototype.quadTexUV = function(tlx, tly, trx, try_, brx, bry, blx, bly, tlu, tlv, tru, trv, bru, brv, blu, blv)
	{
		if (this.vertexPtr >= LAST_VERTEX)
			this.endBatch();
		var v = this.vertexPtr;			// vertex cursor
		var t = this.texPtr;
		var vd = this.vertexData;		// vertex data array
		var td = this.texcoordData;		// texture coord data array
		var currentZ = this.currentZ;
		if (this.hasQuadBatchTop)
		{
			this.batch[this.batchPtr - 1].indexCount += 6;
		}
		else
		{
			var b = this.pushBatch();
			b.type = BATCH_QUAD;
			b.startIndex = this.enableFrontToBack ? v : (v / 2) * 3;
			b.indexCount = 6;
			this.hasQuadBatchTop = true;
			this.hasPointBatchTop = false;
		}
		if (this.enableFrontToBack)
		{
			vd[v++] = tlx;
			vd[v++] = tly;
			vd[v++] = currentZ;
			vd[v++] = trx;
			vd[v++] = try_;
			vd[v++] = currentZ;
			vd[v++] = brx;
			vd[v++] = bry;
			vd[v++] = currentZ;
			vd[v++] = blx;
			vd[v++] = bly;
			vd[v++] = currentZ;
		}
		else
		{
			vd[v++] = tlx;
			vd[v++] = tly;
			vd[v++] = trx;
			vd[v++] = try_;
			vd[v++] = brx;
			vd[v++] = bry;
			vd[v++] = blx;
			vd[v++] = bly;
		}
		td[t++] = tlu;
		td[t++] = tlv;
		td[t++] = tru;
		td[t++] = trv;
		td[t++] = bru;
		td[t++] = brv;
		td[t++] = blu;
		td[t++] = blv;
		this.vertexPtr = v;
		this.texPtr = t;
	};
	GLWrap_.prototype.convexPoly = function(pts)
	{
		var pts_count = pts.length / 2;
;
		var tris = pts_count - 2;	// 3 points = 1 tri, 4 points = 2 tris, 5 points = 3 tris etc.
		var last_tri = tris - 1;
		var p0x = pts[0];
		var p0y = pts[1];
		var i, i2, p1x, p1y, p2x, p2y, p3x, p3y;
		for (i = 0; i < tris; i += 2)		// draw 2 triangles at a time
		{
			i2 = i * 2;
			p1x = pts[i2 + 2];
			p1y = pts[i2 + 3];
			p2x = pts[i2 + 4];
			p2y = pts[i2 + 5];
			if (i === last_tri)
			{
				this.quad(p0x, p0y, p1x, p1y, p2x, p2y, p2x, p2y);
			}
			else
			{
				p3x = pts[i2 + 6];
				p3y = pts[i2 + 7];
				this.quad(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y);
			}
		}
	};
	var LAST_POINT = MAX_POINTS - 4;
	GLWrap_.prototype.point = function(x_, y_, size_, opacity_)
	{
		if (this.pointPtr >= LAST_POINT)
			this.endBatch();
		var p = this.pointPtr;			// point cursor
		var pd = this.pointData;		// point data array
		if (this.hasPointBatchTop)
		{
			this.batch[this.batchPtr - 1].indexCount++;
		}
		else
		{
			var b = this.pushBatch();
			b.type = BATCH_POINTS;
			b.startIndex = p;
			b.indexCount = 1;
			this.hasPointBatchTop = true;
			this.hasQuadBatchTop = false;
		}
		pd[p++] = x_;
		pd[p++] = y_;
		pd[p++] = size_;
		pd[p++] = opacity_;
		this.pointPtr = p;
	};
	GLWrap_.prototype.switchProgram = function (progIndex)
	{
		if (this.lastProgram === progIndex)
			return;			// no change
		var shaderProg = this.shaderPrograms[progIndex];
		if (!shaderProg)
		{
			if (this.lastProgram === 0)
				return;								// already on default shader
			progIndex = 0;
			shaderProg = this.shaderPrograms[0];
		}
		var b = this.pushBatch();
		b.type = BATCH_SETPROGRAM;
		b.startIndex = progIndex;
		this.lastProgram = progIndex;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.programUsesDest = function (progIndex)
	{
		var s = this.shaderPrograms[progIndex];
		return !!(s.locDestStart || s.locDestEnd);
	};
	GLWrap_.prototype.programUsesCrossSampling = function (progIndex)
	{
		var s = this.shaderPrograms[progIndex];
		return !!(s.locDestStart || s.locDestEnd || s.crossSampling);
	};
	GLWrap_.prototype.programPreservesOpaqueness = function (progIndex)
	{
		return this.shaderPrograms[progIndex].preservesOpaqueness;
	};
	GLWrap_.prototype.programExtendsBox = function (progIndex)
	{
		var s = this.shaderPrograms[progIndex];
		return s.extendBoxHorizontal !== 0 || s.extendBoxVertical !== 0;
	};
	GLWrap_.prototype.getProgramBoxExtendHorizontal = function (progIndex)
	{
		return this.shaderPrograms[progIndex].extendBoxHorizontal;
	};
	GLWrap_.prototype.getProgramBoxExtendVertical = function (progIndex)
	{
		return this.shaderPrograms[progIndex].extendBoxVertical;
	};
	GLWrap_.prototype.getProgramParameterType = function (progIndex, paramIndex)
	{
		return this.shaderPrograms[progIndex].parameters[paramIndex][2];
	};
	GLWrap_.prototype.programIsAnimated = function (progIndex)
	{
		return this.shaderPrograms[progIndex].animated;
	};
	GLWrap_.prototype.setProgramParameters = function (backTex, pixelWidth, pixelHeight, destStartX, destStartY, destEndX, destEndY, layerScale, layerAngle, viewOriginLeft, viewOriginTop, scrollPosX, scrollPosY, seconds, params)
	{
		var i, len;
		var s = this.shaderPrograms[this.lastProgram];
		var b, mat4param, shaderParams;
		if (s.hasAnyOptionalUniforms || params.length)
		{
			b = this.pushBatch();
			b.type = BATCH_SETPROGRAMPARAMETERS;
			if (b.mat4param)
				mat4.set(this.matMV, b.mat4param);
			else
				b.mat4param = mat4.create();
			mat4param = b.mat4param;
			mat4param[0] = pixelWidth;
			mat4param[1] = pixelHeight;
			mat4param[2] = destStartX;
			mat4param[3] = destStartY;
			mat4param[4] = destEndX;
			mat4param[5] = destEndY;
			mat4param[6] = layerScale;
			mat4param[7] = layerAngle;
			mat4param[8] = viewOriginLeft;
			mat4param[9] = viewOriginTop;
			mat4param[10] = scrollPosX;
			mat4param[11] = scrollPosY;
			mat4param[12] = seconds;
			if (s.locSamplerBack)
			{
;
				b.texParam = backTex;
			}
			else
				b.texParam = null;
			if (params.length)
			{
				shaderParams = b.shaderParams;
				shaderParams.length = params.length;
				for (i = 0, len = params.length; i < len; i++)
					shaderParams[i] = params[i];
			}
			this.hasQuadBatchTop = false;
			this.hasPointBatchTop = false;
		}
	};
	GLWrap_.prototype.clear = function (r, g, b_, a)
	{
		var b = this.pushBatch();
		b.type = BATCH_CLEAR;
		b.startIndex = 0;					// clear all mode
		if (!b.mat4param)
			b.mat4param = mat4.create();
		b.mat4param[0] = r;
		b.mat4param[1] = g;
		b.mat4param[2] = b_;
		b.mat4param[3] = a;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.clearRect = function (x, y, w, h)
	{
		if (w < 0 || h < 0)
			return;							// invalid clear area
		var b = this.pushBatch();
		b.type = BATCH_CLEAR;
		b.startIndex = 1;					// clear rect mode
		if (!b.mat4param)
			b.mat4param = mat4.create();
		b.mat4param[0] = x;
		b.mat4param[1] = y;
		b.mat4param[2] = w;
		b.mat4param[3] = h;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.clearDepth = function ()
	{
		var b = this.pushBatch();
		b.type = BATCH_CLEAR;
		b.startIndex = 2;					// clear depth mode
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.setEarlyZPass = function (e)
	{
		if (!this.enableFrontToBack)
			return;		// no depth buffer in use
		e = !!e;
		if (this.isEarlyZPass === e)
			return;		// no change
		var b = this.pushBatch();
		b.type = BATCH_SETEARLYZMODE;
		b.startIndex = (e ? 1 : 0);
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
		this.isEarlyZPass = e;
		this.renderToTex = null;
		if (this.isEarlyZPass)
		{
			this.switchProgram(2);		// early Z program
		}
		else
		{
			this.switchProgram(0);		// normal rendering
		}
	};
	GLWrap_.prototype.setDepthTestEnabled = function (e)
	{
		if (!this.enableFrontToBack)
			return;		// no depth buffer in use
		var b = this.pushBatch();
		b.type = BATCH_SETDEPTHTEST;
		b.startIndex = (e ? 1 : 0);
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.fullscreenQuad = function ()
	{
		mat4.set(this.lastMV, tempMat4);
		this.resetModelView();
		this.updateModelView();
		var halfw = this.width / 2;
		var halfh = this.height / 2;
		this.quad(-halfw, halfh, halfw, halfh, halfw, -halfh, -halfw, -halfh);
		mat4.set(tempMat4, this.matMV);
		this.updateModelView();
	};
	GLWrap_.prototype.setColorFillMode = function (r_, g_, b_, a_)
	{
		this.switchProgram(3);
		var b = this.pushBatch();
		b.type = BATCH_SETCOLOR;
		if (!b.mat4param)
			b.mat4param = mat4.create();
		b.mat4param[0] = r_;
		b.mat4param[1] = g_;
		b.mat4param[2] = b_;
		b.mat4param[3] = a_;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	GLWrap_.prototype.setTextureFillMode = function ()
	{
;
		this.switchProgram(0);
	};
	GLWrap_.prototype.restoreEarlyZMode = function ()
	{
;
		this.switchProgram(2);
	};
	GLWrap_.prototype.present = function ()
	{
		this.endBatch();
		this.gl.flush();
		/*
		if (debugBatch)
		{
;
			debugBatch = false;
		}
		*/
	};
	function nextHighestPowerOfTwo(x) {
		--x;
		for (var i = 1; i < 32; i <<= 1) {
			x = x | x >> i;
		}
		return x + 1;
	}
	var all_textures = [];
	var textures_by_src = {};
	GLWrap_.prototype.contextLost = function ()
	{
		cr.clearArray(all_textures);
		textures_by_src = {};
	};
	var BF_RGBA8 = 0;
	var BF_RGB8 = 1;
	var BF_RGBA4 = 2;
	var BF_RGB5_A1 = 3;
	var BF_RGB565 = 4;
	GLWrap_.prototype.loadTexture = function (img, tiling, linearsampling, pixelformat, tiletype, nomip)
	{
		tiling = !!tiling;
		linearsampling = !!linearsampling;
		var tex_key = img.src + "," + tiling + "," + linearsampling + (tiling ? ("," + tiletype) : "");
		var webGL_texture = null;
		if (typeof img.src !== "undefined" && textures_by_src.hasOwnProperty(tex_key))
		{
			webGL_texture = textures_by_src[tex_key];
			webGL_texture.c2refcount++;
			return webGL_texture;
		}
		this.endBatch();
;
		var gl = this.gl;
		var isPOT = (cr.isPOT(img.width) && cr.isPOT(img.height));
		webGL_texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, webGL_texture);
		gl.pixelStorei(gl["UNPACK_PREMULTIPLY_ALPHA_WEBGL"], true);
		var internalformat = gl.RGBA;
		var format = gl.RGBA;
		var type = gl.UNSIGNED_BYTE;
		if (pixelformat && !this.isIE)
		{
			switch (pixelformat) {
			case BF_RGB8:
				internalformat = gl.RGB;
				format = gl.RGB;
				break;
			case BF_RGBA4:
				type = gl.UNSIGNED_SHORT_4_4_4_4;
				break;
			case BF_RGB5_A1:
				type = gl.UNSIGNED_SHORT_5_5_5_1;
				break;
			case BF_RGB565:
				internalformat = gl.RGB;
				format = gl.RGB;
				type = gl.UNSIGNED_SHORT_5_6_5;
				break;
			}
		}
		if (!isPOT && tiling)
		{
			var canvas = document.createElement("canvas");
			canvas.width = cr.nextHighestPowerOfTwo(img.width);
			canvas.height = cr.nextHighestPowerOfTwo(img.height);
			var ctx = canvas.getContext("2d");
			if (typeof ctx["imageSmoothingEnabled"] !== "undefined")
			{
				ctx["imageSmoothingEnabled"] = linearsampling;
			}
			else
			{
				ctx["webkitImageSmoothingEnabled"] = linearsampling;
				ctx["mozImageSmoothingEnabled"] = linearsampling;
				ctx["msImageSmoothingEnabled"] = linearsampling;
			}
			ctx.drawImage(img,
						  0, 0, img.width, img.height,
						  0, 0, canvas.width, canvas.height);
			gl.texImage2D(gl.TEXTURE_2D, 0, internalformat, format, type, canvas);
		}
		else
			gl.texImage2D(gl.TEXTURE_2D, 0, internalformat, format, type, img);
		if (tiling)
		{
			if (tiletype === "repeat-x")
			{
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			}
			else if (tiletype === "repeat-y")
			{
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
			}
			else
			{
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
			}
		}
		else
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}
		if (linearsampling)
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			if (isPOT && this.enable_mipmaps && !nomip)
			{
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
				gl.generateMipmap(gl.TEXTURE_2D);
			}
			else
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		}
		else
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		}
		gl.bindTexture(gl.TEXTURE_2D, null);
		this.lastTexture0 = null;
		webGL_texture.c2width = img.width;
		webGL_texture.c2height = img.height;
		webGL_texture.c2refcount = 1;
		webGL_texture.c2texkey = tex_key;
		all_textures.push(webGL_texture);
		textures_by_src[tex_key] = webGL_texture;
		return webGL_texture;
	};
	GLWrap_.prototype.createEmptyTexture = function (w, h, linearsampling, _16bit, tiling)
	{
		this.endBatch();
		var gl = this.gl;
		if (this.isIE)
			_16bit = false;
		var webGL_texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, webGL_texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, _16bit ? gl.UNSIGNED_SHORT_4_4_4_4 : gl.UNSIGNED_BYTE, null);
		if (tiling)
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		}
		else
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, linearsampling ? gl.LINEAR : gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linearsampling ? gl.LINEAR : gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null);
		this.lastTexture0 = null;
		webGL_texture.c2width = w;
		webGL_texture.c2height = h;
		all_textures.push(webGL_texture);
		return webGL_texture;
	};
	GLWrap_.prototype.videoToTexture = function (video_, texture_, _16bit)
	{
		this.endBatch();
		var gl = this.gl;
		if (this.isIE)
			_16bit = false;
		gl.bindTexture(gl.TEXTURE_2D, texture_);
		gl.pixelStorei(gl["UNPACK_PREMULTIPLY_ALPHA_WEBGL"], true);
		try {
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, _16bit ? gl.UNSIGNED_SHORT_4_4_4_4 : gl.UNSIGNED_BYTE, video_);
		}
		catch (e)
		{
			if (console && console.error)
				console.error("Error updating WebGL texture: ", e);
		}
		gl.bindTexture(gl.TEXTURE_2D, null);
		this.lastTexture0 = null;
	};
	GLWrap_.prototype.deleteTexture = function (tex)
	{
		if (!tex)
			return;
		if (typeof tex.c2refcount !== "undefined" && tex.c2refcount > 1)
		{
			tex.c2refcount--;
			return;
		}
		this.endBatch();
		if (tex === this.lastTexture0)
		{
			this.gl.bindTexture(this.gl.TEXTURE_2D, null);
			this.lastTexture0 = null;
		}
		if (tex === this.lastTexture1)
		{
			this.gl.activeTexture(this.gl.TEXTURE1);
			this.gl.bindTexture(this.gl.TEXTURE_2D, null);
			this.gl.activeTexture(this.gl.TEXTURE0);
			this.lastTexture1 = null;
		}
		cr.arrayFindRemove(all_textures, tex);
		if (typeof tex.c2texkey !== "undefined")
			delete textures_by_src[tex.c2texkey];
		this.gl.deleteTexture(tex);
	};
	GLWrap_.prototype.estimateVRAM = function ()
	{
		var total = this.width * this.height * 4 * 2;
		var i, len, t;
		for (i = 0, len = all_textures.length; i < len; i++)
		{
			t = all_textures[i];
			total += (t.c2width * t.c2height * 4);
		}
		return total;
	};
	GLWrap_.prototype.textureCount = function ()
	{
		return all_textures.length;
	};
	GLWrap_.prototype.setRenderingToTexture = function (tex)
	{
		if (tex === this.renderToTex)
			return;
;
		var b = this.pushBatch();
		b.type = BATCH_RENDERTOTEXTURE;
		b.texParam = tex;
		this.renderToTex = tex;
		this.hasQuadBatchTop = false;
		this.hasPointBatchTop = false;
	};
	cr.GLWrap = GLWrap_;
}());
;
(function()
{
	var raf = window["requestAnimationFrame"] ||
	  window["mozRequestAnimationFrame"]    ||
	  window["webkitRequestAnimationFrame"] ||
	  window["msRequestAnimationFrame"]     ||
	  window["oRequestAnimationFrame"];
	function Runtime(canvas)
	{
		if (!canvas || (!canvas.getContext && !canvas["dc"]))
			return;
		if (canvas["c2runtime"])
			return;
		else
			canvas["c2runtime"] = this;
		var self = this;
		this.isCrosswalk = /crosswalk/i.test(navigator.userAgent) || /xwalk/i.test(navigator.userAgent) || !!(typeof window["c2isCrosswalk"] !== "undefined" && window["c2isCrosswalk"]);
		this.isCordova = this.isCrosswalk || (typeof window["device"] !== "undefined" && (typeof window["device"]["cordova"] !== "undefined" || typeof window["device"]["phonegap"] !== "undefined")) || (typeof window["c2iscordova"] !== "undefined" && window["c2iscordova"]);
		this.isPhoneGap = this.isCordova;
		this.isDirectCanvas = !!canvas["dc"];
		this.isAppMobi = (typeof window["AppMobi"] !== "undefined" || this.isDirectCanvas);
		this.isCocoonJs = !!window["c2cocoonjs"];
		this.isEjecta = !!window["c2ejecta"];
		if (this.isCocoonJs)
		{
			CocoonJS["App"]["onSuspended"].addEventListener(function() {
				self["setSuspended"](true);
			});
			CocoonJS["App"]["onActivated"].addEventListener(function () {
				self["setSuspended"](false);
			});
		}
		if (this.isEjecta)
		{
			document.addEventListener("pagehide", function() {
				self["setSuspended"](true);
			});
			document.addEventListener("pageshow", function() {
				self["setSuspended"](false);
			});
			document.addEventListener("resize", function () {
				self["setSize"](window.innerWidth, window.innerHeight);
			});
		}
		this.isDomFree = (this.isDirectCanvas || this.isCocoonJs || this.isEjecta);
		this.isMicrosoftEdge = /edge\//i.test(navigator.userAgent);
		this.isIE = (/msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent) || /iemobile/i.test(navigator.userAgent)) && !this.isMicrosoftEdge;
		this.isTizen = /tizen/i.test(navigator.userAgent);
		this.isAndroid = /android/i.test(navigator.userAgent) && !this.isTizen && !this.isIE && !this.isMicrosoftEdge;		// IE mobile and Tizen masquerade as Android
		this.isiPhone = (/iphone/i.test(navigator.userAgent) || /ipod/i.test(navigator.userAgent)) && !this.isIE && !this.isMicrosoftEdge;	// treat ipod as an iphone; IE mobile masquerades as iPhone
		this.isiPad = /ipad/i.test(navigator.userAgent);
		this.isiOS = this.isiPhone || this.isiPad || this.isEjecta;
		this.isiPhoneiOS6 = (this.isiPhone && /os\s6/i.test(navigator.userAgent));
		this.isChrome = (/chrome/i.test(navigator.userAgent) || /chromium/i.test(navigator.userAgent)) && !this.isIE && !this.isMicrosoftEdge;	// note true on Chromium-based webview on Android 4.4+; IE 'Edge' mode also pretends to be Chrome
		this.isAmazonWebApp = /amazonwebappplatform/i.test(navigator.userAgent);
		this.isFirefox = /firefox/i.test(navigator.userAgent);
		this.isSafari = /safari/i.test(navigator.userAgent) && !this.isChrome && !this.isIE && !this.isMicrosoftEdge;		// Chrome and IE Mobile masquerade as Safari
		this.isWindows = /windows/i.test(navigator.userAgent);
		this.isNWjs = (typeof window["c2nodewebkit"] !== "undefined" || typeof window["c2nwjs"] !== "undefined" || /nodewebkit/i.test(navigator.userAgent) || /nwjs/i.test(navigator.userAgent));
		this.isNodeWebkit = this.isNWjs;		// old name for backwards compat
		this.isArcade = (typeof window["is_scirra_arcade"] !== "undefined");
		this.isWindows8App = !!(typeof window["c2isWindows8"] !== "undefined" && window["c2isWindows8"]);
		this.isWindows8Capable = !!(typeof window["c2isWindows8Capable"] !== "undefined" && window["c2isWindows8Capable"]);
		this.isWindowsPhone8 = !!(typeof window["c2isWindowsPhone8"] !== "undefined" && window["c2isWindowsPhone8"]);
		this.isWindowsPhone81 = !!(typeof window["c2isWindowsPhone81"] !== "undefined" && window["c2isWindowsPhone81"]);
		this.isWindows10 = !!window["cr_windows10"];
		this.isWinJS = (this.isWindows8App || this.isWindows8Capable || this.isWindowsPhone81 || this.isWindows10);	// note not WP8.0
		this.isBlackberry10 = !!(typeof window["c2isBlackberry10"] !== "undefined" && window["c2isBlackberry10"]);
		this.isAndroidStockBrowser = (this.isAndroid && !this.isChrome && !this.isCrosswalk && !this.isFirefox && !this.isAmazonWebApp && !this.isDomFree);
		this.devicePixelRatio = 1;
		this.isMobile = (this.isCordova || this.isCrosswalk || this.isAppMobi || this.isCocoonJs || this.isAndroid || this.isiOS || this.isWindowsPhone8 || this.isWindowsPhone81 || this.isBlackberry10 || this.isTizen || this.isEjecta);
		if (!this.isMobile)
		{
			this.isMobile = /(blackberry|bb10|playbook|palm|symbian|nokia|windows\s+ce|phone|mobile|tablet|kindle|silk)/i.test(navigator.userAgent);
		}
		this.isWKWebView = !!(this.isiOS && this.isCordova && window["webkit"]);
		this.httpServer = null;
		this.httpServerUrl = "";
		if (this.isWKWebView)
		{
			this.httpServer = (cordova && cordova["plugins"] && cordova["plugins"]["CorHttpd"]) ? cordova["plugins"]["CorHttpd"] : null;
		}
		if (typeof cr_is_preview !== "undefined" && !this.isNWjs && (window.location.search === "?nw" || /nodewebkit/i.test(navigator.userAgent) || /nwjs/i.test(navigator.userAgent)))
		{
			this.isNWjs = true;
		}
		this.isDebug = (typeof cr_is_preview !== "undefined" && window.location.search.indexOf("debug") > -1);
		this.canvas = canvas;
		this.canvasdiv = document.getElementById("c2canvasdiv");
		this.gl = null;
		this.glwrap = null;
		this.glUnmaskedRenderer = "(unavailable)";
		this.enableFrontToBack = false;
		this.earlyz_index = 0;
		this.ctx = null;
		this.fullscreenOldMarginCss = "";
		this.firstInFullscreen = false;
		this.oldWidth = 0;		// for restoring non-fullscreen canvas after fullscreen
		this.oldHeight = 0;
		this.canvas.oncontextmenu = function (e) { if (e.preventDefault) e.preventDefault(); return false; };
		this.canvas.onselectstart = function (e) { if (e.preventDefault) e.preventDefault(); return false; };
		if (this.isDirectCanvas)
			window["c2runtime"] = this;
		if (this.isNWjs)
		{
			window["ondragover"] = function(e) { e.preventDefault(); return false; };
			window["ondrop"] = function(e) { e.preventDefault(); return false; };
			if (window["nwgui"] && window["nwgui"]["App"]["clearCache"])
				window["nwgui"]["App"]["clearCache"]();
		}
		if (this.isAndroidStockBrowser && typeof jQuery !== "undefined")
		{
			jQuery("canvas").parents("*").css("overflow", "visible");
		}
		this.width = canvas.width;
		this.height = canvas.height;
		this.draw_width = this.width;
		this.draw_height = this.height;
		this.cssWidth = this.width;
		this.cssHeight = this.height;
		this.lastWindowWidth = window.innerWidth;
		this.lastWindowHeight = window.innerHeight;
		this.forceCanvasAlpha = false;		// allow plugins to force the canvas to display with alpha channel
		this.redraw = true;
		this.isSuspended = false;
		if (!Date.now) {
		  Date.now = function now() {
			return +new Date();
		  };
		}
		this.plugins = [];
		this.types = {};
		this.types_by_index = [];
		this.behaviors = [];
		this.layouts = {};
		this.layouts_by_index = [];
		this.eventsheets = {};
		this.eventsheets_by_index = [];
		this.wait_for_textures = [];        // for blocking until textures loaded
		this.triggers_to_postinit = [];
		this.all_global_vars = [];
		this.all_local_vars = [];
		this.solidBehavior = null;
		this.jumpthruBehavior = null;
		this.shadowcasterBehavior = null;
		this.deathRow = {};
		this.hasPendingInstances = false;		// true if anything exists in create row or death row
		this.isInClearDeathRow = false;
		this.isInOnDestroy = 0;					// needs to support recursion so increments and decrements and is true if > 0
		this.isRunningEvents = false;
		this.isEndingLayout = false;
		this.createRow = [];
		this.isLoadingState = false;
		this.saveToSlot = "";
		this.loadFromSlot = "";
		this.loadFromJson = "";
		this.lastSaveJson = "";
		this.signalledContinuousPreview = false;
		this.suspendDrawing = false;		// for hiding display until continuous preview loads
		this.fireOnCreateAfterLoad = [];	// for delaying "On create" triggers until loading complete
		this.dt = 0;
        this.dt1 = 0;
		this.minimumFramerate = 30;
		this.logictime = 0;			// used to calculate CPUUtilisation
		this.cpuutilisation = 0;
        this.timescale = 1.0;
        this.kahanTime = new cr.KahanAdder();
		this.wallTime = new cr.KahanAdder();
		this.last_tick_time = 0;
		this.fps = 0;
		this.last_fps_time = 0;
		this.tickcount = 0;
		this.execcount = 0;
		this.framecount = 0;        // for fps
		this.objectcount = 0;
		this.changelayout = null;
		this.destroycallbacks = [];
		this.event_stack = [];
		this.event_stack_index = -1;
		this.localvar_stack = [[]];
		this.localvar_stack_index = 0;
		this.trigger_depth = 0;		// recursion depth for triggers
		this.pushEventStack(null);
		this.loop_stack = [];
		this.loop_stack_index = -1;
		this.next_uid = 0;
		this.next_puid = 0;		// permanent unique ids
		this.layout_first_tick = true;
		this.family_count = 0;
		this.suspend_events = [];
		this.raf_id = -1;
		this.timeout_id = -1;
		this.isloading = true;
		this.loadingprogress = 0;
		this.isNodeFullscreen = false;
		this.stackLocalCount = 0;	// number of stack-based local vars for recursion
		this.audioInstance = null;
		this.had_a_click = false;
		this.isInUserInputEvent = false;
		this.objects_to_pretick = new cr.ObjectSet();
        this.objects_to_tick = new cr.ObjectSet();
		this.objects_to_tick2 = new cr.ObjectSet();
		this.registered_collisions = [];
		this.temp_poly = new cr.CollisionPoly([]);
		this.temp_poly2 = new cr.CollisionPoly([]);
		this.allGroups = [];				// array of all event groups
        this.groups_by_name = {};
		this.cndsBySid = {};
		this.actsBySid = {};
		this.varsBySid = {};
		this.blocksBySid = {};
		this.running_layout = null;			// currently running layout
		this.layer_canvas = null;			// for layers "render-to-texture"
		this.layer_ctx = null;
		this.layer_tex = null;
		this.layout_tex = null;
		this.layout_canvas = null;
		this.layout_ctx = null;
		this.is_WebGL_context_lost = false;
		this.uses_background_blending = false;	// if any shader uses background blending, so entire layout renders to texture
		this.fx_tex = [null, null];
		this.fullscreen_scaling = 0;
		this.files_subfolder = "";			// path with project files
		this.objectsByUid = {};				// maps every in-use UID (as a string) to its instance
		this.loaderlogos = null;
		this.snapshotCanvas = null;
		this.snapshotData = "";
		this.objectRefTable = [];
		this.requestProjectData();
	};
	Runtime.prototype.requestProjectData = function ()
	{
		var self = this;
		if (this.isWKWebView)
		{
			if (this.httpServer)
			{
				this.httpServer["startServer"]({
					"port": 0,
					"localhost_only": true
				}, function (url)
				{
					self.httpServerUrl = url;
					self.fetchLocalFileViaCordovaAsText("data.js", function (str)
					{
						self.loadProject(JSON.parse(str));
					}, function (err)
					{
						alert("Error fetching data.js");
					});
				}, function (err)
				{
					alert("error starting local server: " + err);
				});
			}
			else
			{
				this.fetchLocalFileViaCordovaAsText("data.js", function (str)
				{
					self.loadProject(JSON.parse(str));
				}, function (err)
				{
					alert("Error fetching data.js");
				});
			}
			return;
		}
		var xhr;
		if (this.isWindowsPhone8)
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		else
			xhr = new XMLHttpRequest();
		var datajs_filename = "data.js";
		if (this.isWindows8App || this.isWindowsPhone8 || this.isWindowsPhone81 || this.isWindows10)
			datajs_filename = "data.json";
		xhr.open("GET", datajs_filename, true);
		var supportsJsonResponse = false;
		if (!this.isDomFree && ("response" in xhr) && ("responseType" in xhr))
		{
			try {
				xhr["responseType"] = "json";
				supportsJsonResponse = (xhr["responseType"] === "json");
			}
			catch (e) {
				supportsJsonResponse = false;
			}
		}
		if (!supportsJsonResponse && ("responseType" in xhr))
		{
			try {
				xhr["responseType"] = "text";
			}
			catch (e) {}
		}
		if ("overrideMimeType" in xhr)
		{
			try {
				xhr["overrideMimeType"]("application/json; charset=utf-8");
			}
			catch (e) {}
		}
		if (this.isWindowsPhone8)
		{
			xhr.onreadystatechange = function ()
			{
				if (xhr.readyState !== 4)
					return;
				self.loadProject(JSON.parse(xhr["responseText"]));
			};
		}
		else
		{
			xhr.onload = function ()
			{
				if (supportsJsonResponse)
				{
					self.loadProject(xhr["response"]);					// already parsed by browser
				}
				else
				{
					if (self.isEjecta)
					{
						var str = xhr["responseText"];
						str = str.substr(str.indexOf("{"));		// trim any BOM
						self.loadProject(JSON.parse(str));
					}
					else
					{
						self.loadProject(JSON.parse(xhr["responseText"]));	// forced to sync parse JSON
					}
				}
			};
			xhr.onerror = function (e)
			{
				cr.logerror("Error requesting " + datajs_filename + ":");
				cr.logerror(e);
			};
		}
		xhr.send();
	};
	Runtime.prototype.initRendererAndLoader = function ()
	{
		var self = this;
		var i, len, j, lenj, k, lenk, t, s, l, y;
		this.isRetina = ((!this.isDomFree || this.isEjecta || this.isCordova) && this.useHighDpi && !this.isAndroidStockBrowser);
		if (this.fullscreen_mode === 0 && this.isiOS)
			this.isRetina = false;
		this.devicePixelRatio = (this.isRetina ? (window["devicePixelRatio"] || window["webkitDevicePixelRatio"] || window["mozDevicePixelRatio"] || window["msDevicePixelRatio"] || 1) : 1);
		this.ClearDeathRow();
		var attribs;
		var alpha_canvas = !!(this.forceCanvasAlpha || (this.alphaBackground && !(this.isNWjs || this.isWinJS || this.isWindowsPhone8 || this.isCrosswalk || this.isCordova || this.isAmazonWebApp)));
		if (this.fullscreen_mode > 0)
			this["setSize"](window.innerWidth, window.innerHeight, true);
		try {
			if (this.enableWebGL && (this.isCocoonJs || this.isEjecta || !this.isDomFree))
			{
				attribs = {
					"alpha": alpha_canvas,
					"depth": false,
					"antialias": false,
					"failIfMajorPerformanceCaveat": true
				};
				this.gl = (this.canvas.getContext("webgl", attribs) || this.canvas.getContext("experimental-webgl", attribs));
			}
		}
		catch (e) {
		}
		if (this.gl)
		{
			var debug_ext = this.gl.getExtension("WEBGL_debug_renderer_info");
			if (debug_ext)
			{
				var unmasked_vendor = this.gl.getParameter(debug_ext.UNMASKED_VENDOR_WEBGL);
				var unmasked_renderer = this.gl.getParameter(debug_ext.UNMASKED_RENDERER_WEBGL);
				this.glUnmaskedRenderer = unmasked_renderer + " [" + unmasked_vendor + "]";
			}
			if (this.enableFrontToBack)
				this.glUnmaskedRenderer += " [front-to-back enabled]";
;
			if (!this.isDomFree)
			{
				this.overlay_canvas = document.createElement("canvas");
				jQuery(this.overlay_canvas).appendTo(this.canvas.parentNode);
				this.overlay_canvas.oncontextmenu = function (e) { return false; };
				this.overlay_canvas.onselectstart = function (e) { return false; };
				this.overlay_canvas.width = Math.round(this.cssWidth * this.devicePixelRatio);
				this.overlay_canvas.height = Math.round(this.cssHeight * this.devicePixelRatio);
				jQuery(this.overlay_canvas).css({"width": this.cssWidth + "px",
												"height": this.cssHeight + "px"});
				this.positionOverlayCanvas();
				this.overlay_ctx = this.overlay_canvas.getContext("2d");
			}
			this.glwrap = new cr.GLWrap(this.gl, this.isMobile, this.enableFrontToBack);
			this.glwrap.setSize(this.canvas.width, this.canvas.height);
			this.glwrap.enable_mipmaps = (this.downscalingQuality !== 0);
			this.ctx = null;
			this.canvas.addEventListener("webglcontextlost", function (ev) {
				ev.preventDefault();
				self.onContextLost();
				cr.logexport("[Construct 2] WebGL context lost");
				window["cr_setSuspended"](true);		// stop rendering
			}, false);
			this.canvas.addEventListener("webglcontextrestored", function (ev) {
				self.glwrap.initState();
				self.glwrap.setSize(self.glwrap.width, self.glwrap.height, true);
				self.layer_tex = null;
				self.layout_tex = null;
				self.fx_tex[0] = null;
				self.fx_tex[1] = null;
				self.onContextRestored();
				self.redraw = true;
				cr.logexport("[Construct 2] WebGL context restored");
				window["cr_setSuspended"](false);		// resume rendering
			}, false);
			for (i = 0, len = this.types_by_index.length; i < len; i++)
			{
				t = this.types_by_index[i];
				for (j = 0, lenj = t.effect_types.length; j < lenj; j++)
				{
					s = t.effect_types[j];
					s.shaderindex = this.glwrap.getShaderIndex(s.id);
					s.preservesOpaqueness = this.glwrap.programPreservesOpaqueness(s.shaderindex);
					this.uses_background_blending = this.uses_background_blending || this.glwrap.programUsesDest(s.shaderindex);
				}
			}
			for (i = 0, len = this.layouts_by_index.length; i < len; i++)
			{
				l = this.layouts_by_index[i];
				for (j = 0, lenj = l.effect_types.length; j < lenj; j++)
				{
					s = l.effect_types[j];
					s.shaderindex = this.glwrap.getShaderIndex(s.id);
					s.preservesOpaqueness = this.glwrap.programPreservesOpaqueness(s.shaderindex);
				}
				l.updateActiveEffects();		// update preserves opaqueness flag
				for (j = 0, lenj = l.layers.length; j < lenj; j++)
				{
					y = l.layers[j];
					for (k = 0, lenk = y.effect_types.length; k < lenk; k++)
					{
						s = y.effect_types[k];
						s.shaderindex = this.glwrap.getShaderIndex(s.id);
						s.preservesOpaqueness = this.glwrap.programPreservesOpaqueness(s.shaderindex);
						this.uses_background_blending = this.uses_background_blending || this.glwrap.programUsesDest(s.shaderindex);
					}
					y.updateActiveEffects();		// update preserves opaqueness flag
				}
			}
		}
		else
		{
			if (this.fullscreen_mode > 0 && this.isDirectCanvas)
			{
;
				this.canvas = null;
				document.oncontextmenu = function (e) { return false; };
				document.onselectstart = function (e) { return false; };
				this.ctx = AppMobi["canvas"]["getContext"]("2d");
				try {
					this.ctx["samplingMode"] = this.linearSampling ? "smooth" : "sharp";
					this.ctx["globalScale"] = 1;
					this.ctx["HTML5CompatibilityMode"] = true;
					this.ctx["imageSmoothingEnabled"] = this.linearSampling;
				} catch(e){}
				if (this.width !== 0 && this.height !== 0)
				{
					this.ctx.width = this.width;
					this.ctx.height = this.height;
				}
			}
			if (!this.ctx)
			{
;
				if (this.isCocoonJs)
				{
					attribs = {
						"antialias": !!this.linearSampling,
						"alpha": alpha_canvas
					};
					this.ctx = this.canvas.getContext("2d", attribs);
				}
				else
				{
					attribs = {
						"alpha": alpha_canvas
					};
					this.ctx = this.canvas.getContext("2d", attribs);
				}
				this.setCtxImageSmoothingEnabled(this.ctx, this.linearSampling);
			}
			this.overlay_canvas = null;
			this.overlay_ctx = null;
		}
		this.tickFunc = function (timestamp) { self.tick(false, timestamp); };
		if (window != window.top && !this.isDomFree && !this.isWinJS && !this.isWindowsPhone8)
		{
			document.addEventListener("mousedown", function () {
				window.focus();
			}, true);
			document.addEventListener("touchstart", function () {
				window.focus();
			}, true);
		}
		if (typeof cr_is_preview !== "undefined")
		{
			if (this.isCocoonJs)
				console.log("[Construct 2] In preview-over-wifi via CocoonJS mode");
			if (window.location.search.indexOf("continuous") > -1)
			{
				cr.logexport("Reloading for continuous preview");
				this.loadFromSlot = "__c2_continuouspreview";
				this.suspendDrawing = true;
			}
			if (this.pauseOnBlur && !this.isMobile)
			{
				jQuery(window).focus(function ()
				{
					self["setSuspended"](false);
				});
				jQuery(window).blur(function ()
				{
					var parent = window.parent;
					if (!parent || !parent.document.hasFocus())
						self["setSuspended"](true);
				});
			}
		}
		window.addEventListener("blur", function () {
			self.onWindowBlur();
		});
		if (!this.isDomFree)
		{
			var unfocusFormControlFunc = function (e) {
				if (cr.isCanvasInputEvent(e) && document["activeElement"] && document["activeElement"] !== document.getElementsByTagName("body")[0] && document["activeElement"].blur)
				{
					try {
						document["activeElement"].blur();
					}
					catch (e) {}
				}
			}
			if (window.navigator["pointerEnabled"])
			{
				document.addEventListener("pointerdown", unfocusFormControlFunc);
			}
			else if (window.navigator["msPointerEnabled"])
			{
				document.addEventListener("MSPointerDown", unfocusFormControlFunc);
			}
			else
			{
				document.addEventListener("touchstart", unfocusFormControlFunc);
			}
			document.addEventListener("mousedown", unfocusFormControlFunc);
		}
		if (this.fullscreen_mode === 0 && this.isRetina && this.devicePixelRatio > 1)
		{
			this["setSize"](this.original_width, this.original_height, true);
		}
		this.tryLockOrientation();
		this.getready();	// determine things to preload
		this.go();			// run loading screen
		this.extra = {};
		cr.seal(this);
	};
	var webkitRepaintFlag = false;
	Runtime.prototype["setSize"] = function (w, h, force)
	{
		var offx = 0, offy = 0;
		var neww = 0, newh = 0, intscale = 0;
		if (this.lastWindowWidth === w && this.lastWindowHeight === h && !force)
			return;
		this.lastWindowWidth = w;
		this.lastWindowHeight = h;
		var mode = this.fullscreen_mode;
		var orig_aspect, cur_aspect;
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || !!document["msFullscreenElement"] || document["fullScreen"] || this.isNodeFullscreen) && !this.isCordova;
		if (!isfullscreen && this.fullscreen_mode === 0 && !force)
			return;			// ignore size events when not fullscreen and not using a fullscreen-in-browser mode
		if (isfullscreen && this.fullscreen_scaling > 0)
			mode = this.fullscreen_scaling;
		var dpr = this.devicePixelRatio;
		if (mode >= 4)
		{
			orig_aspect = this.original_width / this.original_height;
			cur_aspect = w / h;
			if (cur_aspect > orig_aspect)
			{
				neww = h * orig_aspect;
				if (mode === 5)	// integer scaling
				{
					intscale = (neww * dpr) / this.original_width;
					if (intscale > 1)
						intscale = Math.floor(intscale);
					else if (intscale < 1)
						intscale = 1 / Math.ceil(1 / intscale);
					neww = this.original_width * intscale / dpr;
					newh = this.original_height * intscale / dpr;
					offx = (w - neww) / 2;
					offy = (h - newh) / 2;
					w = neww;
					h = newh;
				}
				else
				{
					offx = (w - neww) / 2;
					w = neww;
				}
			}
			else
			{
				newh = w / orig_aspect;
				if (mode === 5)	// integer scaling
				{
					intscale = (newh * dpr) / this.original_height;
					if (intscale > 1)
						intscale = Math.floor(intscale);
					else if (intscale < 1)
						intscale = 1 / Math.ceil(1 / intscale);
					neww = this.original_width * intscale / dpr;
					newh = this.original_height * intscale / dpr;
					offx = (w - neww) / 2;
					offy = (h - newh) / 2;
					w = neww;
					h = newh;
				}
				else
				{
					offy = (h - newh) / 2;
					h = newh;
				}
			}
			if (isfullscreen && !this.isNWjs)
			{
				offx = 0;
				offy = 0;
			}
		}
		else if (this.isNWjs && this.isNodeFullscreen && this.fullscreen_mode_set === 0)
		{
			offx = Math.floor((w - this.original_width) / 2);
			offy = Math.floor((h - this.original_height) / 2);
			w = this.original_width;
			h = this.original_height;
		}
		if (mode < 2)
			this.aspect_scale = dpr;
		this.cssWidth = Math.round(w);
		this.cssHeight = Math.round(h);
		this.width = Math.round(w * dpr);
		this.height = Math.round(h * dpr);
		this.redraw = true;
		if (this.wantFullscreenScalingQuality)
		{
			this.draw_width = this.width;
			this.draw_height = this.height;
			this.fullscreenScalingQuality = true;
		}
		else
		{
			if ((this.width < this.original_width && this.height < this.original_height) || mode === 1)
			{
				this.draw_width = this.width;
				this.draw_height = this.height;
				this.fullscreenScalingQuality = true;
			}
			else
			{
				this.draw_width = this.original_width;
				this.draw_height = this.original_height;
				this.fullscreenScalingQuality = false;
				/*var orig_aspect = this.original_width / this.original_height;
				var cur_aspect = this.width / this.height;
				if ((this.fullscreen_mode !== 2 && cur_aspect > orig_aspect) || (this.fullscreen_mode === 2 && cur_aspect < orig_aspect))
					this.aspect_scale = this.height / this.original_height;
				else
					this.aspect_scale = this.width / this.original_width;*/
				if (mode === 2)		// scale inner
				{
					orig_aspect = this.original_width / this.original_height;
					cur_aspect = this.lastWindowWidth / this.lastWindowHeight;
					if (cur_aspect < orig_aspect)
						this.draw_width = this.draw_height * cur_aspect;
					else if (cur_aspect > orig_aspect)
						this.draw_height = this.draw_width / cur_aspect;
				}
				else if (mode === 3)
				{
					orig_aspect = this.original_width / this.original_height;
					cur_aspect = this.lastWindowWidth / this.lastWindowHeight;
					if (cur_aspect > orig_aspect)
						this.draw_width = this.draw_height * cur_aspect;
					else if (cur_aspect < orig_aspect)
						this.draw_height = this.draw_width / cur_aspect;
				}
			}
		}
		if (this.canvasdiv && !this.isDomFree)
		{
			jQuery(this.canvasdiv).css({"width": Math.round(w) + "px",
										"height": Math.round(h) + "px",
										"margin-left": Math.floor(offx) + "px",
										"margin-top": Math.floor(offy) + "px"});
			if (typeof cr_is_preview !== "undefined")
			{
				jQuery("#borderwrap").css({"width": Math.round(w) + "px",
											"height": Math.round(h) + "px"});
			}
		}
		if (this.canvas)
		{
			this.canvas.width = Math.round(w * dpr);
			this.canvas.height = Math.round(h * dpr);
			if (this.isEjecta)
			{
				this.canvas.style.left = Math.floor(offx) + "px";
				this.canvas.style.top = Math.floor(offy) + "px";
				this.canvas.style.width = Math.round(w) + "px";
				this.canvas.style.height = Math.round(h) + "px";
			}
			else if (this.isRetina && !this.isDomFree)
			{
				this.canvas.style.width = Math.round(w) + "px";
				this.canvas.style.height = Math.round(h) + "px";
			}
		}
		if (this.overlay_canvas)
		{
			this.overlay_canvas.width = Math.round(w * dpr);
			this.overlay_canvas.height = Math.round(h * dpr);
			this.overlay_canvas.style.width = this.cssWidth + "px";
			this.overlay_canvas.style.height = this.cssHeight + "px";
		}
		if (this.glwrap)
		{
			this.glwrap.setSize(Math.round(w * dpr), Math.round(h * dpr));
		}
		if (this.isDirectCanvas && this.ctx)
		{
			this.ctx.width = Math.round(w);
			this.ctx.height = Math.round(h);
		}
		if (this.ctx)
		{
			this.setCtxImageSmoothingEnabled(this.ctx, this.linearSampling);
		}
		this.tryLockOrientation();
		if (this.isiPhone && !this.isCordova)
		{
			window.scrollTo(0, 0);
		}
	};
	Runtime.prototype.tryLockOrientation = function ()
	{
		if (!this.autoLockOrientation || this.orientations === 0)
			return;
		var orientation = "portrait";
		if (this.orientations === 2)
			orientation = "landscape";
		try {
			if (screen["orientation"] && screen["orientation"]["lock"])
				screen["orientation"]["lock"](orientation).catch(function(){});
			else if (screen["lockOrientation"])
				screen["lockOrientation"](orientation);
			else if (screen["webkitLockOrientation"])
				screen["webkitLockOrientation"](orientation);
			else if (screen["mozLockOrientation"])
				screen["mozLockOrientation"](orientation);
			else if (screen["msLockOrientation"])
				screen["msLockOrientation"](orientation);
		}
		catch (e)
		{
			if (console && console.warn)
				console.warn("Failed to lock orientation: ", e);
		}
	};
	Runtime.prototype.onContextLost = function ()
	{
		this.glwrap.contextLost();
		this.is_WebGL_context_lost = true;
		var i, len, t;
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			t = this.types_by_index[i];
			if (t.onLostWebGLContext)
				t.onLostWebGLContext();
		}
	};
	Runtime.prototype.onContextRestored = function ()
	{
		this.is_WebGL_context_lost = false;
		var i, len, t;
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			t = this.types_by_index[i];
			if (t.onRestoreWebGLContext)
				t.onRestoreWebGLContext();
		}
	};
	Runtime.prototype.positionOverlayCanvas = function()
	{
		if (this.isDomFree)
			return;
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || document["fullScreen"] || !!document["msFullscreenElement"] || this.isNodeFullscreen) && !this.isCordova;
		var overlay_position = isfullscreen ? jQuery(this.canvas).offset() : jQuery(this.canvas).position();
		overlay_position.position = "absolute";
		jQuery(this.overlay_canvas).css(overlay_position);
	};
	var caf = window["cancelAnimationFrame"] ||
	  window["mozCancelAnimationFrame"]    ||
	  window["webkitCancelAnimationFrame"] ||
	  window["msCancelAnimationFrame"]     ||
	  window["oCancelAnimationFrame"];
	Runtime.prototype["setSuspended"] = function (s)
	{
		var i, len;
		var self = this;
		if (s && !this.isSuspended)
		{
			cr.logexport("[Construct 2] Suspending");
			this.isSuspended = true;			// next tick will be last
			if (this.raf_id !== -1 && caf)		// note: CocoonJS does not implement cancelAnimationFrame
				caf(this.raf_id);
			if (this.timeout_id !== -1)
				clearTimeout(this.timeout_id);
			for (i = 0, len = this.suspend_events.length; i < len; i++)
				this.suspend_events[i](true);
		}
		else if (!s && this.isSuspended)
		{
			cr.logexport("[Construct 2] Resuming");
			this.isSuspended = false;
			this.last_tick_time = cr.performance_now();	// ensure first tick is a zero-dt one
			this.last_fps_time = cr.performance_now();	// reset FPS counter
			this.framecount = 0;
			this.logictime = 0;
			for (i = 0, len = this.suspend_events.length; i < len; i++)
				this.suspend_events[i](false);
			this.tick(false);						// kick off runtime again
		}
	};
	Runtime.prototype.addSuspendCallback = function (f)
	{
		this.suspend_events.push(f);
	};
	Runtime.prototype.GetObjectReference = function (i)
	{
;
		return this.objectRefTable[i];
	};
	Runtime.prototype.loadProject = function (data_response)
	{
;
		if (!data_response || !data_response["project"])
			cr.logerror("Project model unavailable");
		var pm = data_response["project"];
		this.name = pm[0];
		this.first_layout = pm[1];
		this.fullscreen_mode = pm[12];	// 0 = off, 1 = crop, 2 = scale inner, 3 = scale outer, 4 = letterbox scale, 5 = integer letterbox scale
		this.fullscreen_mode_set = pm[12];
		this.original_width = pm[10];
		this.original_height = pm[11];
		this.parallax_x_origin = this.original_width / 2;
		this.parallax_y_origin = this.original_height / 2;
		if (this.isDomFree && !this.isEjecta && (pm[12] >= 4 || pm[12] === 0))
		{
			cr.logexport("[Construct 2] Letterbox scale fullscreen modes are not supported on this platform - falling back to 'Scale outer'");
			this.fullscreen_mode = 3;
			this.fullscreen_mode_set = 3;
		}
		this.uses_loader_layout = pm[18];
		this.loaderstyle = pm[19];
		if (this.loaderstyle === 0)
		{
			var loaderImage = new Image();
			loaderImage.crossOrigin = "anonymous";
			this.setImageSrc(loaderImage, "loading-logo.png");
			this.loaderlogos = {
				logo: loaderImage
			};
		}
		else if (this.loaderstyle === 4)	// c2 splash
		{
			var loaderC2logo_1024 = new Image();
			loaderC2logo_1024.src = "";
			var loaderC2logo_512 = new Image();
			loaderC2logo_512.src = "";
			var loaderC2logo_256 = new Image();
			loaderC2logo_256.src = "";
			var loaderC2logo_128 = new Image();
			loaderC2logo_128.src = "";
			var loaderPowered_1024 = new Image();
			loaderPowered_1024.src = "";
			var loaderPowered_512 = new Image();
			loaderPowered_512.src = "";
			var loaderPowered_256 = new Image();
			loaderPowered_256.src = "";
			var loaderPowered_128 = new Image();
			loaderPowered_128.src = "";
			var loaderWebsite_1024 = new Image();
			loaderWebsite_1024.src = "";
			var loaderWebsite_512 = new Image();
			loaderWebsite_512.src = "";
			var loaderWebsite_256 = new Image();
			loaderWebsite_256.src = "";
			var loaderWebsite_128 = new Image();
			loaderWebsite_128.src = "";
			this.loaderlogos = {
				logo: [loaderC2logo_1024, loaderC2logo_512, loaderC2logo_256, loaderC2logo_128],
				powered: [loaderPowered_1024, loaderPowered_512, loaderPowered_256, loaderPowered_128],
				website: [loaderWebsite_1024, loaderWebsite_512, loaderWebsite_256, loaderWebsite_128]
			};
		}
		this.next_uid = pm[21];
		this.objectRefTable = cr.getObjectRefTable();
		this.system = new cr.system_object(this);
		var i, len, j, lenj, k, lenk, idstr, m, b, t, f, p;
		var plugin, plugin_ctor;
		for (i = 0, len = pm[2].length; i < len; i++)
		{
			m = pm[2][i];
			p = this.GetObjectReference(m[0]);
;
			cr.add_common_aces(m, p.prototype);
			plugin = new p(this);
			plugin.singleglobal = m[1];
			plugin.is_world = m[2];
			plugin.must_predraw = m[9];
			if (plugin.onCreate)
				plugin.onCreate();  // opportunity to override default ACEs
			cr.seal(plugin);
			this.plugins.push(plugin);
		}
		this.objectRefTable = cr.getObjectRefTable();
		for (i = 0, len = pm[3].length; i < len; i++)
		{
			m = pm[3][i];
			plugin_ctor = this.GetObjectReference(m[1]);
;
			plugin = null;
			for (j = 0, lenj = this.plugins.length; j < lenj; j++)
			{
				if (this.plugins[j] instanceof plugin_ctor)
				{
					plugin = this.plugins[j];
					break;
				}
			}
;
;
			var type_inst = new plugin.Type(plugin);
;
			type_inst.name = m[0];
			type_inst.is_family = m[2];
			type_inst.instvar_sids = m[3].slice(0);
			type_inst.vars_count = m[3].length;
			type_inst.behs_count = m[4];
			type_inst.fx_count = m[5];
			type_inst.sid = m[11];
			if (type_inst.is_family)
			{
				type_inst.members = [];				// types in this family
				type_inst.family_index = this.family_count++;
				type_inst.families = null;
			}
			else
			{
				type_inst.members = null;
				type_inst.family_index = -1;
				type_inst.families = [];			// families this type belongs to
			}
			type_inst.family_var_map = null;
			type_inst.family_beh_map = null;
			type_inst.family_fx_map = null;
			type_inst.is_contained = false;
			type_inst.container = null;
			if (m[6])
			{
				type_inst.texture_file = m[6][0];
				type_inst.texture_filesize = m[6][1];
				type_inst.texture_pixelformat = m[6][2];
			}
			else
			{
				type_inst.texture_file = null;
				type_inst.texture_filesize = 0;
				type_inst.texture_pixelformat = 0;		// rgba8
			}
			if (m[7])
			{
				type_inst.animations = m[7];
			}
			else
			{
				type_inst.animations = null;
			}
			type_inst.index = i;                                // save index in to types array in type
			type_inst.instances = [];                           // all instances of this type
			type_inst.deadCache = [];							// destroyed instances to recycle next create
			type_inst.solstack = [new cr.selection(type_inst)]; // initialise SOL stack with one empty SOL
			type_inst.cur_sol = 0;
			type_inst.default_instance = null;
			type_inst.default_layerindex = 0;
			type_inst.stale_iids = true;
			type_inst.updateIIDs = cr.type_updateIIDs;
			type_inst.getFirstPicked = cr.type_getFirstPicked;
			type_inst.getPairedInstance = cr.type_getPairedInstance;
			type_inst.getCurrentSol = cr.type_getCurrentSol;
			type_inst.pushCleanSol = cr.type_pushCleanSol;
			type_inst.pushCopySol = cr.type_pushCopySol;
			type_inst.popSol = cr.type_popSol;
			type_inst.getBehaviorByName = cr.type_getBehaviorByName;
			type_inst.getBehaviorIndexByName = cr.type_getBehaviorIndexByName;
			type_inst.getEffectIndexByName = cr.type_getEffectIndexByName;
			type_inst.applySolToContainer = cr.type_applySolToContainer;
			type_inst.getInstanceByIID = cr.type_getInstanceByIID;
			type_inst.collision_grid = new cr.SparseGrid(this.original_width, this.original_height);
			type_inst.any_cell_changed = true;
			type_inst.any_instance_parallaxed = false;
			type_inst.extra = {};
			type_inst.toString = cr.type_toString;
			type_inst.behaviors = [];
			for (j = 0, lenj = m[8].length; j < lenj; j++)
			{
				b = m[8][j];
				var behavior_ctor = this.GetObjectReference(b[1]);
				var behavior_plugin = null;
				for (k = 0, lenk = this.behaviors.length; k < lenk; k++)
				{
					if (this.behaviors[k] instanceof behavior_ctor)
					{
						behavior_plugin = this.behaviors[k];
						break;
					}
				}
				if (!behavior_plugin)
				{
					behavior_plugin = new behavior_ctor(this);
					behavior_plugin.my_types = [];						// types using this behavior
					behavior_plugin.my_instances = new cr.ObjectSet(); 	// instances of this behavior
					if (behavior_plugin.onCreate)
						behavior_plugin.onCreate();
					cr.seal(behavior_plugin);
					this.behaviors.push(behavior_plugin);
					if (cr.behaviors.solid && behavior_plugin instanceof cr.behaviors.solid)
						this.solidBehavior = behavior_plugin;
					if (cr.behaviors.jumpthru && behavior_plugin instanceof cr.behaviors.jumpthru)
						this.jumpthruBehavior = behavior_plugin;
					if (cr.behaviors.shadowcaster && behavior_plugin instanceof cr.behaviors.shadowcaster)
						this.shadowcasterBehavior = behavior_plugin;
				}
				if (behavior_plugin.my_types.indexOf(type_inst) === -1)
					behavior_plugin.my_types.push(type_inst);
				var behavior_type = new behavior_plugin.Type(behavior_plugin, type_inst);
				behavior_type.name = b[0];
				behavior_type.sid = b[2];
				behavior_type.onCreate();
				cr.seal(behavior_type);
				type_inst.behaviors.push(behavior_type);
			}
			type_inst.global = m[9];
			type_inst.isOnLoaderLayout = m[10];
			type_inst.effect_types = [];
			for (j = 0, lenj = m[12].length; j < lenj; j++)
			{
				type_inst.effect_types.push({
					id: m[12][j][0],
					name: m[12][j][1],
					shaderindex: -1,
					preservesOpaqueness: false,
					active: true,
					index: j
				});
			}
			type_inst.tile_poly_data = m[13];
			if (!this.uses_loader_layout || type_inst.is_family || type_inst.isOnLoaderLayout || !plugin.is_world)
			{
				type_inst.onCreate();
				cr.seal(type_inst);
			}
			if (type_inst.name)
				this.types[type_inst.name] = type_inst;
			this.types_by_index.push(type_inst);
			if (plugin.singleglobal)
			{
				var instance = new plugin.Instance(type_inst);
				instance.uid = this.next_uid++;
				instance.puid = this.next_puid++;
				instance.iid = 0;
				instance.get_iid = cr.inst_get_iid;
				instance.toString = cr.inst_toString;
				instance.properties = m[14];
				instance.onCreate();
				cr.seal(instance);
				type_inst.instances.push(instance);
				this.objectsByUid[instance.uid.toString()] = instance;
			}
		}
		for (i = 0, len = pm[4].length; i < len; i++)
		{
			var familydata = pm[4][i];
			var familytype = this.types_by_index[familydata[0]];
			var familymember;
			for (j = 1, lenj = familydata.length; j < lenj; j++)
			{
				familymember = this.types_by_index[familydata[j]];
				familymember.families.push(familytype);
				familytype.members.push(familymember);
			}
		}
		for (i = 0, len = pm[28].length; i < len; i++)
		{
			var containerdata = pm[28][i];
			var containertypes = [];
			for (j = 0, lenj = containerdata.length; j < lenj; j++)
				containertypes.push(this.types_by_index[containerdata[j]]);
			for (j = 0, lenj = containertypes.length; j < lenj; j++)
			{
				containertypes[j].is_contained = true;
				containertypes[j].container = containertypes;
			}
		}
		if (this.family_count > 0)
		{
			for (i = 0, len = this.types_by_index.length; i < len; i++)
			{
				t = this.types_by_index[i];
				if (t.is_family || !t.families.length)
					continue;
				t.family_var_map = new Array(this.family_count);
				t.family_beh_map = new Array(this.family_count);
				t.family_fx_map = new Array(this.family_count);
				var all_fx = [];
				var varsum = 0;
				var behsum = 0;
				var fxsum = 0;
				for (j = 0, lenj = t.families.length; j < lenj; j++)
				{
					f = t.families[j];
					t.family_var_map[f.family_index] = varsum;
					varsum += f.vars_count;
					t.family_beh_map[f.family_index] = behsum;
					behsum += f.behs_count;
					t.family_fx_map[f.family_index] = fxsum;
					fxsum += f.fx_count;
					for (k = 0, lenk = f.effect_types.length; k < lenk; k++)
						all_fx.push(cr.shallowCopy({}, f.effect_types[k]));
				}
				t.effect_types = all_fx.concat(t.effect_types);
				for (j = 0, lenj = t.effect_types.length; j < lenj; j++)
					t.effect_types[j].index = j;
			}
		}
		for (i = 0, len = pm[5].length; i < len; i++)
		{
			m = pm[5][i];
			var layout = new cr.layout(this, m);
			cr.seal(layout);
			this.layouts[layout.name] = layout;
			this.layouts_by_index.push(layout);
		}
		for (i = 0, len = pm[6].length; i < len; i++)
		{
			m = pm[6][i];
			var sheet = new cr.eventsheet(this, m);
			cr.seal(sheet);
			this.eventsheets[sheet.name] = sheet;
			this.eventsheets_by_index.push(sheet);
		}
		for (i = 0, len = this.eventsheets_by_index.length; i < len; i++)
			this.eventsheets_by_index[i].postInit();
		for (i = 0, len = this.eventsheets_by_index.length; i < len; i++)
			this.eventsheets_by_index[i].updateDeepIncludes();
		for (i = 0, len = this.triggers_to_postinit.length; i < len; i++)
			this.triggers_to_postinit[i].postInit();
		cr.clearArray(this.triggers_to_postinit)
		this.audio_to_preload = pm[7];
		this.files_subfolder = pm[8];
		this.pixel_rounding = pm[9];
		this.aspect_scale = 1.0;
		this.enableWebGL = pm[13];
		this.linearSampling = pm[14];
		this.alphaBackground = pm[15];
		this.versionstr = pm[16];
		this.useHighDpi = pm[17];
		this.orientations = pm[20];		// 0 = any, 1 = portrait, 2 = landscape
		this.autoLockOrientation = (this.orientations > 0);
		this.pauseOnBlur = pm[22];
		this.wantFullscreenScalingQuality = pm[23];		// false = low quality, true = high quality
		this.fullscreenScalingQuality = this.wantFullscreenScalingQuality;
		this.downscalingQuality = pm[24];	// 0 = low (mips off), 1 = medium (mips on, dense spritesheet), 2 = high (mips on, sparse spritesheet)
		this.preloadSounds = pm[25];		// 0 = no, 1 = yes
		this.projectName = pm[26];
		this.enableFrontToBack = pm[27] && !this.isIE;		// front-to-back renderer disabled in IE (but not Edge)
		this.start_time = Date.now();
		cr.clearArray(this.objectRefTable);
		this.initRendererAndLoader();
	};
	var anyImageHadError = false;
	Runtime.prototype.waitForImageLoad = function (img_, src_)
	{
		img_["cocoonLazyLoad"] = true;
		img_.onerror = function (e)
		{
			img_.c2error = true;
			anyImageHadError = true;
			if (console && console.error)
				console.error("Error loading image '" + img_.src + "': ", e);
		};
		if (this.isEjecta)
		{
			img_.src = src_;
		}
		else if (!img_.src)
		{
			if (typeof XAPKReader !== "undefined")
			{
				XAPKReader.get(src_, function (expanded_url)
				{
					img_.src = expanded_url;
				}, function (e)
				{
					img_.c2error = true;
					anyImageHadError = true;
					if (console && console.error)
						console.error("Error extracting image '" + src_ + "' from expansion file: ", e);
				});
			}
			else
			{
				img_.crossOrigin = "anonymous";			// required for Arcade sandbox compatibility
				this.setImageSrc(img_, src_);			// work around WKWebView problems
			}
		}
		this.wait_for_textures.push(img_);
	};
	Runtime.prototype.findWaitingTexture = function (src_)
	{
		var i, len;
		for (i = 0, len = this.wait_for_textures.length; i < len; i++)
		{
			if (this.wait_for_textures[i].cr_src === src_)
				return this.wait_for_textures[i];
		}
		return null;
	};
	var audio_preload_totalsize = 0;
	var audio_preload_started = false;
	Runtime.prototype.getready = function ()
	{
		if (!this.audioInstance)
			return;
		audio_preload_totalsize = this.audioInstance.setPreloadList(this.audio_to_preload);
	};
	Runtime.prototype.areAllTexturesAndSoundsLoaded = function ()
	{
		var totalsize = audio_preload_totalsize;
		var completedsize = 0;
		var audiocompletedsize = 0;
		var ret = true;
		var i, len, img;
		for (i = 0, len = this.wait_for_textures.length; i < len; i++)
		{
			img = this.wait_for_textures[i];
			var filesize = img.cr_filesize;
			if (!filesize || filesize <= 0)
				filesize = 50000;
			totalsize += filesize;
			if (!!img.src && (img.complete || img["loaded"]) && !img.c2error)
				completedsize += filesize;
			else
				ret = false;    // not all textures loaded
		}
		if (ret && this.preloadSounds && this.audioInstance)
		{
			if (!audio_preload_started)
			{
				this.audioInstance.startPreloads();
				audio_preload_started = true;
			}
			audiocompletedsize = this.audioInstance.getPreloadedSize();
			completedsize += audiocompletedsize;
			if (audiocompletedsize < audio_preload_totalsize)
				ret = false;		// not done yet
		}
		if (totalsize == 0)
			this.progress = 1;		// indicate to C2 splash loader that it can finish now
		else
			this.progress = (completedsize / totalsize);
		return ret;
	};
	var isC2SplashDone = false;
	Runtime.prototype.go = function ()
	{
		if (!this.ctx && !this.glwrap)
			return;
		var ctx = this.ctx || this.overlay_ctx;
		if (this.overlay_canvas)
			this.positionOverlayCanvas();
		var curwidth = window.innerWidth;
		var curheight = window.innerHeight;
		if (this.lastWindowWidth !== curwidth || this.lastWindowHeight !== curheight)
		{
			this["setSize"](curwidth, curheight);
		}
		this.progress = 0;
		this.last_progress = -1;
		var self = this;
		if (this.areAllTexturesAndSoundsLoaded() && (this.loaderstyle !== 4 || isC2SplashDone))
		{
			this.go_loading_finished();
		}
		else
		{
			var ms_elapsed = Date.now() - this.start_time;
			if (ctx)
			{
				var overlay_width = this.width;
				var overlay_height = this.height;
				var dpr = this.devicePixelRatio;
				if (this.loaderstyle < 3 && (this.isCocoonJs || (ms_elapsed >= 500 && this.last_progress != this.progress)))
				{
					ctx.clearRect(0, 0, overlay_width, overlay_height);
					var mx = overlay_width / 2;
					var my = overlay_height / 2;
					var haslogo = (this.loaderstyle === 0 && this.loaderlogos.logo.complete);
					var hlw = 40 * dpr;
					var hlh = 0;
					var logowidth = 80 * dpr;
					var logoheight;
					if (haslogo)
					{
						var loaderLogoImage = this.loaderlogos.logo;
						logowidth = loaderLogoImage.width * dpr;
						logoheight = loaderLogoImage.height * dpr;
						hlw = logowidth / 2;
						hlh = logoheight / 2;
						ctx.drawImage(loaderLogoImage, cr.floor(mx - hlw), cr.floor(my - hlh), logowidth, logoheight);
					}
					if (this.loaderstyle <= 1)
					{
						my += hlh + (haslogo ? 12 * dpr : 0);
						mx -= hlw;
						mx = cr.floor(mx) + 0.5;
						my = cr.floor(my) + 0.5;
						ctx.fillStyle = anyImageHadError ? "red" : "DodgerBlue";
						ctx.fillRect(mx, my, Math.floor(logowidth * this.progress), 6 * dpr);
						ctx.strokeStyle = "black";
						ctx.strokeRect(mx, my, logowidth, 6 * dpr);
						ctx.strokeStyle = "white";
						ctx.strokeRect(mx - 1 * dpr, my - 1 * dpr, logowidth + 2 * dpr, 8 * dpr);
					}
					else if (this.loaderstyle === 2)
					{
						ctx.font = (this.isEjecta ? "12pt ArialMT" : "12pt Arial");
						ctx.fillStyle = anyImageHadError ? "#f00" : "#999";
						ctx.textBaseLine = "middle";
						var percent_text = Math.round(this.progress * 100) + "%";
						var text_dim = ctx.measureText ? ctx.measureText(percent_text) : null;
						var text_width = text_dim ? text_dim.width : 0;
						ctx.fillText(percent_text, mx - (text_width / 2), my);
					}
					this.last_progress = this.progress;
				}
				else if (this.loaderstyle === 4)
				{
					this.draw_c2_splash_loader(ctx);
					if (raf)
						raf(function() { self.go(); });
					else
						setTimeout(function() { self.go(); }, 16);
					return;
				}
			}
			setTimeout(function() { self.go(); }, (this.isCocoonJs ? 10 : 100));
		}
	};
	var splashStartTime = -1;
	var splashFadeInDuration = 300;
	var splashFadeOutDuration = 300;
	var splashAfterFadeOutWait = (typeof cr_is_preview === "undefined" ? 200 : 0);
	var splashIsFadeIn = true;
	var splashIsFadeOut = false;
	var splashFadeInFinish = 0;
	var splashFadeOutStart = 0;
	var splashMinDisplayTime = (typeof cr_is_preview === "undefined" ? 3000 : 0);
	var renderViaCanvas = null;
	var renderViaCtx = null;
	var splashFrameNumber = 0;
	function maybeCreateRenderViaCanvas(w, h)
	{
		if (!renderViaCanvas || renderViaCanvas.width !== w || renderViaCanvas.height !== h)
		{
			renderViaCanvas = document.createElement("canvas");
			renderViaCanvas.width = w;
			renderViaCanvas.height = h;
			renderViaCtx = renderViaCanvas.getContext("2d");
		}
	};
	function mipImage(arr, size)
	{
		if (size <= 128)
			return arr[3];
		else if (size <= 256)
			return arr[2];
		else if (size <= 512)
			return arr[1];
		else
			return arr[0];
	};
	Runtime.prototype.draw_c2_splash_loader = function(ctx)
	{
		if (isC2SplashDone)
			return;
		var w = Math.ceil(this.width);
		var h = Math.ceil(this.height);
		var dpr = this.devicePixelRatio;
		var logoimages = this.loaderlogos.logo;
		var poweredimages = this.loaderlogos.powered;
		var websiteimages = this.loaderlogos.website;
		for (var i = 0; i < 4; ++i)
		{
			if (!logoimages[i].complete || !poweredimages[i].complete || !websiteimages[i].complete)
				return;
		}
		if (splashFrameNumber === 0)
			splashStartTime = Date.now();
		var nowTime = Date.now();
		var isRenderingVia = false;
		var renderToCtx = ctx;
		var drawW, drawH;
		if (splashIsFadeIn || splashIsFadeOut)
		{
			ctx.clearRect(0, 0, w, h);
			maybeCreateRenderViaCanvas(w, h);
			renderToCtx = renderViaCtx;
			isRenderingVia = true;
			if (splashIsFadeIn && splashFrameNumber === 1)
				splashStartTime = Date.now();
		}
		else
		{
			ctx.globalAlpha = 1;
		}
		renderToCtx.fillStyle = "#333333";
		renderToCtx.fillRect(0, 0, w, h);
		if (this.cssHeight > 256)
		{
			drawW = cr.clamp(h * 0.22, 105, w * 0.6);
			drawH = drawW * 0.25;
			renderToCtx.drawImage(mipImage(poweredimages, drawW), w * 0.5 - drawW/2, h * 0.2 - drawH/2, drawW, drawH);
			drawW = Math.min(h * 0.395, w * 0.95);
			drawH = drawW;
			renderToCtx.drawImage(mipImage(logoimages, drawW), w * 0.5 - drawW/2, h * 0.485 - drawH/2, drawW, drawH);
			drawW = cr.clamp(h * 0.22, 105, w * 0.6);
			drawH = drawW * 0.25;
			renderToCtx.drawImage(mipImage(websiteimages, drawW), w * 0.5 - drawW/2, h * 0.868 - drawH/2, drawW, drawH);
			renderToCtx.fillStyle = "#3C3C3C";
			drawW = w;
			drawH = Math.max(h * 0.005, 2);
			renderToCtx.fillRect(0, h * 0.8 - drawH/2, drawW, drawH);
			renderToCtx.fillStyle = anyImageHadError ? "red" : "#E0FF65";
			drawW = w * this.progress;
			renderToCtx.fillRect(w * 0.5 - drawW/2, h * 0.8 - drawH/2, drawW, drawH);
		}
		else
		{
			drawW = h * 0.55;
			drawH = drawW;
			renderToCtx.drawImage(mipImage(logoimages, drawW), w * 0.5 - drawW/2, h * 0.45 - drawH/2, drawW, drawH);
			renderToCtx.fillStyle = "#3C3C3C";
			drawW = w;
			drawH = Math.max(h * 0.005, 2);
			renderToCtx.fillRect(0, h * 0.85 - drawH/2, drawW, drawH);
			renderToCtx.fillStyle = anyImageHadError ? "red" : "#E0FF65";
			drawW = w * this.progress;
			renderToCtx.fillRect(w * 0.5 - drawW/2, h * 0.85 - drawH/2, drawW, drawH);
		}
		if (isRenderingVia)
		{
			if (splashIsFadeIn)
			{
				if (splashFrameNumber === 0)
					ctx.globalAlpha = 0;
				else
					ctx.globalAlpha = Math.min((nowTime - splashStartTime) / splashFadeInDuration, 1);
			}
			else if (splashIsFadeOut)
			{
				ctx.globalAlpha = Math.max(1 - (nowTime - splashFadeOutStart) / splashFadeOutDuration, 0);
			}
			ctx.drawImage(renderViaCanvas, 0, 0, w, h);
		}
		if (splashIsFadeIn && nowTime - splashStartTime >= splashFadeInDuration && splashFrameNumber >= 2)
		{
			splashIsFadeIn = false;
			splashFadeInFinish = nowTime;
		}
		if (!splashIsFadeIn && nowTime - splashFadeInFinish >= splashMinDisplayTime && !splashIsFadeOut && this.progress >= 1)
		{
			splashIsFadeOut = true;
			splashFadeOutStart = nowTime;
		}
		if ((splashIsFadeOut && nowTime - splashFadeOutStart >= splashFadeOutDuration + splashAfterFadeOutWait) ||
			(typeof cr_is_preview !== "undefined" && this.progress >= 1 && Date.now() - splashStartTime < 500))
		{
			isC2SplashDone = true;
			splashIsFadeIn = false;
			splashIsFadeOut = false;
			renderViaCanvas = null;
			renderViaCtx = null;
			this.loaderlogos = null;
		}
		++splashFrameNumber;
	};
	Runtime.prototype.go_loading_finished = function ()
	{
		if (this.overlay_canvas)
		{
			this.canvas.parentNode.removeChild(this.overlay_canvas);
			this.overlay_ctx = null;
			this.overlay_canvas = null;
		}
		this.start_time = Date.now();
		this.last_fps_time = cr.performance_now();       // for counting framerate
		var i, len, t;
		if (this.uses_loader_layout)
		{
			for (i = 0, len = this.types_by_index.length; i < len; i++)
			{
				t = this.types_by_index[i];
				if (!t.is_family && !t.isOnLoaderLayout && t.plugin.is_world)
				{
					t.onCreate();
					cr.seal(t);
				}
			}
		}
		else
			this.isloading = false;
		for (i = 0, len = this.layouts_by_index.length; i < len; i++)
		{
			this.layouts_by_index[i].createGlobalNonWorlds();
		}
		if (this.fullscreen_mode >= 2)
		{
			var orig_aspect = this.original_width / this.original_height;
			var cur_aspect = this.width / this.height;
			if ((this.fullscreen_mode !== 2 && cur_aspect > orig_aspect) || (this.fullscreen_mode === 2 && cur_aspect < orig_aspect))
				this.aspect_scale = this.height / this.original_height;
			else
				this.aspect_scale = this.width / this.original_width;
		}
		if (this.first_layout)
			this.layouts[this.first_layout].startRunning();
		else
			this.layouts_by_index[0].startRunning();
;
		if (!this.uses_loader_layout)
		{
			this.loadingprogress = 1;
			this.trigger(cr.system_object.prototype.cnds.OnLoadFinished, null);
			if (window["C2_RegisterSW"])		// note not all platforms use SW
				window["C2_RegisterSW"]();
		}
		if (navigator["splashscreen"] && navigator["splashscreen"]["hide"])
			navigator["splashscreen"]["hide"]();
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			t = this.types_by_index[i];
			if (t.onAppBegin)
				t.onAppBegin();
		}
		if (document["hidden"] || document["webkitHidden"] || document["mozHidden"] || document["msHidden"])
		{
			window["cr_setSuspended"](true);		// stop rendering
		}
		else
		{
			this.tick(false);
		}
		if (this.isDirectCanvas)
			AppMobi["webview"]["execute"]("onGameReady();");
	};
	Runtime.prototype.tick = function (background_wake, timestamp, debug_step)
	{
		if (!this.running_layout)
			return;
		var nowtime = cr.performance_now();
		var logic_start = nowtime;
		if (!debug_step && this.isSuspended && !background_wake)
			return;
		if (!background_wake)
		{
			if (raf)
				this.raf_id = raf(this.tickFunc);
			else
			{
				this.timeout_id = setTimeout(this.tickFunc, this.isMobile ? 1 : 16);
			}
		}
		var raf_time = timestamp || nowtime;
		var fsmode = this.fullscreen_mode;
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || document["fullScreen"] || !!document["msFullscreenElement"]) && !this.isCordova;
		if ((isfullscreen || this.isNodeFullscreen) && this.fullscreen_scaling > 0)
			fsmode = this.fullscreen_scaling;
		if (fsmode > 0)	// r222: experimentally enabling this workaround for all platforms
		{
			var curwidth = window.innerWidth;
			var curheight = window.innerHeight;
			if (this.lastWindowWidth !== curwidth || this.lastWindowHeight !== curheight)
			{
				this["setSize"](curwidth, curheight);
			}
		}
		if (!this.isDomFree)
		{
			if (isfullscreen)
			{
				if (!this.firstInFullscreen)
				{
					this.fullscreenOldMarginCss = jQuery(this.canvas).css("margin") || "0";
					this.firstInFullscreen = true;
				}
				if (!this.isChrome && !this.isNWjs)
				{
					jQuery(this.canvas).css({
						"margin-left": "" + Math.floor((screen.width - (this.width / this.devicePixelRatio)) / 2) + "px",
						"margin-top": "" + Math.floor((screen.height - (this.height / this.devicePixelRatio)) / 2) + "px"
					});
				}
			}
			else
			{
				if (this.firstInFullscreen)
				{
					if (!this.isChrome && !this.isNWjs)
					{
						jQuery(this.canvas).css("margin", this.fullscreenOldMarginCss);
					}
					this.fullscreenOldMarginCss = "";
					this.firstInFullscreen = false;
					if (this.fullscreen_mode === 0)
					{
						this["setSize"](Math.round(this.oldWidth / this.devicePixelRatio), Math.round(this.oldHeight / this.devicePixelRatio), true);
					}
				}
				else
				{
					this.oldWidth = this.width;
					this.oldHeight = this.height;
				}
			}
		}
		if (this.isloading)
		{
			var done = this.areAllTexturesAndSoundsLoaded();		// updates this.progress
			this.loadingprogress = this.progress;
			if (done)
			{
				this.isloading = false;
				this.progress = 1;
				this.trigger(cr.system_object.prototype.cnds.OnLoadFinished, null);
				if (window["C2_RegisterSW"])
					window["C2_RegisterSW"]();
			}
		}
		this.logic(raf_time);
		if ((this.redraw || this.isCocoonJs) && !this.is_WebGL_context_lost && !this.suspendDrawing && !background_wake)
		{
			this.redraw = false;
			if (this.glwrap)
				this.drawGL();
			else
				this.draw();
			if (this.snapshotCanvas)
			{
				if (this.canvas && this.canvas.toDataURL)
				{
					this.snapshotData = this.canvas.toDataURL(this.snapshotCanvas[0], this.snapshotCanvas[1]);
					if (window["cr_onSnapshot"])
						window["cr_onSnapshot"](this.snapshotData);
					this.trigger(cr.system_object.prototype.cnds.OnCanvasSnapshot, null);
				}
				this.snapshotCanvas = null;
			}
		}
		if (!this.hit_breakpoint)
		{
			this.tickcount++;
			this.execcount++;
			this.framecount++;
		}
		this.logictime += cr.performance_now() - logic_start;
	};
	Runtime.prototype.logic = function (cur_time)
	{
		var i, leni, j, lenj, k, lenk, type, inst, binst;
		if (cur_time - this.last_fps_time >= 1000)  // every 1 second
		{
			this.last_fps_time += 1000;
			if (cur_time - this.last_fps_time >= 1000)
				this.last_fps_time = cur_time;
			this.fps = this.framecount;
			this.framecount = 0;
			this.cpuutilisation = this.logictime;
			this.logictime = 0;
		}
		var wallDt = 0;
		if (this.last_tick_time !== 0)
		{
			var ms_diff = cur_time - this.last_tick_time;
			if (ms_diff < 0)
				ms_diff = 0;
			wallDt = ms_diff / 1000.0; // dt measured in seconds
			this.dt1 = wallDt;
			if (this.dt1 > 0.5)
				this.dt1 = 0;
			else if (this.dt1 > 1 / this.minimumFramerate)
				this.dt1 = 1 / this.minimumFramerate;
		}
		this.last_tick_time = cur_time;
        this.dt = this.dt1 * this.timescale;
        this.kahanTime.add(this.dt);
		this.wallTime.add(wallDt);		// prevent min/max framerate affecting wall clock
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || document["fullScreen"] || !!document["msFullscreenElement"] || this.isNodeFullscreen) && !this.isCordova;
		if (this.fullscreen_mode >= 2 /* scale */ || (isfullscreen && this.fullscreen_scaling > 0))
		{
			var orig_aspect = this.original_width / this.original_height;
			var cur_aspect = this.width / this.height;
			var mode = this.fullscreen_mode;
			if (isfullscreen && this.fullscreen_scaling > 0)
				mode = this.fullscreen_scaling;
			if ((mode !== 2 && cur_aspect > orig_aspect) || (mode === 2 && cur_aspect < orig_aspect))
			{
				this.aspect_scale = this.height / this.original_height;
			}
			else
			{
				this.aspect_scale = this.width / this.original_width;
			}
			if (this.running_layout)
			{
				this.running_layout.scrollToX(this.running_layout.scrollX);
				this.running_layout.scrollToY(this.running_layout.scrollY);
			}
		}
		else
			this.aspect_scale = (this.isRetina ? this.devicePixelRatio : 1);
		this.ClearDeathRow();
		this.isInOnDestroy++;
		this.system.runWaits();		// prevent instance list changing
		this.isInOnDestroy--;
		this.ClearDeathRow();		// allow instance list changing
		this.isInOnDestroy++;
        var tickarr = this.objects_to_pretick.valuesRef();
        for (i = 0, leni = tickarr.length; i < leni; i++)
            tickarr[i].pretick();
		for (i = 0, leni = this.types_by_index.length; i < leni; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || (!type.behaviors.length && !type.families.length))
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
				{
					inst.behavior_insts[k].tick();
				}
			}
		}
		for (i = 0, leni = this.types_by_index.length; i < leni; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || (!type.behaviors.length && !type.families.length))
				continue;	// type doesn't have any behaviors
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
				{
					binst = inst.behavior_insts[k];
					if (binst.posttick)
						binst.posttick();
				}
			}
		}
        tickarr = this.objects_to_tick.valuesRef();
        for (i = 0, leni = tickarr.length; i < leni; i++)
            tickarr[i].tick();
		this.isInOnDestroy--;		// end preventing instance lists from being changed
		this.handleSaveLoad();		// save/load now if queued
		i = 0;
		while (this.changelayout && i++ < 10)
		{
			this.doChangeLayout(this.changelayout);
		}
        for (i = 0, leni = this.eventsheets_by_index.length; i < leni; i++)
            this.eventsheets_by_index[i].hasRun = false;
		if (this.running_layout.event_sheet)
			this.running_layout.event_sheet.run();
		cr.clearArray(this.registered_collisions);
		this.layout_first_tick = false;
		this.isInOnDestroy++;		// prevent instance lists from being changed
		for (i = 0, leni = this.types_by_index.length; i < leni; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || (!type.behaviors.length && !type.families.length))
				continue;	// type doesn't have any behaviors
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				var inst = type.instances[j];
				for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
				{
					binst = inst.behavior_insts[k];
					if (binst.tick2)
						binst.tick2();
				}
			}
		}
        tickarr = this.objects_to_tick2.valuesRef();
        for (i = 0, leni = tickarr.length; i < leni; i++)
            tickarr[i].tick2();
		this.isInOnDestroy--;		// end preventing instance lists from being changed
	};
	Runtime.prototype.onWindowBlur = function ()
	{
		var i, leni, j, lenj, k, lenk, type, inst, binst;
		for (i = 0, leni = this.types_by_index.length; i < leni; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family)
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				if (inst.onWindowBlur)
					inst.onWindowBlur();
				if (!inst.behavior_insts)
					continue;	// single-globals don't have behavior_insts
				for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
				{
					binst = inst.behavior_insts[k];
					if (binst.onWindowBlur)
						binst.onWindowBlur();
				}
			}
		}
	};
	Runtime.prototype.doChangeLayout = function (changeToLayout)
	{
		var prev_layout = this.running_layout;
		this.running_layout.stopRunning();
		var i, len, j, lenj, k, lenk, type, inst, binst;
		if (this.glwrap)
		{
			for (i = 0, len = this.types_by_index.length; i < len; i++)
			{
				type = this.types_by_index[i];
				if (type.is_family)
					continue;
				if (type.unloadTextures && (!type.global || type.instances.length === 0) && changeToLayout.initial_types.indexOf(type) === -1)
				{
					type.unloadTextures();
				}
			}
		}
		if (prev_layout == changeToLayout)
			cr.clearArray(this.system.waits);
		cr.clearArray(this.registered_collisions);
		this.runLayoutChangeMethods(true);
		changeToLayout.startRunning();
		this.runLayoutChangeMethods(false);
		this.redraw = true;
		this.layout_first_tick = true;
		this.ClearDeathRow();
	};
	Runtime.prototype.runLayoutChangeMethods = function (isBeforeChange)
	{
		var i, len, beh, type, j, lenj, inst, k, lenk, binst;
		for (i = 0, len = this.behaviors.length; i < len; i++)
		{
			beh = this.behaviors[i];
			if (isBeforeChange)
			{
				if (beh.onBeforeLayoutChange)
					beh.onBeforeLayoutChange();
			}
			else
			{
				if (beh.onLayoutChange)
					beh.onLayoutChange();
			}
		}
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			type = this.types_by_index[i];
			if (!type.global && !type.plugin.singleglobal)
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				if (isBeforeChange)
				{
					if (inst.onBeforeLayoutChange)
						inst.onBeforeLayoutChange();
				}
				else
				{
					if (inst.onLayoutChange)
						inst.onLayoutChange();
				}
				if (inst.behavior_insts)
				{
					for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
					{
						binst = inst.behavior_insts[k];
						if (isBeforeChange)
						{
							if (binst.onBeforeLayoutChange)
								binst.onBeforeLayoutChange();
						}
						else
						{
							if (binst.onLayoutChange)
								binst.onLayoutChange();
						}
					}
				}
			}
		}
	};
	Runtime.prototype.pretickMe = function (inst)
    {
        this.objects_to_pretick.add(inst);
    };
	Runtime.prototype.unpretickMe = function (inst)
	{
		this.objects_to_pretick.remove(inst);
	};
    Runtime.prototype.tickMe = function (inst)
    {
        this.objects_to_tick.add(inst);
    };
	Runtime.prototype.untickMe = function (inst)
	{
		this.objects_to_tick.remove(inst);
	};
	Runtime.prototype.tick2Me = function (inst)
    {
        this.objects_to_tick2.add(inst);
    };
	Runtime.prototype.untick2Me = function (inst)
	{
		this.objects_to_tick2.remove(inst);
	};
    Runtime.prototype.getDt = function (inst)
    {
        if (!inst || inst.my_timescale === -1.0)
            return this.dt;
        return this.dt1 * inst.my_timescale;
    };
	Runtime.prototype.draw = function ()
	{
		this.running_layout.draw(this.ctx);
		if (this.isDirectCanvas)
			this.ctx["present"]();
	};
	Runtime.prototype.drawGL = function ()
	{
		if (this.enableFrontToBack)
		{
			this.earlyz_index = 1;		// start from front, 1-based to avoid exactly equalling near plane Z value
			this.running_layout.drawGL_earlyZPass(this.glwrap);
		}
		this.running_layout.drawGL(this.glwrap);
		this.glwrap.present();
	};
	Runtime.prototype.addDestroyCallback = function (f)
	{
		if (f)
			this.destroycallbacks.push(f);
	};
	Runtime.prototype.removeDestroyCallback = function (f)
	{
		cr.arrayFindRemove(this.destroycallbacks, f);
	};
	Runtime.prototype.getObjectByUID = function (uid_)
	{
;
		var uidstr = uid_.toString();
		if (this.objectsByUid.hasOwnProperty(uidstr))
			return this.objectsByUid[uidstr];
		else
			return null;
	};
	var objectset_cache = [];
	function alloc_objectset()
	{
		if (objectset_cache.length)
			return objectset_cache.pop();
		else
			return new cr.ObjectSet();
	};
	function free_objectset(s)
	{
		s.clear();
		objectset_cache.push(s);
	};
	Runtime.prototype.DestroyInstance = function (inst)
	{
		var i, len;
		var type = inst.type;
		var typename = type.name;
		var has_typename = this.deathRow.hasOwnProperty(typename);
		var obj_set = null;
		if (has_typename)
		{
			obj_set = this.deathRow[typename];
			if (obj_set.contains(inst))
				return;		// already had DestroyInstance called
		}
		else
		{
			obj_set = alloc_objectset();
			this.deathRow[typename] = obj_set;
		}
		obj_set.add(inst);
		this.hasPendingInstances = true;
		if (inst.is_contained)
		{
			for (i = 0, len = inst.siblings.length; i < len; i++)
			{
				this.DestroyInstance(inst.siblings[i]);
			}
		}
		if (this.isInClearDeathRow)
			obj_set.values_cache.push(inst);
		if (!this.isEndingLayout)
		{
			this.isInOnDestroy++;		// support recursion
			this.trigger(Object.getPrototypeOf(inst.type.plugin).cnds.OnDestroyed, inst);
			this.isInOnDestroy--;
		}
	};
	Runtime.prototype.ClearDeathRow = function ()
	{
		if (!this.hasPendingInstances)
			return;
		var inst, type, instances;
		var i, j, leni, lenj, obj_set;
		this.isInClearDeathRow = true;
		for (i = 0, leni = this.createRow.length; i < leni; ++i)
		{
			inst = this.createRow[i];
			type = inst.type;
			type.instances.push(inst);
			for (j = 0, lenj = type.families.length; j < lenj; ++j)
			{
				type.families[j].instances.push(inst);
				type.families[j].stale_iids = true;
			}
		}
		cr.clearArray(this.createRow);
		this.IterateDeathRow();		// moved to separate function so for-in performance doesn't hobble entire function
		cr.wipe(this.deathRow);		// all objectsets have already been recycled
		this.isInClearDeathRow = false;
		this.hasPendingInstances = false;
	};
	Runtime.prototype.IterateDeathRow = function ()
	{
		for (var p in this.deathRow)
		{
			if (this.deathRow.hasOwnProperty(p))
			{
				this.ClearDeathRowForType(this.deathRow[p]);
			}
		}
	};
	Runtime.prototype.ClearDeathRowForType = function (obj_set)
	{
		var arr = obj_set.valuesRef();			// get array of items from set
;
		var type = arr[0].type;
;
;
		var i, len, j, lenj, w, f, layer_instances, inst;
		cr.arrayRemoveAllFromObjectSet(type.instances, obj_set);
		type.stale_iids = true;
		if (type.instances.length === 0)
			type.any_instance_parallaxed = false;
		for (i = 0, len = type.families.length; i < len; ++i)
		{
			f = type.families[i];
			cr.arrayRemoveAllFromObjectSet(f.instances, obj_set);
			f.stale_iids = true;
		}
		for (i = 0, len = this.system.waits.length; i < len; ++i)
		{
			w = this.system.waits[i];
			if (w.sols.hasOwnProperty(type.index))
				cr.arrayRemoveAllFromObjectSet(w.sols[type.index].insts, obj_set);
			if (!type.is_family)
			{
				for (j = 0, lenj = type.families.length; j < lenj; ++j)
				{
					f = type.families[j];
					if (w.sols.hasOwnProperty(f.index))
						cr.arrayRemoveAllFromObjectSet(w.sols[f.index].insts, obj_set);
				}
			}
		}
		var first_layer = arr[0].layer;
		if (first_layer)
		{
			if (first_layer.useRenderCells)
			{
				layer_instances = first_layer.instances;
				for (i = 0, len = layer_instances.length; i < len; ++i)
				{
					inst = layer_instances[i];
					if (!obj_set.contains(inst))
						continue;		// not destroying this instance
					inst.update_bbox();
					first_layer.render_grid.update(inst, inst.rendercells, null);
					inst.rendercells.set(0, 0, -1, -1);
				}
			}
			cr.arrayRemoveAllFromObjectSet(first_layer.instances, obj_set);
			first_layer.setZIndicesStaleFrom(0);
		}
		for (i = 0; i < arr.length; ++i)		// check array length every time in case it changes
		{
			this.ClearDeathRowForSingleInstance(arr[i], type);
		}
		free_objectset(obj_set);
		this.redraw = true;
	};
	Runtime.prototype.ClearDeathRowForSingleInstance = function (inst, type)
	{
		var i, len, binst;
		for (i = 0, len = this.destroycallbacks.length; i < len; ++i)
			this.destroycallbacks[i](inst);
		if (inst.collcells)
		{
			type.collision_grid.update(inst, inst.collcells, null);
		}
		var layer = inst.layer;
		if (layer)
		{
			layer.removeFromInstanceList(inst, true);		// remove from both instance list and render grid
		}
		if (inst.behavior_insts)
		{
			for (i = 0, len = inst.behavior_insts.length; i < len; ++i)
			{
				binst = inst.behavior_insts[i];
				if (binst.onDestroy)
					binst.onDestroy();
				binst.behavior.my_instances.remove(inst);
			}
		}
		this.objects_to_pretick.remove(inst);
		this.objects_to_tick.remove(inst);
		this.objects_to_tick2.remove(inst);
		if (inst.onDestroy)
			inst.onDestroy();
		if (this.objectsByUid.hasOwnProperty(inst.uid.toString()))
			delete this.objectsByUid[inst.uid.toString()];
		this.objectcount--;
		if (type.deadCache.length < 100)
			type.deadCache.push(inst);
	};
	Runtime.prototype.createInstance = function (type, layer, sx, sy)
	{
		if (type.is_family)
		{
			var i = cr.floor(Math.random() * type.members.length);
			return this.createInstance(type.members[i], layer, sx, sy);
		}
		if (!type.default_instance)
		{
			return null;
		}
		return this.createInstanceFromInit(type.default_instance, layer, false, sx, sy, false);
	};
	var all_behaviors = [];
	Runtime.prototype.createInstanceFromInit = function (initial_inst, layer, is_startup_instance, sx, sy, skip_siblings)
	{
		var i, len, j, lenj, p, effect_fallback, x, y;
		if (!initial_inst)
			return null;
		var type = this.types_by_index[initial_inst[1]];
;
;
		var is_world = type.plugin.is_world;
;
		if (this.isloading && is_world && !type.isOnLoaderLayout)
			return null;
		if (is_world && !this.glwrap && initial_inst[0][11] === 11)
			return null;
		var original_layer = layer;
		if (!is_world)
			layer = null;
		var inst;
		if (type.deadCache.length)
		{
			inst = type.deadCache.pop();
			inst.recycled = true;
			type.plugin.Instance.call(inst, type);
		}
		else
		{
			inst = new type.plugin.Instance(type);
			inst.recycled = false;
		}
		if (is_startup_instance && !skip_siblings && !this.objectsByUid.hasOwnProperty(initial_inst[2].toString()))
			inst.uid = initial_inst[2];
		else
			inst.uid = this.next_uid++;
		this.objectsByUid[inst.uid.toString()] = inst;
		inst.puid = this.next_puid++;
		inst.iid = type.instances.length;
		for (i = 0, len = this.createRow.length; i < len; ++i)
		{
			if (this.createRow[i].type === type)
				inst.iid++;
		}
		inst.get_iid = cr.inst_get_iid;
		inst.toString = cr.inst_toString;
		var initial_vars = initial_inst[3];
		if (inst.recycled)
		{
			cr.wipe(inst.extra);
		}
		else
		{
			inst.extra = {};
			if (typeof cr_is_preview !== "undefined")
			{
				inst.instance_var_names = [];
				inst.instance_var_names.length = initial_vars.length;
				for (i = 0, len = initial_vars.length; i < len; i++)
					inst.instance_var_names[i] = initial_vars[i][1];
			}
			inst.instance_vars = [];
			inst.instance_vars.length = initial_vars.length;
		}
		for (i = 0, len = initial_vars.length; i < len; i++)
			inst.instance_vars[i] = initial_vars[i][0];
		if (is_world)
		{
			var wm = initial_inst[0];
;
			inst.x = cr.is_undefined(sx) ? wm[0] : sx;
			inst.y = cr.is_undefined(sy) ? wm[1] : sy;
			inst.z = wm[2];
			inst.width = wm[3];
			inst.height = wm[4];
			inst.depth = wm[5];
			inst.angle = wm[6];
			inst.opacity = wm[7];
			inst.hotspotX = wm[8];
			inst.hotspotY = wm[9];
			inst.blend_mode = wm[10];
			effect_fallback = wm[11];
			if (!this.glwrap && type.effect_types.length)	// no WebGL renderer and shaders used
				inst.blend_mode = effect_fallback;			// use fallback blend mode - destroy mode was handled above
			inst.compositeOp = cr.effectToCompositeOp(inst.blend_mode);
			if (this.gl)
				cr.setGLBlend(inst, inst.blend_mode, this.gl);
			if (inst.recycled)
			{
				for (i = 0, len = wm[12].length; i < len; i++)
				{
					for (j = 0, lenj = wm[12][i].length; j < lenj; j++)
						inst.effect_params[i][j] = wm[12][i][j];
				}
				inst.bbox.set(0, 0, 0, 0);
				inst.collcells.set(0, 0, -1, -1);
				inst.rendercells.set(0, 0, -1, -1);
				inst.bquad.set_from_rect(inst.bbox);
				cr.clearArray(inst.bbox_changed_callbacks);
			}
			else
			{
				inst.effect_params = wm[12].slice(0);
				for (i = 0, len = inst.effect_params.length; i < len; i++)
					inst.effect_params[i] = wm[12][i].slice(0);
				inst.active_effect_types = [];
				inst.active_effect_flags = [];
				inst.active_effect_flags.length = type.effect_types.length;
				inst.bbox = new cr.rect(0, 0, 0, 0);
				inst.collcells = new cr.rect(0, 0, -1, -1);
				inst.rendercells = new cr.rect(0, 0, -1, -1);
				inst.bquad = new cr.quad();
				inst.bbox_changed_callbacks = [];
				inst.set_bbox_changed = cr.set_bbox_changed;
				inst.add_bbox_changed_callback = cr.add_bbox_changed_callback;
				inst.contains_pt = cr.inst_contains_pt;
				inst.update_bbox = cr.update_bbox;
				inst.update_render_cell = cr.update_render_cell;
				inst.update_collision_cell = cr.update_collision_cell;
				inst.get_zindex = cr.inst_get_zindex;
			}
			inst.tilemap_exists = false;
			inst.tilemap_width = 0;
			inst.tilemap_height = 0;
			inst.tilemap_data = null;
			if (wm.length === 14)
			{
				inst.tilemap_exists = true;
				inst.tilemap_width = wm[13][0];
				inst.tilemap_height = wm[13][1];
				inst.tilemap_data = wm[13][2];
			}
			for (i = 0, len = type.effect_types.length; i < len; i++)
				inst.active_effect_flags[i] = true;
			inst.shaders_preserve_opaqueness = true;
			inst.updateActiveEffects = cr.inst_updateActiveEffects;
			inst.updateActiveEffects();
			inst.uses_shaders = !!inst.active_effect_types.length;
			inst.bbox_changed = true;
			inst.cell_changed = true;
			type.any_cell_changed = true;
			inst.visible = true;
            inst.my_timescale = -1.0;
			inst.layer = layer;
			inst.zindex = layer.instances.length;	// will be placed at top of current layer
			inst.earlyz_index = 0;
			if (typeof inst.collision_poly === "undefined")
				inst.collision_poly = null;
			inst.collisionsEnabled = true;
			this.redraw = true;
		}
		var initial_props, binst;
		cr.clearArray(all_behaviors);
		for (i = 0, len = type.families.length; i < len; i++)
		{
			all_behaviors.push.apply(all_behaviors, type.families[i].behaviors);
		}
		all_behaviors.push.apply(all_behaviors, type.behaviors);
		if (inst.recycled)
		{
			for (i = 0, len = all_behaviors.length; i < len; i++)
			{
				var btype = all_behaviors[i];
				binst = inst.behavior_insts[i];
				binst.recycled = true;
				btype.behavior.Instance.call(binst, btype, inst);
				initial_props = initial_inst[4][i];
				for (j = 0, lenj = initial_props.length; j < lenj; j++)
					binst.properties[j] = initial_props[j];
				binst.onCreate();
				btype.behavior.my_instances.add(inst);
			}
		}
		else
		{
			inst.behavior_insts = [];
			for (i = 0, len = all_behaviors.length; i < len; i++)
			{
				var btype = all_behaviors[i];
				var binst = new btype.behavior.Instance(btype, inst);
				binst.recycled = false;
				binst.properties = initial_inst[4][i].slice(0);
				binst.onCreate();
				cr.seal(binst);
				inst.behavior_insts.push(binst);
				btype.behavior.my_instances.add(inst);
			}
		}
		initial_props = initial_inst[5];
		if (inst.recycled)
		{
			for (i = 0, len = initial_props.length; i < len; i++)
				inst.properties[i] = initial_props[i];
		}
		else
			inst.properties = initial_props.slice(0);
		this.createRow.push(inst);
		this.hasPendingInstances = true;
		if (layer)
		{
;
			layer.appendToInstanceList(inst, true);
			if (layer.parallaxX !== 1 || layer.parallaxY !== 1)
				type.any_instance_parallaxed = true;
		}
		this.objectcount++;
		if (type.is_contained)
		{
			inst.is_contained = true;
			if (inst.recycled)
				cr.clearArray(inst.siblings);
			else
				inst.siblings = [];			// note: should not include self in siblings
			if (!is_startup_instance && !skip_siblings)	// layout links initial instances
			{
				for (i = 0, len = type.container.length; i < len; i++)
				{
					if (type.container[i] === type)
						continue;
					if (!type.container[i].default_instance)
					{
						return null;
					}
					inst.siblings.push(this.createInstanceFromInit(type.container[i].default_instance, original_layer, false, is_world ? inst.x : sx, is_world ? inst.y : sy, true));
				}
				for (i = 0, len = inst.siblings.length; i < len; i++)
				{
					inst.siblings[i].siblings.push(inst);
					for (j = 0; j < len; j++)
					{
						if (i !== j)
							inst.siblings[i].siblings.push(inst.siblings[j]);
					}
				}
			}
		}
		else
		{
			inst.is_contained = false;
			inst.siblings = null;
		}
		inst.onCreate();
		if (!inst.recycled)
			cr.seal(inst);
		for (i = 0, len = inst.behavior_insts.length; i < len; i++)
		{
			if (inst.behavior_insts[i].postCreate)
				inst.behavior_insts[i].postCreate();
		}
		return inst;
	};
	Runtime.prototype.getLayerByName = function (layer_name)
	{
		var i, len;
		for (i = 0, len = this.running_layout.layers.length; i < len; i++)
		{
			var layer = this.running_layout.layers[i];
			if (cr.equals_nocase(layer.name, layer_name))
				return layer;
		}
		return null;
	};
	Runtime.prototype.getLayerByNumber = function (index)
	{
		index = cr.floor(index);
		if (index < 0)
			index = 0;
		if (index >= this.running_layout.layers.length)
			index = this.running_layout.layers.length - 1;
		return this.running_layout.layers[index];
	};
	Runtime.prototype.getLayer = function (l)
	{
		if (cr.is_number(l))
			return this.getLayerByNumber(l);
		else
			return this.getLayerByName(l.toString());
	};
	Runtime.prototype.clearSol = function (solModifiers)
	{
		var i, len;
		for (i = 0, len = solModifiers.length; i < len; i++)
		{
			solModifiers[i].getCurrentSol().select_all = true;
		}
	};
	Runtime.prototype.pushCleanSol = function (solModifiers)
	{
		var i, len;
		for (i = 0, len = solModifiers.length; i < len; i++)
		{
			solModifiers[i].pushCleanSol();
		}
	};
	Runtime.prototype.pushCopySol = function (solModifiers)
	{
		var i, len;
		for (i = 0, len = solModifiers.length; i < len; i++)
		{
			solModifiers[i].pushCopySol();
		}
	};
	Runtime.prototype.popSol = function (solModifiers)
	{
		var i, len;
		for (i = 0, len = solModifiers.length; i < len; i++)
		{
			solModifiers[i].popSol();
		}
	};
	Runtime.prototype.updateAllCells = function (type)
	{
		if (!type.any_cell_changed)
			return;		// all instances must already be up-to-date
		var i, len, instances = type.instances;
		for (i = 0, len = instances.length; i < len; ++i)
		{
			instances[i].update_collision_cell();
		}
		var createRow = this.createRow;
		for (i = 0, len = createRow.length; i < len; ++i)
		{
			if (createRow[i].type === type)
				createRow[i].update_collision_cell();
		}
		type.any_cell_changed = false;
	};
	Runtime.prototype.getCollisionCandidates = function (layer, rtype, bbox, candidates)
	{
		var i, len, t;
		var is_parallaxed = (layer ? (layer.parallaxX !== 1 || layer.parallaxY !== 1) : false);
		if (rtype.is_family)
		{
			for (i = 0, len = rtype.members.length; i < len; ++i)
			{
				t = rtype.members[i];
				if (is_parallaxed || t.any_instance_parallaxed)
				{
					cr.appendArray(candidates, t.instances);
				}
				else
				{
					this.updateAllCells(t);
					t.collision_grid.queryRange(bbox, candidates);
				}
			}
		}
		else
		{
			if (is_parallaxed || rtype.any_instance_parallaxed)
			{
				cr.appendArray(candidates, rtype.instances);
			}
			else
			{
				this.updateAllCells(rtype);
				rtype.collision_grid.queryRange(bbox, candidates);
			}
		}
	};
	Runtime.prototype.getTypesCollisionCandidates = function (layer, types, bbox, candidates)
	{
		var i, len;
		for (i = 0, len = types.length; i < len; ++i)
		{
			this.getCollisionCandidates(layer, types[i], bbox, candidates);
		}
	};
	Runtime.prototype.getSolidCollisionCandidates = function (layer, bbox, candidates)
	{
		var solid = this.getSolidBehavior();
		if (!solid)
			return null;
		this.getTypesCollisionCandidates(layer, solid.my_types, bbox, candidates);
	};
	Runtime.prototype.getJumpthruCollisionCandidates = function (layer, bbox, candidates)
	{
		var jumpthru = this.getJumpthruBehavior();
		if (!jumpthru)
			return null;
		this.getTypesCollisionCandidates(layer, jumpthru.my_types, bbox, candidates);
	};
	Runtime.prototype.testAndSelectCanvasPointOverlap = function (type, ptx, pty, inverted)
	{
		var sol = type.getCurrentSol();
		var i, j, inst, len;
		var orblock = this.getCurrentEventStack().current_event.orblock;
		var lx, ly, arr;
		if (sol.select_all)
		{
			if (!inverted)
			{
				sol.select_all = false;
				cr.clearArray(sol.instances);   // clear contents
			}
			for (i = 0, len = type.instances.length; i < len; i++)
			{
				inst = type.instances[i];
				inst.update_bbox();
				lx = inst.layer.canvasToLayer(ptx, pty, true);
				ly = inst.layer.canvasToLayer(ptx, pty, false);
				if (inst.contains_pt(lx, ly))
				{
					if (inverted)
						return false;
					else
						sol.instances.push(inst);
				}
				else if (orblock)
					sol.else_instances.push(inst);
			}
		}
		else
		{
			j = 0;
			arr = (orblock ? sol.else_instances : sol.instances);
			for (i = 0, len = arr.length; i < len; i++)
			{
				inst = arr[i];
				inst.update_bbox();
				lx = inst.layer.canvasToLayer(ptx, pty, true);
				ly = inst.layer.canvasToLayer(ptx, pty, false);
				if (inst.contains_pt(lx, ly))
				{
					if (inverted)
						return false;
					else if (orblock)
						sol.instances.push(inst);
					else
					{
						sol.instances[j] = sol.instances[i];
						j++;
					}
				}
			}
			if (!inverted)
				arr.length = j;
		}
		type.applySolToContainer();
		if (inverted)
			return true;		// did not find anything overlapping
		else
			return sol.hasObjects();
	};
	Runtime.prototype.testOverlap = function (a, b)
	{
		if (!a || !b || a === b || !a.collisionsEnabled || !b.collisionsEnabled)
			return false;
		a.update_bbox();
		b.update_bbox();
		var layera = a.layer;
		var layerb = b.layer;
		var different_layers = (layera !== layerb && (layera.parallaxX !== layerb.parallaxX || layerb.parallaxY !== layerb.parallaxY || layera.scale !== layerb.scale || layera.angle !== layerb.angle || layera.zoomRate !== layerb.zoomRate));
		var i, len, i2, i21, x, y, haspolya, haspolyb, polya, polyb;
		if (!different_layers)	// same layers: easy check
		{
			if (!a.bbox.intersects_rect(b.bbox))
				return false;
			if (!a.bquad.intersects_quad(b.bquad))
				return false;
			if (a.tilemap_exists && b.tilemap_exists)
				return false;
			if (a.tilemap_exists)
				return this.testTilemapOverlap(a, b);
			if (b.tilemap_exists)
				return this.testTilemapOverlap(b, a);
			haspolya = (a.collision_poly && !a.collision_poly.is_empty());
			haspolyb = (b.collision_poly && !b.collision_poly.is_empty());
			if (!haspolya && !haspolyb)
				return true;
			if (haspolya)
			{
				a.collision_poly.cache_poly(a.width, a.height, a.angle);
				polya = a.collision_poly;
			}
			else
			{
				this.temp_poly.set_from_quad(a.bquad, a.x, a.y, a.width, a.height);
				polya = this.temp_poly;
			}
			if (haspolyb)
			{
				b.collision_poly.cache_poly(b.width, b.height, b.angle);
				polyb = b.collision_poly;
			}
			else
			{
				this.temp_poly.set_from_quad(b.bquad, b.x, b.y, b.width, b.height);
				polyb = this.temp_poly;
			}
			return polya.intersects_poly(polyb, b.x - a.x, b.y - a.y);
		}
		else	// different layers: need to do full translated check
		{
			haspolya = (a.collision_poly && !a.collision_poly.is_empty());
			haspolyb = (b.collision_poly && !b.collision_poly.is_empty());
			if (haspolya)
			{
				a.collision_poly.cache_poly(a.width, a.height, a.angle);
				this.temp_poly.set_from_poly(a.collision_poly);
			}
			else
			{
				this.temp_poly.set_from_quad(a.bquad, a.x, a.y, a.width, a.height);
			}
			polya = this.temp_poly;
			if (haspolyb)
			{
				b.collision_poly.cache_poly(b.width, b.height, b.angle);
				this.temp_poly2.set_from_poly(b.collision_poly);
			}
			else
			{
				this.temp_poly2.set_from_quad(b.bquad, b.x, b.y, b.width, b.height);
			}
			polyb = this.temp_poly2;
			for (i = 0, len = polya.pts_count; i < len; i++)
			{
				i2 = i * 2;
				i21 = i2 + 1;
				x = polya.pts_cache[i2];
				y = polya.pts_cache[i21];
				polya.pts_cache[i2] = layera.layerToCanvas(x + a.x, y + a.y, true);
				polya.pts_cache[i21] = layera.layerToCanvas(x + a.x, y + a.y, false);
			}
			polya.update_bbox();
			for (i = 0, len = polyb.pts_count; i < len; i++)
			{
				i2 = i * 2;
				i21 = i2 + 1;
				x = polyb.pts_cache[i2];
				y = polyb.pts_cache[i21];
				polyb.pts_cache[i2] = layerb.layerToCanvas(x + b.x, y + b.y, true);
				polyb.pts_cache[i21] = layerb.layerToCanvas(x + b.x, y + b.y, false);
			}
			polyb.update_bbox();
			return polya.intersects_poly(polyb, 0, 0);
		}
	};
	var tmpQuad = new cr.quad();
	var tmpRect = new cr.rect(0, 0, 0, 0);
	var collrect_candidates = [];
	Runtime.prototype.testTilemapOverlap = function (tm, a)
	{
		var i, len, c, rc;
		var bbox = a.bbox;
		var tmx = tm.x;
		var tmy = tm.y;
		tm.getCollisionRectCandidates(bbox, collrect_candidates);
		var collrects = collrect_candidates;
		var haspolya = (a.collision_poly && !a.collision_poly.is_empty());
		for (i = 0, len = collrects.length; i < len; ++i)
		{
			c = collrects[i];
			rc = c.rc;
			if (bbox.intersects_rect_off(rc, tmx, tmy))
			{
				tmpQuad.set_from_rect(rc);
				tmpQuad.offset(tmx, tmy);
				if (tmpQuad.intersects_quad(a.bquad))
				{
					if (haspolya)
					{
						a.collision_poly.cache_poly(a.width, a.height, a.angle);
						if (c.poly)
						{
							if (c.poly.intersects_poly(a.collision_poly, a.x - (tmx + rc.left), a.y - (tmy + rc.top)))
							{
								cr.clearArray(collrect_candidates);
								return true;
							}
						}
						else
						{
							this.temp_poly.set_from_quad(tmpQuad, 0, 0, rc.right - rc.left, rc.bottom - rc.top);
							if (this.temp_poly.intersects_poly(a.collision_poly, a.x, a.y))
							{
								cr.clearArray(collrect_candidates);
								return true;
							}
						}
					}
					else
					{
						if (c.poly)
						{
							this.temp_poly.set_from_quad(a.bquad, 0, 0, a.width, a.height);
							if (c.poly.intersects_poly(this.temp_poly, -(tmx + rc.left), -(tmy + rc.top)))
							{
								cr.clearArray(collrect_candidates);
								return true;
							}
						}
						else
						{
							cr.clearArray(collrect_candidates);
							return true;
						}
					}
				}
			}
		}
		cr.clearArray(collrect_candidates);
		return false;
	};
	Runtime.prototype.testRectOverlap = function (r, b)
	{
		if (!b || !b.collisionsEnabled)
			return false;
		b.update_bbox();
		var layerb = b.layer;
		var haspolyb, polyb;
		if (!b.bbox.intersects_rect(r))
			return false;
		if (b.tilemap_exists)
		{
			b.getCollisionRectCandidates(r, collrect_candidates);
			var collrects = collrect_candidates;
			var i, len, c, tilerc;
			var tmx = b.x;
			var tmy = b.y;
			for (i = 0, len = collrects.length; i < len; ++i)
			{
				c = collrects[i];
				tilerc = c.rc;
				if (r.intersects_rect_off(tilerc, tmx, tmy))
				{
					if (c.poly)
					{
						this.temp_poly.set_from_rect(r, 0, 0);
						if (c.poly.intersects_poly(this.temp_poly, -(tmx + tilerc.left), -(tmy + tilerc.top)))
						{
							cr.clearArray(collrect_candidates);
							return true;
						}
					}
					else
					{
						cr.clearArray(collrect_candidates);
						return true;
					}
				}
			}
			cr.clearArray(collrect_candidates);
			return false;
		}
		else
		{
			tmpQuad.set_from_rect(r);
			if (!b.bquad.intersects_quad(tmpQuad))
				return false;
			haspolyb = (b.collision_poly && !b.collision_poly.is_empty());
			if (!haspolyb)
				return true;
			b.collision_poly.cache_poly(b.width, b.height, b.angle);
			tmpQuad.offset(-r.left, -r.top);
			this.temp_poly.set_from_quad(tmpQuad, 0, 0, 1, 1);
			return b.collision_poly.intersects_poly(this.temp_poly, r.left - b.x, r.top - b.y);
		}
	};
	Runtime.prototype.testSegmentOverlap = function (x1, y1, x2, y2, b)
	{
		if (!b || !b.collisionsEnabled)
			return false;
		b.update_bbox();
		var layerb = b.layer;
		var haspolyb, polyb;
		tmpRect.set(cr.min(x1, x2), cr.min(y1, y2), cr.max(x1, x2), cr.max(y1, y2));
		if (!b.bbox.intersects_rect(tmpRect))
			return false;
		if (b.tilemap_exists)
		{
			b.getCollisionRectCandidates(tmpRect, collrect_candidates);
			var collrects = collrect_candidates;
			var i, len, c, tilerc;
			var tmx = b.x;
			var tmy = b.y;
			for (i = 0, len = collrects.length; i < len; ++i)
			{
				c = collrects[i];
				tilerc = c.rc;
				if (tmpRect.intersects_rect_off(tilerc, tmx, tmy))
				{
					tmpQuad.set_from_rect(tilerc);
					tmpQuad.offset(tmx, tmy);
					if (tmpQuad.intersects_segment(x1, y1, x2, y2))
					{
						if (c.poly)
						{
							if (c.poly.intersects_segment(tmx + tilerc.left, tmy + tilerc.top, x1, y1, x2, y2))
							{
								cr.clearArray(collrect_candidates);
								return true;
							}
						}
						else
						{
							cr.clearArray(collrect_candidates);
							return true;
						}
					}
				}
			}
			cr.clearArray(collrect_candidates);
			return false;
		}
		else
		{
			if (!b.bquad.intersects_segment(x1, y1, x2, y2))
				return false;
			haspolyb = (b.collision_poly && !b.collision_poly.is_empty());
			if (!haspolyb)
				return true;
			b.collision_poly.cache_poly(b.width, b.height, b.angle);
			return b.collision_poly.intersects_segment(b.x, b.y, x1, y1, x2, y2);
		}
	};
	Runtime.prototype.typeHasBehavior = function (t, b)
	{
		if (!b)
			return false;
		var i, len, j, lenj, f;
		for (i = 0, len = t.behaviors.length; i < len; i++)
		{
			if (t.behaviors[i].behavior instanceof b)
				return true;
		}
		if (!t.is_family)
		{
			for (i = 0, len = t.families.length; i < len; i++)
			{
				f = t.families[i];
				for (j = 0, lenj = f.behaviors.length; j < lenj; j++)
				{
					if (f.behaviors[j].behavior instanceof b)
						return true;
				}
			}
		}
		return false;
	};
	Runtime.prototype.typeHasNoSaveBehavior = function (t)
	{
		return this.typeHasBehavior(t, cr.behaviors.NoSave);
	};
	Runtime.prototype.typeHasPersistBehavior = function (t)
	{
		return this.typeHasBehavior(t, cr.behaviors.Persist);
	};
	Runtime.prototype.getSolidBehavior = function ()
	{
		return this.solidBehavior;
	};
	Runtime.prototype.getJumpthruBehavior = function ()
	{
		return this.jumpthruBehavior;
	};
	var candidates = [];
	Runtime.prototype.testOverlapSolid = function (inst)
	{
		var i, len, s;
		inst.update_bbox();
		this.getSolidCollisionCandidates(inst.layer, inst.bbox, candidates);
		for (i = 0, len = candidates.length; i < len; ++i)
		{
			s = candidates[i];
			if (!s.extra["solidEnabled"])
				continue;
			if (this.testOverlap(inst, s))
			{
				cr.clearArray(candidates);
				return s;
			}
		}
		cr.clearArray(candidates);
		return null;
	};
	Runtime.prototype.testRectOverlapSolid = function (r)
	{
		var i, len, s;
		this.getSolidCollisionCandidates(null, r, candidates);
		for (i = 0, len = candidates.length; i < len; ++i)
		{
			s = candidates[i];
			if (!s.extra["solidEnabled"])
				continue;
			if (this.testRectOverlap(r, s))
			{
				cr.clearArray(candidates);
				return s;
			}
		}
		cr.clearArray(candidates);
		return null;
	};
	var jumpthru_array_ret = [];
	Runtime.prototype.testOverlapJumpThru = function (inst, all)
	{
		var ret = null;
		if (all)
		{
			ret = jumpthru_array_ret;
			cr.clearArray(ret);
		}
		inst.update_bbox();
		this.getJumpthruCollisionCandidates(inst.layer, inst.bbox, candidates);
		var i, len, j;
		for (i = 0, len = candidates.length; i < len; ++i)
		{
			j = candidates[i];
			if (!j.extra["jumpthruEnabled"])
				continue;
			if (this.testOverlap(inst, j))
			{
				if (all)
					ret.push(j);
				else
				{
					cr.clearArray(candidates);
					return j;
				}
			}
		}
		cr.clearArray(candidates);
		return ret;
	};
	Runtime.prototype.pushOutSolid = function (inst, xdir, ydir, dist, include_jumpthrus, specific_jumpthru)
	{
		var push_dist = dist || 50;
		var oldx = inst.x
		var oldy = inst.y;
		var i;
		var last_overlapped = null, secondlast_overlapped = null;
		for (i = 0; i < push_dist; i++)
		{
			inst.x = (oldx + (xdir * i));
			inst.y = (oldy + (ydir * i));
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, last_overlapped))
			{
				last_overlapped = this.testOverlapSolid(inst);
				if (last_overlapped)
					secondlast_overlapped = last_overlapped;
				if (!last_overlapped)
				{
					if (include_jumpthrus)
					{
						if (specific_jumpthru)
							last_overlapped = (this.testOverlap(inst, specific_jumpthru) ? specific_jumpthru : null);
						else
							last_overlapped = this.testOverlapJumpThru(inst);
						if (last_overlapped)
							secondlast_overlapped = last_overlapped;
					}
					if (!last_overlapped)
					{
						if (secondlast_overlapped)
							this.pushInFractional(inst, xdir, ydir, secondlast_overlapped, 16);
						return true;
					}
				}
			}
		}
		inst.x = oldx;
		inst.y = oldy;
		inst.set_bbox_changed();
		return false;
	};
	Runtime.prototype.pushOut = function (inst, xdir, ydir, dist, otherinst)
	{
		var push_dist = dist || 50;
		var oldx = inst.x
		var oldy = inst.y;
		var i;
		for (i = 0; i < push_dist; i++)
		{
			inst.x = (oldx + (xdir * i));
			inst.y = (oldy + (ydir * i));
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, otherinst))
				return true;
		}
		inst.x = oldx;
		inst.y = oldy;
		inst.set_bbox_changed();
		return false;
	};
	Runtime.prototype.pushInFractional = function (inst, xdir, ydir, obj, limit)
	{
		var divisor = 2;
		var frac;
		var forward = false;
		var overlapping = false;
		var bestx = inst.x;
		var besty = inst.y;
		while (divisor <= limit)
		{
			frac = 1 / divisor;
			divisor *= 2;
			inst.x += xdir * frac * (forward ? 1 : -1);
			inst.y += ydir * frac * (forward ? 1 : -1);
			inst.set_bbox_changed();
			if (this.testOverlap(inst, obj))
			{
				forward = true;
				overlapping = true;
			}
			else
			{
				forward = false;
				overlapping = false;
				bestx = inst.x;
				besty = inst.y;
			}
		}
		if (overlapping)
		{
			inst.x = bestx;
			inst.y = besty;
			inst.set_bbox_changed();
		}
	};
	Runtime.prototype.pushOutSolidNearest = function (inst, max_dist_)
	{
		var max_dist = (cr.is_undefined(max_dist_) ? 100 : max_dist_);
		var dist = 0;
		var oldx = inst.x
		var oldy = inst.y;
		var dir = 0;
		var dx = 0, dy = 0;
		var last_overlapped = this.testOverlapSolid(inst);
		if (!last_overlapped)
			return true;		// already clear of solids
		while (dist <= max_dist)
		{
			switch (dir) {
			case 0:		dx = 0; dy = -1; dist++; break;
			case 1:		dx = 1; dy = -1; break;
			case 2:		dx = 1; dy = 0; break;
			case 3:		dx = 1; dy = 1; break;
			case 4:		dx = 0; dy = 1; break;
			case 5:		dx = -1; dy = 1; break;
			case 6:		dx = -1; dy = 0; break;
			case 7:		dx = -1; dy = -1; break;
			}
			dir = (dir + 1) % 8;
			inst.x = cr.floor(oldx + (dx * dist));
			inst.y = cr.floor(oldy + (dy * dist));
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, last_overlapped))
			{
				last_overlapped = this.testOverlapSolid(inst);
				if (!last_overlapped)
					return true;
			}
		}
		inst.x = oldx;
		inst.y = oldy;
		inst.set_bbox_changed();
		return false;
	};
	Runtime.prototype.registerCollision = function (a, b)
	{
		if (!a.collisionsEnabled || !b.collisionsEnabled)
			return;
		this.registered_collisions.push([a, b]);
	};
	Runtime.prototype.checkRegisteredCollision = function (a, b)
	{
		var i, len, x;
		for (i = 0, len = this.registered_collisions.length; i < len; i++)
		{
			x = this.registered_collisions[i];
			if ((x[0] == a && x[1] == b) || (x[0] == b && x[1] == a))
				return true;
		}
		return false;
	};
	Runtime.prototype.calculateSolidBounceAngle = function(inst, startx, starty, obj)
	{
		var objx = inst.x;
		var objy = inst.y;
		var radius = cr.max(10, cr.distanceTo(startx, starty, objx, objy));
		var startangle = cr.angleTo(startx, starty, objx, objy);
		var firstsolid = obj || this.testOverlapSolid(inst);
		if (!firstsolid)
			return cr.clamp_angle(startangle + cr.PI);
		var cursolid = firstsolid;
		var i, curangle, anticlockwise_free_angle, clockwise_free_angle;
		var increment = cr.to_radians(5);	// 5 degree increments
		for (i = 1; i < 36; i++)
		{
			curangle = startangle - i * increment;
			inst.x = startx + Math.cos(curangle) * radius;
			inst.y = starty + Math.sin(curangle) * radius;
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, cursolid))
			{
				cursolid = obj ? null : this.testOverlapSolid(inst);
				if (!cursolid)
				{
					anticlockwise_free_angle = curangle;
					break;
				}
			}
		}
		if (i === 36)
			anticlockwise_free_angle = cr.clamp_angle(startangle + cr.PI);
		var cursolid = firstsolid;
		for (i = 1; i < 36; i++)
		{
			curangle = startangle + i * increment;
			inst.x = startx + Math.cos(curangle) * radius;
			inst.y = starty + Math.sin(curangle) * radius;
			inst.set_bbox_changed();
			if (!this.testOverlap(inst, cursolid))
			{
				cursolid = obj ? null : this.testOverlapSolid(inst);
				if (!cursolid)
				{
					clockwise_free_angle = curangle;
					break;
				}
			}
		}
		if (i === 36)
			clockwise_free_angle = cr.clamp_angle(startangle + cr.PI);
		inst.x = objx;
		inst.y = objy;
		inst.set_bbox_changed();
		if (clockwise_free_angle === anticlockwise_free_angle)
			return clockwise_free_angle;
		var half_diff = cr.angleDiff(clockwise_free_angle, anticlockwise_free_angle) / 2;
		var normal;
		if (cr.angleClockwise(clockwise_free_angle, anticlockwise_free_angle))
		{
			normal = cr.clamp_angle(anticlockwise_free_angle + half_diff + cr.PI);
		}
		else
		{
			normal = cr.clamp_angle(clockwise_free_angle + half_diff);
		}
;
		var vx = Math.cos(startangle);
		var vy = Math.sin(startangle);
		var nx = Math.cos(normal);
		var ny = Math.sin(normal);
		var v_dot_n = vx * nx + vy * ny;
		var rx = vx - 2 * v_dot_n * nx;
		var ry = vy - 2 * v_dot_n * ny;
		return cr.angleTo(0, 0, rx, ry);
	};
	var triggerSheetIndex = -1;
	Runtime.prototype.trigger = function (method, inst, value /* for fast triggers */)
	{
;
		if (!this.running_layout)
			return false;
		var sheet = this.running_layout.event_sheet;
		if (!sheet)
			return false;     // no event sheet active; nothing to trigger
		var ret = false;
		var r, i, len;
		triggerSheetIndex++;
		var deep_includes = sheet.deep_includes;
		for (i = 0, len = deep_includes.length; i < len; ++i)
		{
			r = this.triggerOnSheet(method, inst, deep_includes[i], value);
			ret = ret || r;
		}
		r = this.triggerOnSheet(method, inst, sheet, value);
		ret = ret || r;
		triggerSheetIndex--;
		return ret;
    };
    Runtime.prototype.triggerOnSheet = function (method, inst, sheet, value)
    {
        var ret = false;
		var i, leni, r, families;
		if (!inst)
		{
			r = this.triggerOnSheetForTypeName(method, inst, "system", sheet, value);
			ret = ret || r;
		}
		else
		{
			r = this.triggerOnSheetForTypeName(method, inst, inst.type.name, sheet, value);
			ret = ret || r;
			families = inst.type.families;
			for (i = 0, leni = families.length; i < leni; ++i)
			{
				r = this.triggerOnSheetForTypeName(method, inst, families[i].name, sheet, value);
				ret = ret || r;
			}
		}
		return ret;             // true if anything got triggered
	};
	Runtime.prototype.triggerOnSheetForTypeName = function (method, inst, type_name, sheet, value)
	{
		var i, leni;
		var ret = false, ret2 = false;
		var trig, index;
		var fasttrigger = (typeof value !== "undefined");
		var triggers = (fasttrigger ? sheet.fasttriggers : sheet.triggers);
		var obj_entry = triggers[type_name];
		if (!obj_entry)
			return ret;
		var triggers_list = null;
		for (i = 0, leni = obj_entry.length; i < leni; ++i)
		{
			if (obj_entry[i].method == method)
			{
				triggers_list = obj_entry[i].evs;
				break;
			}
		}
		if (!triggers_list)
			return ret;
		var triggers_to_fire;
		if (fasttrigger)
		{
			triggers_to_fire = triggers_list[value];
		}
		else
		{
			triggers_to_fire = triggers_list;
		}
		if (!triggers_to_fire)
			return null;
		for (i = 0, leni = triggers_to_fire.length; i < leni; i++)
		{
			trig = triggers_to_fire[i][0];
			index = triggers_to_fire[i][1];
			ret2 = this.executeSingleTrigger(inst, type_name, trig, index);
			ret = ret || ret2;
		}
		return ret;
	};
	Runtime.prototype.executeSingleTrigger = function (inst, type_name, trig, index)
	{
		var i, leni;
		var ret = false;
		this.trigger_depth++;
		var current_event = this.getCurrentEventStack().current_event;
		if (current_event)
			this.pushCleanSol(current_event.solModifiersIncludingParents);
		var isrecursive = (this.trigger_depth > 1);		// calling trigger from inside another trigger
		this.pushCleanSol(trig.solModifiersIncludingParents);
		if (isrecursive)
			this.pushLocalVarStack();
		var event_stack = this.pushEventStack(trig);
		event_stack.current_event = trig;
		if (inst)
		{
			var sol = this.types[type_name].getCurrentSol();
			sol.select_all = false;
			cr.clearArray(sol.instances);
			sol.instances[0] = inst;
			this.types[type_name].applySolToContainer();
		}
		var ok_to_run = true;
		if (trig.parent)
		{
			var temp_parents_arr = event_stack.temp_parents_arr;
			var cur_parent = trig.parent;
			while (cur_parent)
			{
				temp_parents_arr.push(cur_parent);
				cur_parent = cur_parent.parent;
			}
			temp_parents_arr.reverse();
			for (i = 0, leni = temp_parents_arr.length; i < leni; i++)
			{
				if (!temp_parents_arr[i].run_pretrigger())   // parent event failed
				{
					ok_to_run = false;
					break;
				}
			}
		}
		if (ok_to_run)
		{
			this.execcount++;
			if (trig.orblock)
				trig.run_orblocktrigger(index);
			else
				trig.run();
			ret = ret || event_stack.last_event_true;
		}
		this.popEventStack();
		if (isrecursive)
			this.popLocalVarStack();
		this.popSol(trig.solModifiersIncludingParents);
		if (current_event)
			this.popSol(current_event.solModifiersIncludingParents);
		if (this.hasPendingInstances && this.isInOnDestroy === 0 && triggerSheetIndex === 0 && !this.isRunningEvents)
		{
			this.ClearDeathRow();
		}
		this.trigger_depth--;
		return ret;
	};
	Runtime.prototype.getCurrentCondition = function ()
	{
		var evinfo = this.getCurrentEventStack();
		return evinfo.current_event.conditions[evinfo.cndindex];
	};
	Runtime.prototype.getCurrentConditionObjectType = function ()
	{
		var cnd = this.getCurrentCondition();
		return cnd.type;
	};
	Runtime.prototype.isCurrentConditionFirst = function ()
	{
		var evinfo = this.getCurrentEventStack();
		return evinfo.cndindex === 0;
	};
	Runtime.prototype.getCurrentAction = function ()
	{
		var evinfo = this.getCurrentEventStack();
		return evinfo.current_event.actions[evinfo.actindex];
	};
	Runtime.prototype.pushLocalVarStack = function ()
	{
		this.localvar_stack_index++;
		if (this.localvar_stack_index >= this.localvar_stack.length)
			this.localvar_stack.push([]);
	};
	Runtime.prototype.popLocalVarStack = function ()
	{
;
		this.localvar_stack_index--;
	};
	Runtime.prototype.getCurrentLocalVarStack = function ()
	{
		return this.localvar_stack[this.localvar_stack_index];
	};
	Runtime.prototype.pushEventStack = function (cur_event)
	{
		this.event_stack_index++;
		if (this.event_stack_index >= this.event_stack.length)
			this.event_stack.push(new cr.eventStackFrame());
		var ret = this.getCurrentEventStack();
		ret.reset(cur_event);
		return ret;
	};
	Runtime.prototype.popEventStack = function ()
	{
;
		this.event_stack_index--;
	};
	Runtime.prototype.getCurrentEventStack = function ()
	{
		return this.event_stack[this.event_stack_index];
	};
	Runtime.prototype.pushLoopStack = function (name_)
	{
		this.loop_stack_index++;
		if (this.loop_stack_index >= this.loop_stack.length)
		{
			this.loop_stack.push(cr.seal({ name: name_, index: 0, stopped: false }));
		}
		var ret = this.getCurrentLoop();
		ret.name = name_;
		ret.index = 0;
		ret.stopped = false;
		return ret;
	};
	Runtime.prototype.popLoopStack = function ()
	{
;
		this.loop_stack_index--;
	};
	Runtime.prototype.getCurrentLoop = function ()
	{
		return this.loop_stack[this.loop_stack_index];
	};
	Runtime.prototype.getEventVariableByName = function (name, scope)
	{
		var i, leni, j, lenj, sheet, e;
		while (scope)
		{
			for (i = 0, leni = scope.subevents.length; i < leni; i++)
			{
				e = scope.subevents[i];
				if (e instanceof cr.eventvariable && cr.equals_nocase(name, e.name))
					return e;
			}
			scope = scope.parent;
		}
		for (i = 0, leni = this.eventsheets_by_index.length; i < leni; i++)
		{
			sheet = this.eventsheets_by_index[i];
			for (j = 0, lenj = sheet.events.length; j < lenj; j++)
			{
				e = sheet.events[j];
				if (e instanceof cr.eventvariable && cr.equals_nocase(name, e.name))
					return e;
			}
		}
		return null;
	};
	Runtime.prototype.getLayoutBySid = function (sid_)
	{
		var i, len;
		for (i = 0, len = this.layouts_by_index.length; i < len; i++)
		{
			if (this.layouts_by_index[i].sid === sid_)
				return this.layouts_by_index[i];
		}
		return null;
	};
	Runtime.prototype.getObjectTypeBySid = function (sid_)
	{
		var i, len;
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			if (this.types_by_index[i].sid === sid_)
				return this.types_by_index[i];
		}
		return null;
	};
	Runtime.prototype.getGroupBySid = function (sid_)
	{
		var i, len;
		for (i = 0, len = this.allGroups.length; i < len; i++)
		{
			if (this.allGroups[i].sid === sid_)
				return this.allGroups[i];
		}
		return null;
	};
	Runtime.prototype.doCanvasSnapshot = function (format_, quality_)
	{
		this.snapshotCanvas = [format_, quality_];
		this.redraw = true;		// force redraw so snapshot is always taken
	};
	function IsIndexedDBAvailable()
	{
		try {
			return !!window.indexedDB;
		}
		catch (e)
		{
			return false;
		}
	};
	function makeSaveDb(e)
	{
		var db = e.target.result;
		db.createObjectStore("saves", { keyPath: "slot" });
	};
	function IndexedDB_WriteSlot(slot_, data_, oncomplete_, onerror_)
	{
		try {
			var request = indexedDB.open("_C2SaveStates");
			request.onupgradeneeded = makeSaveDb;
			request.onerror = onerror_;
			request.onsuccess = function (e)
			{
				var db = e.target.result;
				db.onerror = onerror_;
				var transaction = db.transaction(["saves"], "readwrite");
				var objectStore = transaction.objectStore("saves");
				var putReq = objectStore.put({"slot": slot_, "data": data_ });
				putReq.onsuccess = oncomplete_;
			};
		}
		catch (err)
		{
			onerror_(err);
		}
	};
	function IndexedDB_ReadSlot(slot_, oncomplete_, onerror_)
	{
		try {
			var request = indexedDB.open("_C2SaveStates");
			request.onupgradeneeded = makeSaveDb;
			request.onerror = onerror_;
			request.onsuccess = function (e)
			{
				var db = e.target.result;
				db.onerror = onerror_;
				var transaction = db.transaction(["saves"]);
				var objectStore = transaction.objectStore("saves");
				var readReq = objectStore.get(slot_);
				readReq.onsuccess = function (e)
				{
					if (readReq.result)
						oncomplete_(readReq.result["data"]);
					else
						oncomplete_(null);
				};
			};
		}
		catch (err)
		{
			onerror_(err);
		}
	};
	Runtime.prototype.signalContinuousPreview = function ()
	{
		this.signalledContinuousPreview = true;
	};
	function doContinuousPreviewReload()
	{
		cr.logexport("Reloading for continuous preview");
		if (!!window["c2cocoonjs"])
		{
			CocoonJS["App"]["reload"]();
		}
		else
		{
			if (window.location.search.indexOf("continuous") > -1)
				window.location.reload(true);
			else
				window.location = window.location + "?continuous";
		}
	};
	Runtime.prototype.handleSaveLoad = function ()
	{
		var self = this;
		var savingToSlot = this.saveToSlot;
		var savingJson = this.lastSaveJson;
		var loadingFromSlot = this.loadFromSlot;
		var continuous = false;
		if (this.signalledContinuousPreview)
		{
			continuous = true;
			savingToSlot = "__c2_continuouspreview";
			this.signalledContinuousPreview = false;
		}
		if (savingToSlot.length)
		{
			this.ClearDeathRow();
			savingJson = this.saveToJSONString();
			if (IsIndexedDBAvailable() && !this.isCocoonJs)
			{
				IndexedDB_WriteSlot(savingToSlot, savingJson, function ()
				{
					cr.logexport("Saved state to IndexedDB storage (" + savingJson.length + " bytes)");
					self.lastSaveJson = savingJson;
					self.trigger(cr.system_object.prototype.cnds.OnSaveComplete, null);
					self.lastSaveJson = "";
					if (continuous)
						doContinuousPreviewReload();
				}, function (e)
				{
					try {
						localStorage.setItem("__c2save_" + savingToSlot, savingJson);
						cr.logexport("Saved state to WebStorage (" + savingJson.length + " bytes)");
						self.lastSaveJson = savingJson;
						self.trigger(cr.system_object.prototype.cnds.OnSaveComplete, null);
						self.lastSaveJson = "";
						if (continuous)
							doContinuousPreviewReload();
					}
					catch (f)
					{
						cr.logexport("Failed to save game state: " + e + "; " + f);
						self.trigger(cr.system_object.prototype.cnds.OnSaveFailed, null);
					}
				});
			}
			else
			{
				try {
					localStorage.setItem("__c2save_" + savingToSlot, savingJson);
					cr.logexport("Saved state to WebStorage (" + savingJson.length + " bytes)");
					self.lastSaveJson = savingJson;
					this.trigger(cr.system_object.prototype.cnds.OnSaveComplete, null);
					self.lastSaveJson = "";
					if (continuous)
						doContinuousPreviewReload();
				}
				catch (e)
				{
					cr.logexport("Error saving to WebStorage: " + e);
					self.trigger(cr.system_object.prototype.cnds.OnSaveFailed, null);
				}
			}
			this.saveToSlot = "";
			this.loadFromSlot = "";
			this.loadFromJson = "";
		}
		if (loadingFromSlot.length)
		{
			if (IsIndexedDBAvailable() && !this.isCocoonJs)
			{
				IndexedDB_ReadSlot(loadingFromSlot, function (result_)
				{
					if (result_)
					{
						self.loadFromJson = result_;
						cr.logexport("Loaded state from IndexedDB storage (" + self.loadFromJson.length + " bytes)");
					}
					else
					{
						self.loadFromJson = localStorage.getItem("__c2save_" + loadingFromSlot) || "";
						cr.logexport("Loaded state from WebStorage (" + self.loadFromJson.length + " bytes)");
					}
					self.suspendDrawing = false;
					if (!self.loadFromJson.length)
						self.trigger(cr.system_object.prototype.cnds.OnLoadFailed, null);
				}, function (e)
				{
					self.loadFromJson = localStorage.getItem("__c2save_" + loadingFromSlot) || "";
					cr.logexport("Loaded state from WebStorage (" + self.loadFromJson.length + " bytes)");
					self.suspendDrawing = false;
					if (!self.loadFromJson.length)
						self.trigger(cr.system_object.prototype.cnds.OnLoadFailed, null);
				});
			}
			else
			{
				try {
					this.loadFromJson = localStorage.getItem("__c2save_" + loadingFromSlot) || "";
					cr.logexport("Loaded state from WebStorage (" + this.loadFromJson.length + " bytes)");
				}
				catch (e)
				{
					this.loadFromJson = "";
				}
				this.suspendDrawing = false;
				if (!self.loadFromJson.length)
					self.trigger(cr.system_object.prototype.cnds.OnLoadFailed, null);
			}
			this.loadFromSlot = "";
			this.saveToSlot = "";
		}
		if (this.loadFromJson.length)
		{
			this.ClearDeathRow();
			this.loadFromJSONString(this.loadFromJson);
			this.lastSaveJson = this.loadFromJson;
			this.trigger(cr.system_object.prototype.cnds.OnLoadComplete, null);
			this.lastSaveJson = "";
			this.loadFromJson = "";
		}
	};
	function CopyExtraObject(extra)
	{
		var p, ret = {};
		for (p in extra)
		{
			if (extra.hasOwnProperty(p))
			{
				if (extra[p] instanceof cr.ObjectSet)
					continue;
				if (extra[p] && typeof extra[p].c2userdata !== "undefined")
					continue;
				if (p === "spriteCreatedDestroyCallback")
					continue;
				ret[p] = extra[p];
			}
		}
		return ret;
	};
	Runtime.prototype.saveToJSONString = function()
	{
		var i, len, j, lenj, type, layout, typeobj, g, c, a, v, p;
		var o = {
			"c2save":				true,
			"version":				1,
			"rt": {
				"time":				this.kahanTime.sum,
				"walltime":			this.wallTime.sum,
				"timescale":		this.timescale,
				"tickcount":		this.tickcount,
				"execcount":		this.execcount,
				"next_uid":			this.next_uid,
				"running_layout":	this.running_layout.sid,
				"start_time_offset": (Date.now() - this.start_time)
			},
			"types": {},
			"layouts": {},
			"events": {
				"groups": {},
				"cnds": {},
				"acts": {},
				"vars": {}
			}
		};
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || this.typeHasNoSaveBehavior(type))
				continue;
			typeobj = {
				"instances": []
			};
			if (cr.hasAnyOwnProperty(type.extra))
				typeobj["ex"] = CopyExtraObject(type.extra);
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				typeobj["instances"].push(this.saveInstanceToJSON(type.instances[j]));
			}
			o["types"][type.sid.toString()] = typeobj;
		}
		for (i = 0, len = this.layouts_by_index.length; i < len; i++)
		{
			layout = this.layouts_by_index[i];
			o["layouts"][layout.sid.toString()] = layout.saveToJSON();
		}
		var ogroups = o["events"]["groups"];
		for (i = 0, len = this.allGroups.length; i < len; i++)
		{
			g = this.allGroups[i];
			ogroups[g.sid.toString()] = this.groups_by_name[g.group_name].group_active;
		}
		var ocnds = o["events"]["cnds"];
		for (p in this.cndsBySid)
		{
			if (this.cndsBySid.hasOwnProperty(p))
			{
				c = this.cndsBySid[p];
				if (cr.hasAnyOwnProperty(c.extra))
					ocnds[p] = { "ex": CopyExtraObject(c.extra) };
			}
		}
		var oacts = o["events"]["acts"];
		for (p in this.actsBySid)
		{
			if (this.actsBySid.hasOwnProperty(p))
			{
				a = this.actsBySid[p];
				if (cr.hasAnyOwnProperty(a.extra))
					oacts[p] = { "ex": CopyExtraObject(a.extra) };
			}
		}
		var ovars = o["events"]["vars"];
		for (p in this.varsBySid)
		{
			if (this.varsBySid.hasOwnProperty(p))
			{
				v = this.varsBySid[p];
				if (!v.is_constant && (!v.parent || v.is_static))
					ovars[p] = v.data;
			}
		}
		o["system"] = this.system.saveToJSON();
		return JSON.stringify(o);
	};
	Runtime.prototype.refreshUidMap = function ()
	{
		var i, len, type, j, lenj, inst;
		this.objectsByUid = {};
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family)
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				this.objectsByUid[inst.uid.toString()] = inst;
			}
		}
	};
	Runtime.prototype.loadFromJSONString = function (str)
	{
		var o = JSON.parse(str);
		if (!o["c2save"])
			return;		// probably not a c2 save state
		if (o["version"] > 1)
			return;		// from future version of c2; assume not compatible
		this.isLoadingState = true;
		var rt = o["rt"];
		this.kahanTime.reset();
		this.kahanTime.sum = rt["time"];
		this.wallTime.reset();
		this.wallTime.sum = rt["walltime"] || 0;
		this.timescale = rt["timescale"];
		this.tickcount = rt["tickcount"];
		this.execcount = rt["execcount"];
		this.start_time = Date.now() - rt["start_time_offset"];
		var layout_sid = rt["running_layout"];
		if (layout_sid !== this.running_layout.sid)
		{
			var changeToLayout = this.getLayoutBySid(layout_sid);
			if (changeToLayout)
				this.doChangeLayout(changeToLayout);
			else
				return;		// layout that was saved on has gone missing (deleted?)
		}
		var i, len, j, lenj, k, lenk, p, type, existing_insts, load_insts, inst, binst, layout, layer, g, iid, t;
		var otypes = o["types"];
		for (p in otypes)
		{
			if (otypes.hasOwnProperty(p))
			{
				type = this.getObjectTypeBySid(parseInt(p, 10));
				if (!type || type.is_family || this.typeHasNoSaveBehavior(type))
					continue;
				if (otypes[p]["ex"])
					type.extra = otypes[p]["ex"];
				else
					cr.wipe(type.extra);
				existing_insts = type.instances;
				load_insts = otypes[p]["instances"];
				for (i = 0, len = cr.min(existing_insts.length, load_insts.length); i < len; i++)
				{
					this.loadInstanceFromJSON(existing_insts[i], load_insts[i]);
				}
				for (i = load_insts.length, len = existing_insts.length; i < len; i++)
					this.DestroyInstance(existing_insts[i]);
				for (i = existing_insts.length, len = load_insts.length; i < len; i++)
				{
					layer = null;
					if (type.plugin.is_world)
					{
						layer = this.running_layout.getLayerBySid(load_insts[i]["w"]["l"]);
						if (!layer)
							continue;
					}
					inst = this.createInstanceFromInit(type.default_instance, layer, false, 0, 0, true);
					this.loadInstanceFromJSON(inst, load_insts[i]);
				}
				type.stale_iids = true;
			}
		}
		this.ClearDeathRow();
		this.refreshUidMap();
		var olayouts = o["layouts"];
		for (p in olayouts)
		{
			if (olayouts.hasOwnProperty(p))
			{
				layout = this.getLayoutBySid(parseInt(p, 10));
				if (!layout)
					continue;		// must've gone missing
				layout.loadFromJSON(olayouts[p]);
			}
		}
		var ogroups = o["events"]["groups"];
		for (p in ogroups)
		{
			if (ogroups.hasOwnProperty(p))
			{
				g = this.getGroupBySid(parseInt(p, 10));
				if (g && this.groups_by_name[g.group_name])
					this.groups_by_name[g.group_name].setGroupActive(ogroups[p]);
			}
		}
		var ocnds = o["events"]["cnds"];
		for (p in this.cndsBySid)
		{
			if (this.cndsBySid.hasOwnProperty(p))
			{
				if (ocnds.hasOwnProperty(p))
				{
					this.cndsBySid[p].extra = ocnds[p]["ex"];
				}
				else
				{
					this.cndsBySid[p].extra = {};
				}
			}
		}
		var oacts = o["events"]["acts"];
		for (p in this.actsBySid)
		{
			if (this.actsBySid.hasOwnProperty(p))
			{
				if (oacts.hasOwnProperty(p))
				{
					this.actsBySid[p].extra = oacts[p]["ex"];
				}
				else
				{
					this.actsBySid[p].extra = {};
				}
			}
		}
		var ovars = o["events"]["vars"];
		for (p in ovars)
		{
			if (ovars.hasOwnProperty(p) && this.varsBySid.hasOwnProperty(p))
			{
				this.varsBySid[p].data = ovars[p];
			}
		}
		this.next_uid = rt["next_uid"];
		this.isLoadingState = false;
		for (i = 0, len = this.fireOnCreateAfterLoad.length; i < len; ++i)
		{
			inst = this.fireOnCreateAfterLoad[i];
			this.trigger(Object.getPrototypeOf(inst.type.plugin).cnds.OnCreated, inst);
		}
		cr.clearArray(this.fireOnCreateAfterLoad);
		this.system.loadFromJSON(o["system"]);
		for (i = 0, len = this.types_by_index.length; i < len; i++)
		{
			type = this.types_by_index[i];
			if (type.is_family || this.typeHasNoSaveBehavior(type))
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
			{
				inst = type.instances[j];
				if (type.is_contained)
				{
					iid = inst.get_iid();
					cr.clearArray(inst.siblings);
					for (k = 0, lenk = type.container.length; k < lenk; k++)
					{
						t = type.container[k];
						if (type === t)
							continue;
;
						inst.siblings.push(t.instances[iid]);
					}
				}
				if (inst.afterLoad)
					inst.afterLoad();
				if (inst.behavior_insts)
				{
					for (k = 0, lenk = inst.behavior_insts.length; k < lenk; k++)
					{
						binst = inst.behavior_insts[k];
						if (binst.afterLoad)
							binst.afterLoad();
					}
				}
			}
		}
		this.redraw = true;
	};
	Runtime.prototype.saveInstanceToJSON = function(inst, state_only)
	{
		var i, len, world, behinst, et;
		var type = inst.type;
		var plugin = type.plugin;
		var o = {};
		if (state_only)
			o["c2"] = true;		// mark as known json data from Construct 2
		else
			o["uid"] = inst.uid;
		if (cr.hasAnyOwnProperty(inst.extra))
			o["ex"] = CopyExtraObject(inst.extra);
		if (inst.instance_vars && inst.instance_vars.length)
		{
			o["ivs"] = {};
			for (i = 0, len = inst.instance_vars.length; i < len; i++)
			{
				o["ivs"][inst.type.instvar_sids[i].toString()] = inst.instance_vars[i];
			}
		}
		if (plugin.is_world)
		{
			world = {
				"x": inst.x,
				"y": inst.y,
				"w": inst.width,
				"h": inst.height,
				"l": inst.layer.sid,
				"zi": inst.get_zindex()
			};
			if (inst.angle !== 0)
				world["a"] = inst.angle;
			if (inst.opacity !== 1)
				world["o"] = inst.opacity;
			if (inst.hotspotX !== 0.5)
				world["hX"] = inst.hotspotX;
			if (inst.hotspotY !== 0.5)
				world["hY"] = inst.hotspotY;
			if (inst.blend_mode !== 0)
				world["bm"] = inst.blend_mode;
			if (!inst.visible)
				world["v"] = inst.visible;
			if (!inst.collisionsEnabled)
				world["ce"] = inst.collisionsEnabled;
			if (inst.my_timescale !== -1)
				world["mts"] = inst.my_timescale;
			if (type.effect_types.length)
			{
				world["fx"] = [];
				for (i = 0, len = type.effect_types.length; i < len; i++)
				{
					et = type.effect_types[i];
					world["fx"].push({"name": et.name,
									  "active": inst.active_effect_flags[et.index],
									  "params": inst.effect_params[et.index] });
				}
			}
			o["w"] = world;
		}
		if (inst.behavior_insts && inst.behavior_insts.length)
		{
			o["behs"] = {};
			for (i = 0, len = inst.behavior_insts.length; i < len; i++)
			{
				behinst = inst.behavior_insts[i];
				if (behinst.saveToJSON)
					o["behs"][behinst.type.sid.toString()] = behinst.saveToJSON();
			}
		}
		if (inst.saveToJSON)
			o["data"] = inst.saveToJSON();
		return o;
	};
	Runtime.prototype.getInstanceVarIndexBySid = function (type, sid_)
	{
		var i, len;
		for (i = 0, len = type.instvar_sids.length; i < len; i++)
		{
			if (type.instvar_sids[i] === sid_)
				return i;
		}
		return -1;
	};
	Runtime.prototype.getBehaviorIndexBySid = function (inst, sid_)
	{
		var i, len;
		for (i = 0, len = inst.behavior_insts.length; i < len; i++)
		{
			if (inst.behavior_insts[i].type.sid === sid_)
				return i;
		}
		return -1;
	};
	Runtime.prototype.loadInstanceFromJSON = function(inst, o, state_only)
	{
		var p, i, len, iv, oivs, world, fxindex, obehs, behindex;
		var oldlayer;
		var type = inst.type;
		var plugin = type.plugin;
		if (state_only)
		{
			if (!o["c2"])
				return;
		}
		else
			inst.uid = o["uid"];
		if (o["ex"])
			inst.extra = o["ex"];
		else
			cr.wipe(inst.extra);
		oivs = o["ivs"];
		if (oivs)
		{
			for (p in oivs)
			{
				if (oivs.hasOwnProperty(p))
				{
					iv = this.getInstanceVarIndexBySid(type, parseInt(p, 10));
					if (iv < 0 || iv >= inst.instance_vars.length)
						continue;		// must've gone missing
					inst.instance_vars[iv] = oivs[p];
				}
			}
		}
		if (plugin.is_world)
		{
			world = o["w"];
			if (inst.layer.sid !== world["l"])
			{
				oldlayer = inst.layer;
				inst.layer = this.running_layout.getLayerBySid(world["l"]);
				if (inst.layer)
				{
					oldlayer.removeFromInstanceList(inst, true);
					inst.layer.appendToInstanceList(inst, true);
					inst.set_bbox_changed();
					inst.layer.setZIndicesStaleFrom(0);
				}
				else
				{
					inst.layer = oldlayer;
					if (!state_only)
						this.DestroyInstance(inst);
				}
			}
			inst.x = world["x"];
			inst.y = world["y"];
			inst.width = world["w"];
			inst.height = world["h"];
			inst.zindex = world["zi"];
			inst.angle = world.hasOwnProperty("a") ? world["a"] : 0;
			inst.opacity = world.hasOwnProperty("o") ? world["o"] : 1;
			inst.hotspotX = world.hasOwnProperty("hX") ? world["hX"] : 0.5;
			inst.hotspotY = world.hasOwnProperty("hY") ? world["hY"] : 0.5;
			inst.visible = world.hasOwnProperty("v") ? world["v"] : true;
			inst.collisionsEnabled = world.hasOwnProperty("ce") ? world["ce"] : true;
			inst.my_timescale = world.hasOwnProperty("mts") ? world["mts"] : -1;
			inst.blend_mode = world.hasOwnProperty("bm") ? world["bm"] : 0;;
			inst.compositeOp = cr.effectToCompositeOp(inst.blend_mode);
			if (this.gl)
				cr.setGLBlend(inst, inst.blend_mode, this.gl);
			inst.set_bbox_changed();
			if (world.hasOwnProperty("fx"))
			{
				for (i = 0, len = world["fx"].length; i < len; i++)
				{
					fxindex = type.getEffectIndexByName(world["fx"][i]["name"]);
					if (fxindex < 0)
						continue;		// must've gone missing
					inst.active_effect_flags[fxindex] = world["fx"][i]["active"];
					inst.effect_params[fxindex] = world["fx"][i]["params"];
				}
			}
			inst.updateActiveEffects();
		}
		obehs = o["behs"];
		if (obehs)
		{
			for (p in obehs)
			{
				if (obehs.hasOwnProperty(p))
				{
					behindex = this.getBehaviorIndexBySid(inst, parseInt(p, 10));
					if (behindex < 0)
						continue;		// must've gone missing
					inst.behavior_insts[behindex].loadFromJSON(obehs[p]);
				}
			}
		}
		if (o["data"])
			inst.loadFromJSON(o["data"]);
	};
	Runtime.prototype.fetchLocalFileViaCordova = function (filename, successCallback, errorCallback)
	{
		var path = cordova["file"]["applicationDirectory"] + "www/" + filename;
		window["resolveLocalFileSystemURL"](path, function (entry)
		{
			entry.file(successCallback, errorCallback);
		}, errorCallback);
	};
	Runtime.prototype.fetchLocalFileViaCordovaAsText = function (filename, successCallback, errorCallback)
	{
		this.fetchLocalFileViaCordova(filename, function (file)
		{
			var reader = new FileReader();
			reader.onload = function (e)
			{
				successCallback(e.target.result);
			};
			reader.onerror = errorCallback;
			reader.readAsText(file);
		}, errorCallback);
	};
	var queuedArrayBufferReads = [];
	var activeArrayBufferReads = 0;
	var MAX_ARRAYBUFFER_READS = 8;
	Runtime.prototype.maybeStartNextArrayBufferRead = function()
	{
		if (!queuedArrayBufferReads.length)
			return;		// none left
		if (activeArrayBufferReads >= MAX_ARRAYBUFFER_READS)
			return;		// already got maximum number in-flight
		activeArrayBufferReads++;
		var job = queuedArrayBufferReads.shift();
		this.doFetchLocalFileViaCordovaAsArrayBuffer(job.filename, job.successCallback, job.errorCallback);
	};
	Runtime.prototype.fetchLocalFileViaCordovaAsArrayBuffer = function (filename, successCallback_, errorCallback_)
	{
		var self = this;
		queuedArrayBufferReads.push({
			filename: filename,
			successCallback: function (result)
			{
				activeArrayBufferReads--;
				self.maybeStartNextArrayBufferRead();
				successCallback_(result);
			},
			errorCallback: function (err)
			{
				activeArrayBufferReads--;
				self.maybeStartNextArrayBufferRead();
				errorCallback_(err);
			}
		});
		this.maybeStartNextArrayBufferRead();
	};
	Runtime.prototype.doFetchLocalFileViaCordovaAsArrayBuffer = function (filename, successCallback, errorCallback)
	{
		this.fetchLocalFileViaCordova(filename, function (file)
		{
			var reader = new FileReader();
			reader.onload = function (e)
			{
				successCallback(e.target.result);
			};
			reader.readAsArrayBuffer(file);
		}, errorCallback);
	};
	Runtime.prototype.fetchLocalFileViaCordovaAsURL = function (filename, successCallback, errorCallback)
	{
		this.fetchLocalFileViaCordovaAsArrayBuffer(filename, function (arrayBuffer)
		{
			var blob = new Blob([arrayBuffer]);
			var url = URL.createObjectURL(blob);
			successCallback(url);
		}, errorCallback);
	};
	Runtime.prototype.isAbsoluteUrl = function (url)
	{
		return /^(?:[a-z]+:)?\/\//.test(url) || url.substr(0, 5) === "data:"  || url.substr(0, 5) === "blob:";
	};
	Runtime.prototype.setImageSrc = function (img, src)
	{
		if (this.isWKWebView && !this.isAbsoluteUrl(src))
		{
			this.fetchLocalFileViaCordovaAsURL(src, function (url)
			{
				img.src = url;
			}, function (err)
			{
				alert("Failed to load image: " + err);
			});
		}
		else
		{
			img.src = src;
		}
	};
	Runtime.prototype.setCtxImageSmoothingEnabled = function (ctx, e)
	{
		if (typeof ctx["imageSmoothingEnabled"] !== "undefined")
		{
			ctx["imageSmoothingEnabled"] = e;
		}
		else
		{
			ctx["webkitImageSmoothingEnabled"] = e;
			ctx["mozImageSmoothingEnabled"] = e;
			ctx["msImageSmoothingEnabled"] = e;
		}
	};
	cr.runtime = Runtime;
	cr.createRuntime = function (canvasid)
	{
		return new Runtime(document.getElementById(canvasid));
	};
	cr.createDCRuntime = function (w, h)
	{
		return new Runtime({ "dc": true, "width": w, "height": h });
	};
	window["cr_createRuntime"] = cr.createRuntime;
	window["cr_createDCRuntime"] = cr.createDCRuntime;
	window["createCocoonJSRuntime"] = function ()
	{
		window["c2cocoonjs"] = true;
		var canvas = document.createElement("screencanvas") || document.createElement("canvas");
		canvas.screencanvas = true;
		document.body.appendChild(canvas);
		var rt = new Runtime(canvas);
		window["c2runtime"] = rt;
		window.addEventListener("orientationchange", function () {
			window["c2runtime"]["setSize"](window.innerWidth, window.innerHeight);
		});
		window["c2runtime"]["setSize"](window.innerWidth, window.innerHeight);
		return rt;
	};
	window["createEjectaRuntime"] = function ()
	{
		var canvas = document.getElementById("canvas");
		var rt = new Runtime(canvas);
		window["c2runtime"] = rt;
		window["c2runtime"]["setSize"](window.innerWidth, window.innerHeight);
		return rt;
	};
}());
window["cr_getC2Runtime"] = function()
{
	var canvas = document.getElementById("c2canvas");
	if (canvas)
		return canvas["c2runtime"];
	else if (window["c2runtime"])
		return window["c2runtime"];
	else
		return null;
}
window["cr_getSnapshot"] = function (format_, quality_)
{
	var runtime = window["cr_getC2Runtime"]();
	if (runtime)
		runtime.doCanvasSnapshot(format_, quality_);
}
window["cr_sizeCanvas"] = function(w, h)
{
	if (w === 0 || h === 0)
		return;
	var runtime = window["cr_getC2Runtime"]();
	if (runtime)
		runtime["setSize"](w, h);
}
window["cr_setSuspended"] = function(s)
{
	var runtime = window["cr_getC2Runtime"]();
	if (runtime)
		runtime["setSuspended"](s);
}
;
(function()
{
	function Layout(runtime, m)
	{
		this.runtime = runtime;
		this.event_sheet = null;
		this.scrollX = (this.runtime.original_width / 2);
		this.scrollY = (this.runtime.original_height / 2);
		this.scale = 1.0;
		this.angle = 0;
		this.first_visit = true;
		this.name = m[0];
		this.originalWidth = m[1];
		this.originalHeight = m[2];
		this.width = m[1];
		this.height = m[2];
		this.unbounded_scrolling = m[3];
		this.sheetname = m[4];
		this.sid = m[5];
		var lm = m[6];
		var i, len;
		this.layers = [];
		this.initial_types = [];
		for (i = 0, len = lm.length; i < len; i++)
		{
			var layer = new cr.layer(this, lm[i]);
			layer.number = i;
			cr.seal(layer);
			this.layers.push(layer);
		}
		var im = m[7];
		this.initial_nonworld = [];
		for (i = 0, len = im.length; i < len; i++)
		{
			var inst = im[i];
			var type = this.runtime.types_by_index[inst[1]];
;
			if (!type.default_instance)
				type.default_instance = inst;
			this.initial_nonworld.push(inst);
			if (this.initial_types.indexOf(type) === -1)
				this.initial_types.push(type);
		}
		this.effect_types = [];
		this.active_effect_types = [];
		this.shaders_preserve_opaqueness = true;
		this.effect_params = [];
		for (i = 0, len = m[8].length; i < len; i++)
		{
			this.effect_types.push({
				id: m[8][i][0],
				name: m[8][i][1],
				shaderindex: -1,
				preservesOpaqueness: false,
				active: true,
				index: i
			});
			this.effect_params.push(m[8][i][2].slice(0));
		}
		this.updateActiveEffects();
		this.rcTex = new cr.rect(0, 0, 1, 1);
		this.rcTex2 = new cr.rect(0, 0, 1, 1);
		this.persist_data = {};
	};
	Layout.prototype.saveObjectToPersist = function (inst)
	{
		var sidStr = inst.type.sid.toString();
		if (!this.persist_data.hasOwnProperty(sidStr))
			this.persist_data[sidStr] = [];
		var type_persist = this.persist_data[sidStr];
		type_persist.push(this.runtime.saveInstanceToJSON(inst));
	};
	Layout.prototype.hasOpaqueBottomLayer = function ()
	{
		var layer = this.layers[0];
		return !layer.transparent && layer.opacity === 1.0 && !layer.forceOwnTexture && layer.visible;
	};
	Layout.prototype.updateActiveEffects = function ()
	{
		cr.clearArray(this.active_effect_types);
		this.shaders_preserve_opaqueness = true;
		var i, len, et;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			if (et.active)
			{
				this.active_effect_types.push(et);
				if (!et.preservesOpaqueness)
					this.shaders_preserve_opaqueness = false;
			}
		}
	};
	Layout.prototype.getEffectByName = function (name_)
	{
		var i, len, et;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			if (et.name === name_)
				return et;
		}
		return null;
	};
	var created_instances = [];
	function sort_by_zindex(a, b)
	{
		return a.zindex - b.zindex;
	};
	var first_layout = true;
	Layout.prototype.startRunning = function ()
	{
		if (this.sheetname)
		{
			this.event_sheet = this.runtime.eventsheets[this.sheetname];
;
			this.event_sheet.updateDeepIncludes();
		}
		this.runtime.running_layout = this;
		this.width = this.originalWidth;
		this.height = this.originalHeight;
		this.scrollX = (this.runtime.original_width / 2);
		this.scrollY = (this.runtime.original_height / 2);
		var i, k, len, lenk, type, type_instances, inst, iid, t, s, p, q, type_data, layer;
		for (i = 0, len = this.runtime.types_by_index.length; i < len; i++)
		{
			type = this.runtime.types_by_index[i];
			if (type.is_family)
				continue;		// instances are only transferred for their real type
			type_instances = type.instances;
			for (k = 0, lenk = type_instances.length; k < lenk; k++)
			{
				inst = type_instances[k];
				if (inst.layer)
				{
					var num = inst.layer.number;
					if (num >= this.layers.length)
						num = this.layers.length - 1;
					inst.layer = this.layers[num];
					if (inst.layer.instances.indexOf(inst) === -1)
						inst.layer.instances.push(inst);
					inst.layer.zindices_stale = true;
				}
			}
		}
		if (!first_layout)
		{
			for (i = 0, len = this.layers.length; i < len; ++i)
			{
				this.layers[i].instances.sort(sort_by_zindex);
			}
		}
		var layer;
		cr.clearArray(created_instances);
		this.boundScrolling();
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			layer = this.layers[i];
			layer.createInitialInstances();		// fills created_instances
			layer.updateViewport(null);
		}
		var uids_changed = false;
		if (!this.first_visit)
		{
			for (p in this.persist_data)
			{
				if (this.persist_data.hasOwnProperty(p))
				{
					type = this.runtime.getObjectTypeBySid(parseInt(p, 10));
					if (!type || type.is_family || !this.runtime.typeHasPersistBehavior(type))
						continue;
					type_data = this.persist_data[p];
					for (i = 0, len = type_data.length; i < len; i++)
					{
						layer = null;
						if (type.plugin.is_world)
						{
							layer = this.getLayerBySid(type_data[i]["w"]["l"]);
							if (!layer)
								continue;
						}
						inst = this.runtime.createInstanceFromInit(type.default_instance, layer, false, 0, 0, true);
						this.runtime.loadInstanceFromJSON(inst, type_data[i]);
						uids_changed = true;
						created_instances.push(inst);
					}
					cr.clearArray(type_data);
				}
			}
			for (i = 0, len = this.layers.length; i < len; i++)
			{
				this.layers[i].instances.sort(sort_by_zindex);
				this.layers[i].zindices_stale = true;		// in case of duplicates/holes
			}
		}
		if (uids_changed)
		{
			this.runtime.ClearDeathRow();
			this.runtime.refreshUidMap();
		}
		for (i = 0; i < created_instances.length; i++)
		{
			inst = created_instances[i];
			if (!inst.type.is_contained)
				continue;
			iid = inst.get_iid();
			for (k = 0, lenk = inst.type.container.length; k < lenk; k++)
			{
				t = inst.type.container[k];
				if (inst.type === t)
					continue;
				if (t.instances.length > iid)
					inst.siblings.push(t.instances[iid]);
				else
				{
					if (!t.default_instance)
					{
					}
					else
					{
						s = this.runtime.createInstanceFromInit(t.default_instance, inst.layer, true, inst.x, inst.y, true);
						this.runtime.ClearDeathRow();
						t.updateIIDs();
						inst.siblings.push(s);
						created_instances.push(s);		// come back around and link up its own instances too
					}
				}
			}
		}
		for (i = 0, len = this.initial_nonworld.length; i < len; i++)
		{
			inst = this.runtime.createInstanceFromInit(this.initial_nonworld[i], null, true);
;
		}
		this.runtime.changelayout = null;
		this.runtime.ClearDeathRow();
		if (this.runtime.ctx && !this.runtime.isDomFree)
		{
			for (i = 0, len = this.runtime.types_by_index.length; i < len; i++)
			{
				t = this.runtime.types_by_index[i];
				if (t.is_family || !t.instances.length || !t.preloadCanvas2D)
					continue;
				t.preloadCanvas2D(this.runtime.ctx);
			}
		}
		/*
		if (this.runtime.glwrap)
		{
			console.log("Estimated VRAM at layout start: " + this.runtime.glwrap.textureCount() + " textures, approx. " + Math.round(this.runtime.glwrap.estimateVRAM() / 1024) + " kb");
		}
		*/
		if (this.runtime.isLoadingState)
		{
			cr.shallowAssignArray(this.runtime.fireOnCreateAfterLoad, created_instances);
		}
		else
		{
			for (i = 0, len = created_instances.length; i < len; i++)
			{
				inst = created_instances[i];
				this.runtime.trigger(Object.getPrototypeOf(inst.type.plugin).cnds.OnCreated, inst);
			}
		}
		cr.clearArray(created_instances);
		if (!this.runtime.isLoadingState)
		{
			this.runtime.trigger(cr.system_object.prototype.cnds.OnLayoutStart, null);
		}
		this.first_visit = false;
	};
	Layout.prototype.createGlobalNonWorlds = function ()
	{
		var i, k, len, initial_inst, inst, type;
		for (i = 0, k = 0, len = this.initial_nonworld.length; i < len; i++)
		{
			initial_inst = this.initial_nonworld[i];
			type = this.runtime.types_by_index[initial_inst[1]];
			if (type.global)
			{
				if (!type.is_contained)
				{
					inst = this.runtime.createInstanceFromInit(initial_inst, null, true);
				}
			}
			else
			{
				this.initial_nonworld[k] = initial_inst;
				k++;
			}
		}
		cr.truncateArray(this.initial_nonworld, k);
	};
	Layout.prototype.stopRunning = function ()
	{
;
		/*
		if (this.runtime.glwrap)
		{
			console.log("Estimated VRAM at layout end: " + this.runtime.glwrap.textureCount() + " textures, approx. " + Math.round(this.runtime.glwrap.estimateVRAM() / 1024) + " kb");
		}
		*/
		if (!this.runtime.isLoadingState)
		{
			this.runtime.trigger(cr.system_object.prototype.cnds.OnLayoutEnd, null);
		}
		this.runtime.isEndingLayout = true;
		cr.clearArray(this.runtime.system.waits);
		var i, leni, j, lenj;
		var layer_instances, inst, type;
		if (!this.first_visit)
		{
			for (i = 0, leni = this.layers.length; i < leni; i++)
			{
				this.layers[i].updateZIndices();
				layer_instances = this.layers[i].instances;
				for (j = 0, lenj = layer_instances.length; j < lenj; j++)
				{
					inst = layer_instances[j];
					if (!inst.type.global)
					{
						if (this.runtime.typeHasPersistBehavior(inst.type))
							this.saveObjectToPersist(inst);
					}
				}
			}
		}
		for (i = 0, leni = this.layers.length; i < leni; i++)
		{
			layer_instances = this.layers[i].instances;
			for (j = 0, lenj = layer_instances.length; j < lenj; j++)
			{
				inst = layer_instances[j];
				if (!inst.type.global)
				{
					this.runtime.DestroyInstance(inst);
				}
			}
			this.runtime.ClearDeathRow();
			cr.clearArray(layer_instances);
			this.layers[i].zindices_stale = true;
		}
		for (i = 0, leni = this.runtime.types_by_index.length; i < leni; i++)
		{
			type = this.runtime.types_by_index[i];
			if (type.global || type.plugin.is_world || type.plugin.singleglobal || type.is_family)
				continue;
			for (j = 0, lenj = type.instances.length; j < lenj; j++)
				this.runtime.DestroyInstance(type.instances[j]);
			this.runtime.ClearDeathRow();
		}
		first_layout = false;
		this.runtime.isEndingLayout = false;
	};
	var temp_rect = new cr.rect(0, 0, 0, 0);
	Layout.prototype.recreateInitialObjects = function (type, x1, y1, x2, y2)
	{
		temp_rect.set(x1, y1, x2, y2);
		var i, len;
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			this.layers[i].recreateInitialObjects(type, temp_rect);
		}
	};
	Layout.prototype.draw = function (ctx)
	{
		var layout_canvas;
		var layout_ctx = ctx;
		var ctx_changed = false;
		var render_offscreen = !this.runtime.fullscreenScalingQuality;
		if (render_offscreen)
		{
			if (!this.runtime.layout_canvas)
			{
				this.runtime.layout_canvas = document.createElement("canvas");
				layout_canvas = this.runtime.layout_canvas;
				layout_canvas.width = this.runtime.draw_width;
				layout_canvas.height = this.runtime.draw_height;
				this.runtime.layout_ctx = layout_canvas.getContext("2d");
				ctx_changed = true;
			}
			layout_canvas = this.runtime.layout_canvas;
			layout_ctx = this.runtime.layout_ctx;
			if (layout_canvas.width !== this.runtime.draw_width)
			{
				layout_canvas.width = this.runtime.draw_width;
				ctx_changed = true;
			}
			if (layout_canvas.height !== this.runtime.draw_height)
			{
				layout_canvas.height = this.runtime.draw_height;
				ctx_changed = true;
			}
			if (ctx_changed)
			{
				this.runtime.setCtxImageSmoothingEnabled(layout_ctx, this.runtime.linearSampling);
			}
		}
		layout_ctx.globalAlpha = 1;
		layout_ctx.globalCompositeOperation = "source-over";
		if (this.runtime.alphaBackground && !this.hasOpaqueBottomLayer())
			layout_ctx.clearRect(0, 0, this.runtime.draw_width, this.runtime.draw_height);
		var i, len, l;
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			l = this.layers[i];
			if (l.visible && l.opacity > 0 && l.blend_mode !== 11 && (l.instances.length || !l.transparent))
				l.draw(layout_ctx);
			else
				l.updateViewport(null);		// even if not drawing, keep viewport up to date
		}
		if (render_offscreen)
		{
			ctx.drawImage(layout_canvas, 0, 0, this.runtime.width, this.runtime.height);
		}
	};
	Layout.prototype.drawGL_earlyZPass = function (glw)
	{
		glw.setEarlyZPass(true);
		if (!this.runtime.layout_tex)
		{
			this.runtime.layout_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
		}
		if (this.runtime.layout_tex.c2width !== this.runtime.draw_width || this.runtime.layout_tex.c2height !== this.runtime.draw_height)
		{
			glw.deleteTexture(this.runtime.layout_tex);
			this.runtime.layout_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
		}
		glw.setRenderingToTexture(this.runtime.layout_tex);
		if (!this.runtime.fullscreenScalingQuality)
		{
			glw.setSize(this.runtime.draw_width, this.runtime.draw_height);
		}
		var i, l;
		for (i = this.layers.length - 1; i >= 0; --i)
		{
			l = this.layers[i];
			if (l.visible && l.opacity === 1 && l.shaders_preserve_opaqueness &&
				l.blend_mode === 0 && (l.instances.length || !l.transparent))
			{
				l.drawGL_earlyZPass(glw);
			}
			else
			{
				l.updateViewport(null);		// even if not drawing, keep viewport up to date
			}
		}
		glw.setEarlyZPass(false);
	};
	Layout.prototype.drawGL = function (glw)
	{
		var render_to_texture = (this.active_effect_types.length > 0 ||
								 this.runtime.uses_background_blending ||
								 !this.runtime.fullscreenScalingQuality ||
								 this.runtime.enableFrontToBack);
		if (render_to_texture)
		{
			if (!this.runtime.layout_tex)
			{
				this.runtime.layout_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			if (this.runtime.layout_tex.c2width !== this.runtime.draw_width || this.runtime.layout_tex.c2height !== this.runtime.draw_height)
			{
				glw.deleteTexture(this.runtime.layout_tex);
				this.runtime.layout_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			glw.setRenderingToTexture(this.runtime.layout_tex);
			if (!this.runtime.fullscreenScalingQuality)
			{
				glw.setSize(this.runtime.draw_width, this.runtime.draw_height);
			}
		}
		else
		{
			if (this.runtime.layout_tex)
			{
				glw.setRenderingToTexture(null);
				glw.deleteTexture(this.runtime.layout_tex);
				this.runtime.layout_tex = null;
			}
		}
		if (this.runtime.alphaBackground && !this.hasOpaqueBottomLayer())
			glw.clear(0, 0, 0, 0);
		var i, len, l;
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			l = this.layers[i];
			if (l.visible && l.opacity > 0 && (l.instances.length || !l.transparent))
				l.drawGL(glw);
			else
				l.updateViewport(null);		// even if not drawing, keep viewport up to date
		}
		if (render_to_texture)
		{
			if (this.active_effect_types.length === 0 ||
				(this.active_effect_types.length === 1 && this.runtime.fullscreenScalingQuality))
			{
				if (this.active_effect_types.length === 1)
				{
					var etindex = this.active_effect_types[0].index;
					glw.switchProgram(this.active_effect_types[0].shaderindex);
					glw.setProgramParameters(null,								// backTex
											 1.0 / this.runtime.draw_width,		// pixelWidth
											 1.0 / this.runtime.draw_height,	// pixelHeight
											 0.0, 0.0,							// destStart
											 1.0, 1.0,							// destEnd
											 this.scale,						// layerScale
											 this.angle,						// layerAngle
											 0.0, 0.0,							// viewOrigin
											 this.runtime.draw_width / 2, this.runtime.draw_height / 2,	// scrollPos
											 this.runtime.kahanTime.sum,		// seconds
											 this.effect_params[etindex]);		// fx parameters
					if (glw.programIsAnimated(this.active_effect_types[0].shaderindex))
						this.runtime.redraw = true;
				}
				else
					glw.switchProgram(0);
				if (!this.runtime.fullscreenScalingQuality)
				{
					glw.setSize(this.runtime.width, this.runtime.height);
				}
				glw.setRenderingToTexture(null);				// to backbuffer
				glw.setDepthTestEnabled(false);					// ignore depth buffer, copy full texture
				glw.setOpacity(1);
				glw.setTexture(this.runtime.layout_tex);
				glw.setAlphaBlend();
				glw.resetModelView();
				glw.updateModelView();
				var halfw = this.runtime.width / 2;
				var halfh = this.runtime.height / 2;
				glw.quad(-halfw, halfh, halfw, halfh, halfw, -halfh, -halfw, -halfh);
				glw.setTexture(null);
				glw.setDepthTestEnabled(true);					// turn depth test back on
			}
			else
			{
				this.renderEffectChain(glw, null, null, null);
			}
		}
	};
	Layout.prototype.getRenderTarget = function()
	{
		if (this.active_effect_types.length > 0 ||
				this.runtime.uses_background_blending ||
				!this.runtime.fullscreenScalingQuality ||
				this.runtime.enableFrontToBack)
		{
			return this.runtime.layout_tex;
		}
		else
		{
			return null;
		}
	};
	Layout.prototype.getMinLayerScale = function ()
	{
		var m = this.layers[0].getScale();
		var i, len, l;
		for (i = 1, len = this.layers.length; i < len; i++)
		{
			l = this.layers[i];
			if (l.parallaxX === 0 && l.parallaxY === 0)
				continue;
			if (l.getScale() < m)
				m = l.getScale();
		}
		return m;
	};
	Layout.prototype.scrollToX = function (x)
	{
		if (!this.unbounded_scrolling)
		{
			var widthBoundary = (this.runtime.draw_width * (1 / this.getMinLayerScale()) / 2);
			if (x > this.width - widthBoundary)
				x = this.width - widthBoundary;
			if (x < widthBoundary)
				x = widthBoundary;
		}
		if (this.scrollX !== x)
		{
			this.scrollX = x;
			this.runtime.redraw = true;
		}
	};
	Layout.prototype.scrollToY = function (y)
	{
		if (!this.unbounded_scrolling)
		{
			var heightBoundary = (this.runtime.draw_height * (1 / this.getMinLayerScale()) / 2);
			if (y > this.height - heightBoundary)
				y = this.height - heightBoundary;
			if (y < heightBoundary)
				y = heightBoundary;
		}
		if (this.scrollY !== y)
		{
			this.scrollY = y;
			this.runtime.redraw = true;
		}
	};
	Layout.prototype.boundScrolling = function ()
	{
		this.scrollToX(this.scrollX);
		this.scrollToY(this.scrollY);
	};
	Layout.prototype.renderEffectChain = function (glw, layer, inst, rendertarget)
	{
		var active_effect_types = inst ?
							inst.active_effect_types :
							layer ?
								layer.active_effect_types :
								this.active_effect_types;
		var layerScale = 1, layerAngle = 0, viewOriginLeft = 0, viewOriginTop = 0, viewOriginRight = this.runtime.draw_width, viewOriginBottom = this.runtime.draw_height;
		if (inst)
		{
			layerScale = inst.layer.getScale();
			layerAngle = inst.layer.getAngle();
			viewOriginLeft = inst.layer.viewLeft;
			viewOriginTop = inst.layer.viewTop;
			viewOriginRight = inst.layer.viewRight;
			viewOriginBottom = inst.layer.viewBottom;
		}
		else if (layer)
		{
			layerScale = layer.getScale();
			layerAngle = layer.getAngle();
			viewOriginLeft = layer.viewLeft;
			viewOriginTop = layer.viewTop;
			viewOriginRight = layer.viewRight;
			viewOriginBottom = layer.viewBottom;
		}
		var fx_tex = this.runtime.fx_tex;
		var i, len, last, temp, fx_index = 0, other_fx_index = 1;
		var y, h;
		var windowWidth = this.runtime.draw_width;
		var windowHeight = this.runtime.draw_height;
		var halfw = windowWidth / 2;
		var halfh = windowHeight / 2;
		var rcTex = layer ? layer.rcTex : this.rcTex;
		var rcTex2 = layer ? layer.rcTex2 : this.rcTex2;
		var screenleft = 0, clearleft = 0;
		var screentop = 0, cleartop = 0;
		var screenright = windowWidth, clearright = windowWidth;
		var screenbottom = windowHeight, clearbottom = windowHeight;
		var boxExtendHorizontal = 0;
		var boxExtendVertical = 0;
		var inst_layer_angle = inst ? inst.layer.getAngle() : 0;
		if (inst)
		{
			for (i = 0, len = active_effect_types.length; i < len; i++)
			{
				boxExtendHorizontal += glw.getProgramBoxExtendHorizontal(active_effect_types[i].shaderindex);
				boxExtendVertical += glw.getProgramBoxExtendVertical(active_effect_types[i].shaderindex);
			}
			var bbox = inst.bbox;
			screenleft = layer.layerToCanvas(bbox.left, bbox.top, true, true);
			screentop = layer.layerToCanvas(bbox.left, bbox.top, false, true);
			screenright = layer.layerToCanvas(bbox.right, bbox.bottom, true, true);
			screenbottom = layer.layerToCanvas(bbox.right, bbox.bottom, false, true);
			if (inst_layer_angle !== 0)
			{
				var screentrx = layer.layerToCanvas(bbox.right, bbox.top, true, true);
				var screentry = layer.layerToCanvas(bbox.right, bbox.top, false, true);
				var screenblx = layer.layerToCanvas(bbox.left, bbox.bottom, true, true);
				var screenbly = layer.layerToCanvas(bbox.left, bbox.bottom, false, true);
				temp = Math.min(screenleft, screenright, screentrx, screenblx);
				screenright = Math.max(screenleft, screenright, screentrx, screenblx);
				screenleft = temp;
				temp = Math.min(screentop, screenbottom, screentry, screenbly);
				screenbottom = Math.max(screentop, screenbottom, screentry, screenbly);
				screentop = temp;
			}
			screenleft -= boxExtendHorizontal;
			screentop -= boxExtendVertical;
			screenright += boxExtendHorizontal;
			screenbottom += boxExtendVertical;
			rcTex2.left = screenleft / windowWidth;
			rcTex2.top = 1 - screentop / windowHeight;
			rcTex2.right = screenright / windowWidth;
			rcTex2.bottom = 1 - screenbottom / windowHeight;
			clearleft = screenleft = cr.floor(screenleft);
			cleartop = screentop = cr.floor(screentop);
			clearright = screenright = cr.ceil(screenright);
			clearbottom = screenbottom = cr.ceil(screenbottom);
			clearleft -= boxExtendHorizontal;
			cleartop -= boxExtendVertical;
			clearright += boxExtendHorizontal;
			clearbottom += boxExtendVertical;
			if (screenleft < 0)					screenleft = 0;
			if (screentop < 0)					screentop = 0;
			if (screenright > windowWidth)		screenright = windowWidth;
			if (screenbottom > windowHeight)	screenbottom = windowHeight;
			if (clearleft < 0)					clearleft = 0;
			if (cleartop < 0)					cleartop = 0;
			if (clearright > windowWidth)		clearright = windowWidth;
			if (clearbottom > windowHeight)		clearbottom = windowHeight;
			rcTex.left = screenleft / windowWidth;
			rcTex.top = 1 - screentop / windowHeight;
			rcTex.right = screenright / windowWidth;
			rcTex.bottom = 1 - screenbottom / windowHeight;
		}
		else
		{
			rcTex.left = rcTex2.left = 0;
			rcTex.top = rcTex2.top = 0;
			rcTex.right = rcTex2.right = 1;
			rcTex.bottom = rcTex2.bottom = 1;
		}
		var pre_draw = (inst && (glw.programUsesDest(active_effect_types[0].shaderindex) || boxExtendHorizontal !== 0 || boxExtendVertical !== 0 || inst.opacity !== 1 || inst.type.plugin.must_predraw)) || (layer && !inst && layer.opacity !== 1);
		glw.setAlphaBlend();
		if (pre_draw)
		{
			if (!fx_tex[fx_index])
			{
				fx_tex[fx_index] = glw.createEmptyTexture(windowWidth, windowHeight, this.runtime.linearSampling);
			}
			if (fx_tex[fx_index].c2width !== windowWidth || fx_tex[fx_index].c2height !== windowHeight)
			{
				glw.deleteTexture(fx_tex[fx_index]);
				fx_tex[fx_index] = glw.createEmptyTexture(windowWidth, windowHeight, this.runtime.linearSampling);
			}
			glw.switchProgram(0);
			glw.setRenderingToTexture(fx_tex[fx_index]);
			h = clearbottom - cleartop;
			y = (windowHeight - cleartop) - h;
			glw.clearRect(clearleft, y, clearright - clearleft, h);
			if (inst)
			{
				inst.drawGL(glw);
			}
			else
			{
				glw.setTexture(this.runtime.layer_tex);
				glw.setOpacity(layer.opacity);
				glw.resetModelView();
				glw.translate(-halfw, -halfh);
				glw.updateModelView();
				glw.quadTex(screenleft, screenbottom, screenright, screenbottom, screenright, screentop, screenleft, screentop, rcTex);
			}
			rcTex2.left = rcTex2.top = 0;
			rcTex2.right = rcTex2.bottom = 1;
			if (inst)
			{
				temp = rcTex.top;
				rcTex.top = rcTex.bottom;
				rcTex.bottom = temp;
			}
			fx_index = 1;
			other_fx_index = 0;
		}
		glw.setOpacity(1);
		var last = active_effect_types.length - 1;
		var post_draw = glw.programUsesCrossSampling(active_effect_types[last].shaderindex) ||
						(!layer && !inst && !this.runtime.fullscreenScalingQuality);
		var etindex = 0;
		for (i = 0, len = active_effect_types.length; i < len; i++)
		{
			if (!fx_tex[fx_index])
			{
				fx_tex[fx_index] = glw.createEmptyTexture(windowWidth, windowHeight, this.runtime.linearSampling);
			}
			if (fx_tex[fx_index].c2width !== windowWidth || fx_tex[fx_index].c2height !== windowHeight)
			{
				glw.deleteTexture(fx_tex[fx_index]);
				fx_tex[fx_index] = glw.createEmptyTexture(windowWidth, windowHeight, this.runtime.linearSampling);
			}
			glw.switchProgram(active_effect_types[i].shaderindex);
			etindex = active_effect_types[i].index;
			if (glw.programIsAnimated(active_effect_types[i].shaderindex))
				this.runtime.redraw = true;
			if (i == 0 && !pre_draw)
			{
				glw.setRenderingToTexture(fx_tex[fx_index]);
				h = clearbottom - cleartop;
				y = (windowHeight - cleartop) - h;
				glw.clearRect(clearleft, y, clearright - clearleft, h);
				if (inst)
				{
					var pixelWidth;
					var pixelHeight;
					if (inst.curFrame && inst.curFrame.texture_img)
					{
						var img = inst.curFrame.texture_img;
						pixelWidth = 1.0 / img.width;
						pixelHeight = 1.0 / img.height;
					}
					else
					{
						pixelWidth = 1.0 / inst.width;
						pixelHeight = 1.0 / inst.height;
					}
					glw.setProgramParameters(rendertarget,					// backTex
											 pixelWidth,
											 pixelHeight,
											 rcTex2.left, rcTex2.top,		// destStart
											 rcTex2.right, rcTex2.bottom,	// destEnd
											 layerScale,
											 layerAngle,
											 viewOriginLeft, viewOriginTop,
											 (viewOriginLeft + viewOriginRight) / 2, (viewOriginTop + viewOriginBottom) / 2,
											 this.runtime.kahanTime.sum,
											 inst.effect_params[etindex]);	// fx params
					inst.drawGL(glw);
				}
				else
				{
					glw.setProgramParameters(rendertarget,					// backTex
											 1.0 / windowWidth,				// pixelWidth
											 1.0 / windowHeight,			// pixelHeight
											 0.0, 0.0,						// destStart
											 1.0, 1.0,						// destEnd
											 layerScale,
											 layerAngle,
											 viewOriginLeft, viewOriginTop,
											 (viewOriginLeft + viewOriginRight) / 2, (viewOriginTop + viewOriginBottom) / 2,
											 this.runtime.kahanTime.sum,
											 layer ?						// fx params
												layer.effect_params[etindex] :
												this.effect_params[etindex]);
					glw.setTexture(layer ? this.runtime.layer_tex : this.runtime.layout_tex);
					glw.resetModelView();
					glw.translate(-halfw, -halfh);
					glw.updateModelView();
					glw.quadTex(screenleft, screenbottom, screenright, screenbottom, screenright, screentop, screenleft, screentop, rcTex);
				}
				rcTex2.left = rcTex2.top = 0;
				rcTex2.right = rcTex2.bottom = 1;
				if (inst && !post_draw)
				{
					temp = screenbottom;
					screenbottom = screentop;
					screentop = temp;
				}
			}
			else
			{
				glw.setProgramParameters(rendertarget,						// backTex
										 1.0 / windowWidth,					// pixelWidth
										 1.0 / windowHeight,				// pixelHeight
										 rcTex2.left, rcTex2.top,			// destStart
										 rcTex2.right, rcTex2.bottom,		// destEnd
										 layerScale,
										 layerAngle,
										 viewOriginLeft, viewOriginTop,
										 (viewOriginLeft + viewOriginRight) / 2, (viewOriginTop + viewOriginBottom) / 2,
										 this.runtime.kahanTime.sum,
										 inst ?								// fx params
											inst.effect_params[etindex] :
											layer ?
												layer.effect_params[etindex] :
												this.effect_params[etindex]);
				glw.setTexture(null);
				if (i === last && !post_draw)
				{
					if (inst)
						glw.setBlend(inst.srcBlend, inst.destBlend);
					else if (layer)
						glw.setBlend(layer.srcBlend, layer.destBlend);
					glw.setRenderingToTexture(rendertarget);
				}
				else
				{
					glw.setRenderingToTexture(fx_tex[fx_index]);
					h = clearbottom - cleartop;
					y = (windowHeight - cleartop) - h;
					glw.clearRect(clearleft, y, clearright - clearleft, h);
				}
				glw.setTexture(fx_tex[other_fx_index]);
				glw.resetModelView();
				glw.translate(-halfw, -halfh);
				glw.updateModelView();
				glw.quadTex(screenleft, screenbottom, screenright, screenbottom, screenright, screentop, screenleft, screentop, rcTex);
				if (i === last && !post_draw)
					glw.setTexture(null);
			}
			fx_index = (fx_index === 0 ? 1 : 0);
			other_fx_index = (fx_index === 0 ? 1 : 0);		// will be opposite to fx_index since it was just assigned
		}
		if (post_draw)
		{
			glw.switchProgram(0);
			if (inst)
				glw.setBlend(inst.srcBlend, inst.destBlend);
			else if (layer)
				glw.setBlend(layer.srcBlend, layer.destBlend);
			else
			{
				if (!this.runtime.fullscreenScalingQuality)
				{
					glw.setSize(this.runtime.width, this.runtime.height);
					halfw = this.runtime.width / 2;
					halfh = this.runtime.height / 2;
					screenleft = 0;
					screentop = 0;
					screenright = this.runtime.width;
					screenbottom = this.runtime.height;
				}
			}
			glw.setRenderingToTexture(rendertarget);
			glw.setTexture(fx_tex[other_fx_index]);
			glw.resetModelView();
			glw.translate(-halfw, -halfh);
			glw.updateModelView();
			if (inst && active_effect_types.length === 1 && !pre_draw)
				glw.quadTex(screenleft, screentop, screenright, screentop, screenright, screenbottom, screenleft, screenbottom, rcTex);
			else
				glw.quadTex(screenleft, screenbottom, screenright, screenbottom, screenright, screentop, screenleft, screentop, rcTex);
			glw.setTexture(null);
		}
	};
	Layout.prototype.getLayerBySid = function (sid_)
	{
		var i, len;
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			if (this.layers[i].sid === sid_)
				return this.layers[i];
		}
		return null;
	};
	Layout.prototype.saveToJSON = function ()
	{
		var i, len, layer, et;
		var o = {
			"sx": this.scrollX,
			"sy": this.scrollY,
			"s": this.scale,
			"a": this.angle,
			"w": this.width,
			"h": this.height,
			"fv": this.first_visit,			// added r127
			"persist": this.persist_data,
			"fx": [],
			"layers": {}
		};
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			o["fx"].push({"name": et.name, "active": et.active, "params": this.effect_params[et.index] });
		}
		for (i = 0, len = this.layers.length; i < len; i++)
		{
			layer = this.layers[i];
			o["layers"][layer.sid.toString()] = layer.saveToJSON();
		}
		return o;
	};
	Layout.prototype.loadFromJSON = function (o)
	{
		var i, j, len, fx, p, layer;
		this.scrollX = o["sx"];
		this.scrollY = o["sy"];
		this.scale = o["s"];
		this.angle = o["a"];
		this.width = o["w"];
		this.height = o["h"];
		this.persist_data = o["persist"];
		if (typeof o["fv"] !== "undefined")
			this.first_visit = o["fv"];
		var ofx = o["fx"];
		for (i = 0, len = ofx.length; i < len; i++)
		{
			fx = this.getEffectByName(ofx[i]["name"]);
			if (!fx)
				continue;		// must've gone missing
			fx.active = ofx[i]["active"];
			this.effect_params[fx.index] = ofx[i]["params"];
		}
		this.updateActiveEffects();
		var olayers = o["layers"];
		for (p in olayers)
		{
			if (olayers.hasOwnProperty(p))
			{
				layer = this.getLayerBySid(parseInt(p, 10));
				if (!layer)
					continue;		// must've gone missing
				layer.loadFromJSON(olayers[p]);
			}
		}
	};
	cr.layout = Layout;
	function Layer(layout, m)
	{
		this.layout = layout;
		this.runtime = layout.runtime;
		this.instances = [];        // running instances
		this.scale = 1.0;
		this.angle = 0;
		this.disableAngle = false;
		this.tmprect = new cr.rect(0, 0, 0, 0);
		this.tmpquad = new cr.quad();
		this.viewLeft = 0;
		this.viewRight = 0;
		this.viewTop = 0;
		this.viewBottom = 0;
		this.zindices_stale = false;
		this.zindices_stale_from = -1;		// first index that has changed, or -1 if no bound
		this.clear_earlyz_index = 0;
		this.name = m[0];
		this.index = m[1];
		this.sid = m[2];
		this.visible = m[3];		// initially visible
		this.background_color = m[4];
		this.transparent = m[5];
		this.parallaxX = m[6];
		this.parallaxY = m[7];
		this.opacity = m[8];
		this.forceOwnTexture = m[9];
		this.useRenderCells = m[10];
		this.zoomRate = m[11];
		this.blend_mode = m[12];
		this.effect_fallback = m[13];
		this.compositeOp = "source-over";
		this.srcBlend = 0;
		this.destBlend = 0;
		this.render_grid = null;
		this.last_render_list = alloc_arr();
		this.render_list_stale = true;
		this.last_render_cells = new cr.rect(0, 0, -1, -1);
		this.cur_render_cells = new cr.rect(0, 0, -1, -1);
		if (this.useRenderCells)
		{
			this.render_grid = new cr.RenderGrid(this.runtime.original_width, this.runtime.original_height);
		}
		this.render_offscreen = false;
		var im = m[14];
		var i, len;
		this.startup_initial_instances = [];		// for restoring initial_instances after load
		this.initial_instances = [];
		this.created_globals = [];		// global object UIDs already created - for save/load to avoid recreating
		for (i = 0, len = im.length; i < len; i++)
		{
			var inst = im[i];
			var type = this.runtime.types_by_index[inst[1]];
;
			if (!type.default_instance)
			{
				type.default_instance = inst;
				type.default_layerindex = this.index;
			}
			this.initial_instances.push(inst);
			if (this.layout.initial_types.indexOf(type) === -1)
				this.layout.initial_types.push(type);
		}
		cr.shallowAssignArray(this.startup_initial_instances, this.initial_instances);
		this.effect_types = [];
		this.active_effect_types = [];
		this.shaders_preserve_opaqueness = true;
		this.effect_params = [];
		for (i = 0, len = m[15].length; i < len; i++)
		{
			this.effect_types.push({
				id: m[15][i][0],
				name: m[15][i][1],
				shaderindex: -1,
				preservesOpaqueness: false,
				active: true,
				index: i
			});
			this.effect_params.push(m[15][i][2].slice(0));
		}
		this.updateActiveEffects();
		this.rcTex = new cr.rect(0, 0, 1, 1);
		this.rcTex2 = new cr.rect(0, 0, 1, 1);
	};
	Layer.prototype.updateActiveEffects = function ()
	{
		cr.clearArray(this.active_effect_types);
		this.shaders_preserve_opaqueness = true;
		var i, len, et;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			if (et.active)
			{
				this.active_effect_types.push(et);
				if (!et.preservesOpaqueness)
					this.shaders_preserve_opaqueness = false;
			}
		}
	};
	Layer.prototype.getEffectByName = function (name_)
	{
		var i, len, et;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			if (et.name === name_)
				return et;
		}
		return null;
	};
	Layer.prototype.createInitialInstances = function ()
	{
		var i, k, len, inst, initial_inst, type, keep, hasPersistBehavior;
		for (i = 0, k = 0, len = this.initial_instances.length; i < len; i++)
		{
			initial_inst = this.initial_instances[i];
			type = this.runtime.types_by_index[initial_inst[1]];
;
			hasPersistBehavior = this.runtime.typeHasPersistBehavior(type);
			keep = true;
			if (!hasPersistBehavior || this.layout.first_visit)
			{
				inst = this.runtime.createInstanceFromInit(initial_inst, this, true);
				if (!inst)
					continue;		// may have skipped creation due to fallback effect "destroy"
				created_instances.push(inst);
				if (inst.type.global)
				{
					keep = false;
					this.created_globals.push(inst.uid);
				}
			}
			if (keep)
			{
				this.initial_instances[k] = this.initial_instances[i];
				k++;
			}
		}
		this.initial_instances.length = k;
		this.runtime.ClearDeathRow();		// flushes creation row so IIDs will be correct
		if (!this.runtime.glwrap && this.effect_types.length)	// no WebGL renderer and shaders used
			this.blend_mode = this.effect_fallback;				// use fallback blend mode
		this.compositeOp = cr.effectToCompositeOp(this.blend_mode);
		if (this.runtime.gl)
			cr.setGLBlend(this, this.blend_mode, this.runtime.gl);
		this.render_list_stale = true;
	};
	Layer.prototype.recreateInitialObjects = function (only_type, rc)
	{
		var i, len, initial_inst, type, wm, x, y, inst, j, lenj, s;
		var types_by_index = this.runtime.types_by_index;
		var only_type_is_family = only_type.is_family;
		var only_type_members = only_type.members;
		for (i = 0, len = this.initial_instances.length; i < len; ++i)
		{
			initial_inst = this.initial_instances[i];
			wm = initial_inst[0];
			x = wm[0];
			y = wm[1];
			if (!rc.contains_pt(x, y))
				continue;		// not in the given area
			type = types_by_index[initial_inst[1]];
			if (type !== only_type)
			{
				if (only_type_is_family)
				{
					if (only_type_members.indexOf(type) < 0)
						continue;
				}
				else
					continue;		// only_type is not a family, and the initial inst type does not match
			}
			inst = this.runtime.createInstanceFromInit(initial_inst, this, false);
			this.runtime.isInOnDestroy++;
			this.runtime.trigger(Object.getPrototypeOf(type.plugin).cnds.OnCreated, inst);
			if (inst.is_contained)
			{
				for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
				{
					s = inst.siblings[i];
					this.runtime.trigger(Object.getPrototypeOf(s.type.plugin).cnds.OnCreated, s);
				}
			}
			this.runtime.isInOnDestroy--;
		}
	};
	Layer.prototype.removeFromInstanceList = function (inst, remove_from_grid)
	{
		var index = cr.fastIndexOf(this.instances, inst);
		if (index < 0)
			return;		// not found
		if (remove_from_grid && this.useRenderCells && inst.rendercells && inst.rendercells.right >= inst.rendercells.left)
		{
			inst.update_bbox();											// make sure actually in its current rendercells
			this.render_grid.update(inst, inst.rendercells, null);		// no new range provided - remove only
			inst.rendercells.set(0, 0, -1, -1);							// set to invalid state to indicate not inserted
		}
		if (index === this.instances.length - 1)
			this.instances.pop();
		else
		{
			cr.arrayRemove(this.instances, index);
			this.setZIndicesStaleFrom(index);
		}
		this.render_list_stale = true;
	};
	Layer.prototype.appendToInstanceList = function (inst, add_to_grid)
	{
;
		inst.zindex = this.instances.length;
		this.instances.push(inst);
		if (add_to_grid && this.useRenderCells && inst.rendercells)
		{
			inst.set_bbox_changed();		// will cause immediate update and new insertion to grid
		}
		this.render_list_stale = true;
	};
	Layer.prototype.prependToInstanceList = function (inst, add_to_grid)
	{
;
		this.instances.unshift(inst);
		this.setZIndicesStaleFrom(0);
		if (add_to_grid && this.useRenderCells && inst.rendercells)
		{
			inst.set_bbox_changed();		// will cause immediate update and new insertion to grid
		}
	};
	Layer.prototype.moveInstanceAdjacent = function (inst, other, isafter)
	{
;
		var myZ = inst.get_zindex();
		var insertZ = other.get_zindex();
		cr.arrayRemove(this.instances, myZ);
		if (myZ < insertZ)
			insertZ--;
		if (isafter)
			insertZ++;
		if (insertZ === this.instances.length)
			this.instances.push(inst);
		else
			this.instances.splice(insertZ, 0, inst);
		this.setZIndicesStaleFrom(myZ < insertZ ? myZ : insertZ);
	};
	Layer.prototype.setZIndicesStaleFrom = function (index)
	{
		if (this.zindices_stale_from === -1)			// not yet set
			this.zindices_stale_from = index;
		else if (index < this.zindices_stale_from)		// determine minimum z index affected
			this.zindices_stale_from = index;
		this.zindices_stale = true;
		this.render_list_stale = true;
	};
	Layer.prototype.updateZIndices = function ()
	{
		if (!this.zindices_stale)
			return;
		if (this.zindices_stale_from === -1)
			this.zindices_stale_from = 0;
		var i, len, inst;
		if (this.useRenderCells)
		{
			for (i = this.zindices_stale_from, len = this.instances.length; i < len; ++i)
			{
				inst = this.instances[i];
				inst.zindex = i;
				this.render_grid.markRangeChanged(inst.rendercells);
			}
		}
		else
		{
			for (i = this.zindices_stale_from, len = this.instances.length; i < len; ++i)
			{
				this.instances[i].zindex = i;
			}
		}
		this.zindices_stale = false;
		this.zindices_stale_from = -1;
	};
	Layer.prototype.getScale = function (include_aspect)
	{
		return this.getNormalScale() * (this.runtime.fullscreenScalingQuality || include_aspect ? this.runtime.aspect_scale : 1);
	};
	Layer.prototype.getNormalScale = function ()
	{
		return ((this.scale * this.layout.scale) - 1) * this.zoomRate + 1;
	};
	Layer.prototype.getAngle = function ()
	{
		if (this.disableAngle)
			return 0;
		return cr.clamp_angle(this.layout.angle + this.angle);
	};
	var arr_cache = [];
	function alloc_arr()
	{
		if (arr_cache.length)
			return arr_cache.pop();
		else
			return [];
	}
	function free_arr(a)
	{
		cr.clearArray(a);
		arr_cache.push(a);
	};
	function mergeSortedZArrays(a, b, out)
	{
		var i = 0, j = 0, k = 0, lena = a.length, lenb = b.length, ai, bj;
		out.length = lena + lenb;
		for ( ; i < lena && j < lenb; ++k)
		{
			ai = a[i];
			bj = b[j];
			if (ai.zindex < bj.zindex)
			{
				out[k] = ai;
				++i;
			}
			else
			{
				out[k] = bj;
				++j;
			}
		}
		for ( ; i < lena; ++i, ++k)
			out[k] = a[i];
		for ( ; j < lenb; ++j, ++k)
			out[k] = b[j];
	};
	var next_arr = [];
	function mergeAllSortedZArrays_pass(arr, first_pass)
	{
		var i, len, arr1, arr2, out;
		for (i = 0, len = arr.length; i < len - 1; i += 2)
		{
			arr1 = arr[i];
			arr2 = arr[i+1];
			out = alloc_arr();
			mergeSortedZArrays(arr1, arr2, out);
			if (!first_pass)
			{
				free_arr(arr1);
				free_arr(arr2);
			}
			next_arr.push(out);
		}
		if (len % 2 === 1)
		{
			if (first_pass)
			{
				arr1 = alloc_arr();
				cr.shallowAssignArray(arr1, arr[len - 1]);
				next_arr.push(arr1);
			}
			else
			{
				next_arr.push(arr[len - 1]);
			}
		}
		cr.shallowAssignArray(arr, next_arr);
		cr.clearArray(next_arr);
	};
	function mergeAllSortedZArrays(arr)
	{
		var first_pass = true;
		while (arr.length > 1)
		{
			mergeAllSortedZArrays_pass(arr, first_pass);
			first_pass = false;
		}
		return arr[0];
	};
	var render_arr = [];
	Layer.prototype.getRenderCellInstancesToDraw = function ()
	{
;
		this.updateZIndices();
		this.render_grid.queryRange(this.viewLeft, this.viewTop, this.viewRight, this.viewBottom, render_arr);
		if (!render_arr.length)
			return alloc_arr();
		if (render_arr.length === 1)
		{
			var a = alloc_arr();
			cr.shallowAssignArray(a, render_arr[0]);
			cr.clearArray(render_arr);
			return a;
		}
		var draw_list = mergeAllSortedZArrays(render_arr);
		cr.clearArray(render_arr);
		return draw_list;
	};
	Layer.prototype.draw = function (ctx)
	{
		this.render_offscreen = (this.forceOwnTexture || this.opacity !== 1.0 || this.blend_mode !== 0);
		var layer_canvas = this.runtime.canvas;
		var layer_ctx = ctx;
		var ctx_changed = false;
		if (this.render_offscreen)
		{
			if (!this.runtime.layer_canvas)
			{
				this.runtime.layer_canvas = document.createElement("canvas");
;
				layer_canvas = this.runtime.layer_canvas;
				layer_canvas.width = this.runtime.draw_width;
				layer_canvas.height = this.runtime.draw_height;
				this.runtime.layer_ctx = layer_canvas.getContext("2d");
;
				ctx_changed = true;
			}
			layer_canvas = this.runtime.layer_canvas;
			layer_ctx = this.runtime.layer_ctx;
			if (layer_canvas.width !== this.runtime.draw_width)
			{
				layer_canvas.width = this.runtime.draw_width;
				ctx_changed = true;
			}
			if (layer_canvas.height !== this.runtime.draw_height)
			{
				layer_canvas.height = this.runtime.draw_height;
				ctx_changed = true;
			}
			if (ctx_changed)
			{
				this.runtime.setCtxImageSmoothingEnabled(layer_ctx, this.runtime.linearSampling);
			}
			if (this.transparent)
				layer_ctx.clearRect(0, 0, this.runtime.draw_width, this.runtime.draw_height);
		}
		layer_ctx.globalAlpha = 1;
		layer_ctx.globalCompositeOperation = "source-over";
		if (!this.transparent)
		{
			layer_ctx.fillStyle = "rgb(" + this.background_color[0] + "," + this.background_color[1] + "," + this.background_color[2] + ")";
			layer_ctx.fillRect(0, 0, this.runtime.draw_width, this.runtime.draw_height);
		}
		layer_ctx.save();
		this.disableAngle = true;
		var px = this.canvasToLayer(0, 0, true, true);
		var py = this.canvasToLayer(0, 0, false, true);
		this.disableAngle = false;
		if (this.runtime.pixel_rounding)
		{
			px = Math.round(px);
			py = Math.round(py);
		}
		this.rotateViewport(px, py, layer_ctx);
		var myscale = this.getScale();
		layer_ctx.scale(myscale, myscale);
		layer_ctx.translate(-px, -py);
		var instances_to_draw;
		if (this.useRenderCells)
		{
			this.cur_render_cells.left = this.render_grid.XToCell(this.viewLeft);
			this.cur_render_cells.top = this.render_grid.YToCell(this.viewTop);
			this.cur_render_cells.right = this.render_grid.XToCell(this.viewRight);
			this.cur_render_cells.bottom = this.render_grid.YToCell(this.viewBottom);
			if (this.render_list_stale || !this.cur_render_cells.equals(this.last_render_cells))
			{
				free_arr(this.last_render_list);
				instances_to_draw = this.getRenderCellInstancesToDraw();
				this.render_list_stale = false;
				this.last_render_cells.copy(this.cur_render_cells);
			}
			else
				instances_to_draw = this.last_render_list;
		}
		else
			instances_to_draw = this.instances;
		var i, len, inst, last_inst = null;
		for (i = 0, len = instances_to_draw.length; i < len; ++i)
		{
			inst = instances_to_draw[i];
			if (inst === last_inst)
				continue;
			this.drawInstance(inst, layer_ctx);
			last_inst = inst;
		}
		if (this.useRenderCells)
			this.last_render_list = instances_to_draw;
		layer_ctx.restore();
		if (this.render_offscreen)
		{
			ctx.globalCompositeOperation = this.compositeOp;
			ctx.globalAlpha = this.opacity;
			ctx.drawImage(layer_canvas, 0, 0);
		}
	};
	Layer.prototype.drawInstance = function(inst, layer_ctx)
	{
		if (!inst.visible || inst.width === 0 || inst.height === 0)
			return;
		inst.update_bbox();
		var bbox = inst.bbox;
		if (bbox.right < this.viewLeft || bbox.bottom < this.viewTop || bbox.left > this.viewRight || bbox.top > this.viewBottom)
			return;
		layer_ctx.globalCompositeOperation = inst.compositeOp;
		inst.draw(layer_ctx);
	};
	Layer.prototype.updateViewport = function (ctx)
	{
		this.disableAngle = true;
		var px = this.canvasToLayer(0, 0, true, true);
		var py = this.canvasToLayer(0, 0, false, true);
		this.disableAngle = false;
		if (this.runtime.pixel_rounding)
		{
			px = Math.round(px);
			py = Math.round(py);
		}
		this.rotateViewport(px, py, ctx);
	};
	Layer.prototype.rotateViewport = function (px, py, ctx)
	{
		var myscale = this.getScale();
		this.viewLeft = px;
		this.viewTop = py;
		this.viewRight = px + (this.runtime.draw_width * (1 / myscale));
		this.viewBottom = py + (this.runtime.draw_height * (1 / myscale));
		var temp;
		if (this.viewLeft > this.viewRight)
		{
			temp = this.viewLeft;
			this.viewLeft = this.viewRight;
			this.viewRight = temp;
		}
		if (this.viewTop > this.viewBottom)
		{
			temp = this.viewTop;
			this.viewTop = this.viewBottom;
			this.viewBottom = temp;
		}
		var myAngle = this.getAngle();
		if (myAngle !== 0)
		{
			if (ctx)
			{
				ctx.translate(this.runtime.draw_width / 2, this.runtime.draw_height / 2);
				ctx.rotate(-myAngle);
				ctx.translate(this.runtime.draw_width / -2, this.runtime.draw_height / -2);
			}
			this.tmprect.set(this.viewLeft, this.viewTop, this.viewRight, this.viewBottom);
			this.tmprect.offset((this.viewLeft + this.viewRight) / -2, (this.viewTop + this.viewBottom) / -2);
			this.tmpquad.set_from_rotated_rect(this.tmprect, myAngle);
			this.tmpquad.bounding_box(this.tmprect);
			this.tmprect.offset((this.viewLeft + this.viewRight) / 2, (this.viewTop + this.viewBottom) / 2);
			this.viewLeft = this.tmprect.left;
			this.viewTop = this.tmprect.top;
			this.viewRight = this.tmprect.right;
			this.viewBottom = this.tmprect.bottom;
		}
	}
	Layer.prototype.drawGL_earlyZPass = function (glw)
	{
		var windowWidth = this.runtime.draw_width;
		var windowHeight = this.runtime.draw_height;
		var shaderindex = 0;
		var etindex = 0;
		this.render_offscreen = this.forceOwnTexture;
		if (this.render_offscreen)
		{
			if (!this.runtime.layer_tex)
			{
				this.runtime.layer_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			if (this.runtime.layer_tex.c2width !== this.runtime.draw_width || this.runtime.layer_tex.c2height !== this.runtime.draw_height)
			{
				glw.deleteTexture(this.runtime.layer_tex);
				this.runtime.layer_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			glw.setRenderingToTexture(this.runtime.layer_tex);
		}
		this.disableAngle = true;
		var px = this.canvasToLayer(0, 0, true, true);
		var py = this.canvasToLayer(0, 0, false, true);
		this.disableAngle = false;
		if (this.runtime.pixel_rounding)
		{
			px = Math.round(px);
			py = Math.round(py);
		}
		this.rotateViewport(px, py, null);
		var myscale = this.getScale();
		glw.resetModelView();
		glw.scale(myscale, myscale);
		glw.rotateZ(-this.getAngle());
		glw.translate((this.viewLeft + this.viewRight) / -2, (this.viewTop + this.viewBottom) / -2);
		glw.updateModelView();
		var instances_to_draw;
		if (this.useRenderCells)
		{
			this.cur_render_cells.left = this.render_grid.XToCell(this.viewLeft);
			this.cur_render_cells.top = this.render_grid.YToCell(this.viewTop);
			this.cur_render_cells.right = this.render_grid.XToCell(this.viewRight);
			this.cur_render_cells.bottom = this.render_grid.YToCell(this.viewBottom);
			if (this.render_list_stale || !this.cur_render_cells.equals(this.last_render_cells))
			{
				free_arr(this.last_render_list);
				instances_to_draw = this.getRenderCellInstancesToDraw();
				this.render_list_stale = false;
				this.last_render_cells.copy(this.cur_render_cells);
			}
			else
				instances_to_draw = this.last_render_list;
		}
		else
			instances_to_draw = this.instances;
		var i, inst, last_inst = null;
		for (i = instances_to_draw.length - 1; i >= 0; --i)
		{
			inst = instances_to_draw[i];
			if (inst === last_inst)
				continue;
			this.drawInstanceGL_earlyZPass(instances_to_draw[i], glw);
			last_inst = inst;
		}
		if (this.useRenderCells)
			this.last_render_list = instances_to_draw;
		if (!this.transparent)
		{
			this.clear_earlyz_index = this.runtime.earlyz_index++;
			glw.setEarlyZIndex(this.clear_earlyz_index);
			glw.setColorFillMode(1, 1, 1, 1);
			glw.fullscreenQuad();		// fill remaining space in depth buffer with current Z value
			glw.restoreEarlyZMode();
		}
	};
	Layer.prototype.drawGL = function (glw)
	{
		var windowWidth = this.runtime.draw_width;
		var windowHeight = this.runtime.draw_height;
		var shaderindex = 0;
		var etindex = 0;
		this.render_offscreen = (this.forceOwnTexture || this.opacity !== 1.0 || this.active_effect_types.length > 0 || this.blend_mode !== 0);
		if (this.render_offscreen)
		{
			if (!this.runtime.layer_tex)
			{
				this.runtime.layer_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			if (this.runtime.layer_tex.c2width !== this.runtime.draw_width || this.runtime.layer_tex.c2height !== this.runtime.draw_height)
			{
				glw.deleteTexture(this.runtime.layer_tex);
				this.runtime.layer_tex = glw.createEmptyTexture(this.runtime.draw_width, this.runtime.draw_height, this.runtime.linearSampling);
			}
			glw.setRenderingToTexture(this.runtime.layer_tex);
			if (this.transparent)
				glw.clear(0, 0, 0, 0);
		}
		if (!this.transparent)
		{
			if (this.runtime.enableFrontToBack)
			{
				glw.setEarlyZIndex(this.clear_earlyz_index);
				glw.setColorFillMode(this.background_color[0] / 255, this.background_color[1] / 255, this.background_color[2] / 255, 1);
				glw.fullscreenQuad();
				glw.setTextureFillMode();
			}
			else
			{
				glw.clear(this.background_color[0] / 255, this.background_color[1] / 255, this.background_color[2] / 255, 1);
			}
		}
		this.disableAngle = true;
		var px = this.canvasToLayer(0, 0, true, true);
		var py = this.canvasToLayer(0, 0, false, true);
		this.disableAngle = false;
		if (this.runtime.pixel_rounding)
		{
			px = Math.round(px);
			py = Math.round(py);
		}
		this.rotateViewport(px, py, null);
		var myscale = this.getScale();
		glw.resetModelView();
		glw.scale(myscale, myscale);
		glw.rotateZ(-this.getAngle());
		glw.translate((this.viewLeft + this.viewRight) / -2, (this.viewTop + this.viewBottom) / -2);
		glw.updateModelView();
		var instances_to_draw;
		if (this.useRenderCells)
		{
			this.cur_render_cells.left = this.render_grid.XToCell(this.viewLeft);
			this.cur_render_cells.top = this.render_grid.YToCell(this.viewTop);
			this.cur_render_cells.right = this.render_grid.XToCell(this.viewRight);
			this.cur_render_cells.bottom = this.render_grid.YToCell(this.viewBottom);
			if (this.render_list_stale || !this.cur_render_cells.equals(this.last_render_cells))
			{
				free_arr(this.last_render_list);
				instances_to_draw = this.getRenderCellInstancesToDraw();
				this.render_list_stale = false;
				this.last_render_cells.copy(this.cur_render_cells);
			}
			else
				instances_to_draw = this.last_render_list;
		}
		else
			instances_to_draw = this.instances;
		var i, len, inst, last_inst = null;
		for (i = 0, len = instances_to_draw.length; i < len; ++i)
		{
			inst = instances_to_draw[i];
			if (inst === last_inst)
				continue;
			this.drawInstanceGL(instances_to_draw[i], glw);
			last_inst = inst;
		}
		if (this.useRenderCells)
			this.last_render_list = instances_to_draw;
		if (this.render_offscreen)
		{
			shaderindex = this.active_effect_types.length ? this.active_effect_types[0].shaderindex : 0;
			etindex = this.active_effect_types.length ? this.active_effect_types[0].index : 0;
			if (this.active_effect_types.length === 0 || (this.active_effect_types.length === 1 &&
				!glw.programUsesCrossSampling(shaderindex) && this.opacity === 1))
			{
				if (this.active_effect_types.length === 1)
				{
					glw.switchProgram(shaderindex);
					glw.setProgramParameters(this.layout.getRenderTarget(),		// backTex
											 1.0 / this.runtime.draw_width,		// pixelWidth
											 1.0 / this.runtime.draw_height,	// pixelHeight
											 0.0, 0.0,							// destStart
											 1.0, 1.0,							// destEnd
											 myscale,							// layerScale
											 this.getAngle(),
											 this.viewLeft, this.viewTop,
											 (this.viewLeft + this.viewRight) / 2, (this.viewTop + this.viewBottom) / 2,
											 this.runtime.kahanTime.sum,
											 this.effect_params[etindex]);		// fx parameters
					if (glw.programIsAnimated(shaderindex))
						this.runtime.redraw = true;
				}
				else
					glw.switchProgram(0);
				glw.setRenderingToTexture(this.layout.getRenderTarget());
				glw.setOpacity(this.opacity);
				glw.setTexture(this.runtime.layer_tex);
				glw.setBlend(this.srcBlend, this.destBlend);
				glw.resetModelView();
				glw.updateModelView();
				var halfw = this.runtime.draw_width / 2;
				var halfh = this.runtime.draw_height / 2;
				glw.quad(-halfw, halfh, halfw, halfh, halfw, -halfh, -halfw, -halfh);
				glw.setTexture(null);
			}
			else
			{
				this.layout.renderEffectChain(glw, this, null, this.layout.getRenderTarget());
			}
		}
	};
	Layer.prototype.drawInstanceGL = function (inst, glw)
	{
;
		if (!inst.visible || inst.width === 0 || inst.height === 0)
			return;
		inst.update_bbox();
		var bbox = inst.bbox;
		if (bbox.right < this.viewLeft || bbox.bottom < this.viewTop || bbox.left > this.viewRight || bbox.top > this.viewBottom)
			return;
		glw.setEarlyZIndex(inst.earlyz_index);
		if (inst.uses_shaders)
		{
			this.drawInstanceWithShadersGL(inst, glw);
		}
		else
		{
			glw.switchProgram(0);		// un-set any previously set shader
			glw.setBlend(inst.srcBlend, inst.destBlend);
			inst.drawGL(glw);
		}
	};
	Layer.prototype.drawInstanceGL_earlyZPass = function (inst, glw)
	{
;
		if (!inst.visible || inst.width === 0 || inst.height === 0)
			return;
		inst.update_bbox();
		var bbox = inst.bbox;
		if (bbox.right < this.viewLeft || bbox.bottom < this.viewTop || bbox.left > this.viewRight || bbox.top > this.viewBottom)
			return;
		inst.earlyz_index = this.runtime.earlyz_index++;
		if (inst.blend_mode !== 0 || inst.opacity !== 1 || !inst.shaders_preserve_opaqueness || !inst.drawGL_earlyZPass)
			return;
		glw.setEarlyZIndex(inst.earlyz_index);
		inst.drawGL_earlyZPass(glw);
	};
	Layer.prototype.drawInstanceWithShadersGL = function (inst, glw)
	{
		var shaderindex = inst.active_effect_types[0].shaderindex;
		var etindex = inst.active_effect_types[0].index;
		var myscale = this.getScale();
		if (inst.active_effect_types.length === 1 && !glw.programUsesCrossSampling(shaderindex) &&
			!glw.programExtendsBox(shaderindex) && ((!inst.angle && !inst.layer.getAngle()) || !glw.programUsesDest(shaderindex)) &&
			inst.opacity === 1 && !inst.type.plugin.must_predraw)
		{
			glw.switchProgram(shaderindex);
			glw.setBlend(inst.srcBlend, inst.destBlend);
			if (glw.programIsAnimated(shaderindex))
				this.runtime.redraw = true;
			var destStartX = 0, destStartY = 0, destEndX = 0, destEndY = 0;
			if (glw.programUsesDest(shaderindex))
			{
				var bbox = inst.bbox;
				var screenleft = this.layerToCanvas(bbox.left, bbox.top, true, true);
				var screentop = this.layerToCanvas(bbox.left, bbox.top, false, true);
				var screenright = this.layerToCanvas(bbox.right, bbox.bottom, true, true);
				var screenbottom = this.layerToCanvas(bbox.right, bbox.bottom, false, true);
				destStartX = screenleft / windowWidth;
				destStartY = 1 - screentop / windowHeight;
				destEndX = screenright / windowWidth;
				destEndY = 1 - screenbottom / windowHeight;
			}
			var pixelWidth;
			var pixelHeight;
			if (inst.curFrame && inst.curFrame.texture_img)
			{
				var img = inst.curFrame.texture_img;
				pixelWidth = 1.0 / img.width;
				pixelHeight = 1.0 / img.height;
			}
			else
			{
				pixelWidth = 1.0 / inst.width;
				pixelHeight = 1.0 / inst.height;
			}
			glw.setProgramParameters(this.render_offscreen ? this.runtime.layer_tex : this.layout.getRenderTarget(), // backTex
									 pixelWidth,
									 pixelHeight,
									 destStartX, destStartY,
									 destEndX, destEndY,
									 myscale,
									 this.getAngle(),
									 this.viewLeft, this.viewTop,
									 (this.viewLeft + this.viewRight) / 2, (this.viewTop + this.viewBottom) / 2,
									 this.runtime.kahanTime.sum,
									 inst.effect_params[etindex]);
			inst.drawGL(glw);
		}
		else
		{
			this.layout.renderEffectChain(glw, this, inst, this.render_offscreen ? this.runtime.layer_tex : this.layout.getRenderTarget());
			glw.resetModelView();
			glw.scale(myscale, myscale);
			glw.rotateZ(-this.getAngle());
			glw.translate((this.viewLeft + this.viewRight) / -2, (this.viewTop + this.viewBottom) / -2);
			glw.updateModelView();
		}
	};
	Layer.prototype.canvasToLayer = function (ptx, pty, getx, using_draw_area)
	{
		var multiplier = this.runtime.devicePixelRatio;
		if (this.runtime.isRetina)
		{
			ptx *= multiplier;
			pty *= multiplier;
		}
		var ox = this.runtime.parallax_x_origin;
		var oy = this.runtime.parallax_y_origin;
		var par_x = ((this.layout.scrollX - ox) * this.parallaxX) + ox;
		var par_y = ((this.layout.scrollY - oy) * this.parallaxY) + oy;
		var x = par_x;
		var y = par_y;
		var invScale = 1 / this.getScale(!using_draw_area);
		if (using_draw_area)
		{
			x -= (this.runtime.draw_width * invScale) / 2;
			y -= (this.runtime.draw_height * invScale) / 2;
		}
		else
		{
			x -= (this.runtime.width * invScale) / 2;
			y -= (this.runtime.height * invScale) / 2;
		}
		x += ptx * invScale;
		y += pty * invScale;
		var a = this.getAngle();
		if (a !== 0)
		{
			x -= par_x;
			y -= par_y;
			var cosa = Math.cos(a);
			var sina = Math.sin(a);
			var x_temp = (x * cosa) - (y * sina);
			y = (y * cosa) + (x * sina);
			x = x_temp;
			x += par_x;
			y += par_y;
		}
		return getx ? x : y;
	};
	Layer.prototype.layerToCanvas = function (ptx, pty, getx, using_draw_area)
	{
		var ox = this.runtime.parallax_x_origin;
		var oy = this.runtime.parallax_y_origin;
		var par_x = ((this.layout.scrollX - ox) * this.parallaxX) + ox;
		var par_y = ((this.layout.scrollY - oy) * this.parallaxY) + oy;
		var x = par_x;
		var y = par_y;
		var a = this.getAngle();
		if (a !== 0)
		{
			ptx -= par_x;
			pty -= par_y;
			var cosa = Math.cos(-a);
			var sina = Math.sin(-a);
			var x_temp = (ptx * cosa) - (pty * sina);
			pty = (pty * cosa) + (ptx * sina);
			ptx = x_temp;
			ptx += par_x;
			pty += par_y;
		}
		var invScale = 1 / this.getScale(!using_draw_area);
		if (using_draw_area)
		{
			x -= (this.runtime.draw_width * invScale) / 2;
			y -= (this.runtime.draw_height * invScale) / 2;
		}
		else
		{
			x -= (this.runtime.width * invScale) / 2;
			y -= (this.runtime.height * invScale) / 2;
		}
		x = (ptx - x) / invScale;
		y = (pty - y) / invScale;
		var multiplier = this.runtime.devicePixelRatio;
		if (this.runtime.isRetina && !using_draw_area)
		{
			x /= multiplier;
			y /= multiplier;
		}
		return getx ? x : y;
	};
	Layer.prototype.rotatePt = function (x_, y_, getx)
	{
		if (this.getAngle() === 0)
			return getx ? x_ : y_;
		var nx = this.layerToCanvas(x_, y_, true);
		var ny = this.layerToCanvas(x_, y_, false);
		this.disableAngle = true;
		var px = this.canvasToLayer(nx, ny, true);
		var py = this.canvasToLayer(nx, ny, true);
		this.disableAngle = false;
		return getx ? px : py;
	};
	Layer.prototype.saveToJSON = function ()
	{
		var i, len, et;
		var o = {
			"s": this.scale,
			"a": this.angle,
			"vl": this.viewLeft,
			"vt": this.viewTop,
			"vr": this.viewRight,
			"vb": this.viewBottom,
			"v": this.visible,
			"bc": this.background_color,
			"t": this.transparent,
			"px": this.parallaxX,
			"py": this.parallaxY,
			"o": this.opacity,
			"zr": this.zoomRate,
			"fx": [],
			"cg": this.created_globals,		// added r197; list of global UIDs already created
			"instances": []
		};
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			et = this.effect_types[i];
			o["fx"].push({"name": et.name, "active": et.active, "params": this.effect_params[et.index] });
		}
		return o;
	};
	Layer.prototype.loadFromJSON = function (o)
	{
		var i, j, len, p, inst, fx;
		this.scale = o["s"];
		this.angle = o["a"];
		this.viewLeft = o["vl"];
		this.viewTop = o["vt"];
		this.viewRight = o["vr"];
		this.viewBottom = o["vb"];
		this.visible = o["v"];
		this.background_color = o["bc"];
		this.transparent = o["t"];
		this.parallaxX = o["px"];
		this.parallaxY = o["py"];
		this.opacity = o["o"];
		this.zoomRate = o["zr"];
		this.created_globals = o["cg"] || [];		// added r197
		cr.shallowAssignArray(this.initial_instances, this.startup_initial_instances);
		var temp_set = new cr.ObjectSet();
		for (i = 0, len = this.created_globals.length; i < len; ++i)
			temp_set.add(this.created_globals[i]);
		for (i = 0, j = 0, len = this.initial_instances.length; i < len; ++i)
		{
			if (!temp_set.contains(this.initial_instances[i][2]))		// UID in element 2
			{
				this.initial_instances[j] = this.initial_instances[i];
				++j;
			}
		}
		cr.truncateArray(this.initial_instances, j);
		var ofx = o["fx"];
		for (i = 0, len = ofx.length; i < len; i++)
		{
			fx = this.getEffectByName(ofx[i]["name"]);
			if (!fx)
				continue;		// must've gone missing
			fx.active = ofx[i]["active"];
			this.effect_params[fx.index] = ofx[i]["params"];
		}
		this.updateActiveEffects();
		this.instances.sort(sort_by_zindex);
		this.zindices_stale = true;
	};
	cr.layer = Layer;
}());
;
(function()
{
	var allUniqueSolModifiers = [];
	function testSolsMatch(arr1, arr2)
	{
		var i, len = arr1.length;
		switch (len) {
		case 0:
			return true;
		case 1:
			return arr1[0] === arr2[0];
		case 2:
			return arr1[0] === arr2[0] && arr1[1] === arr2[1];
		default:
			for (i = 0; i < len; i++)
			{
				if (arr1[i] !== arr2[i])
					return false;
			}
			return true;
		}
	};
	function solArraySorter(t1, t2)
	{
		return t1.index - t2.index;
	};
	function findMatchingSolModifier(arr)
	{
		var i, len, u, temp, subarr;
		if (arr.length === 2)
		{
			if (arr[0].index > arr[1].index)
			{
				temp = arr[0];
				arr[0] = arr[1];
				arr[1] = temp;
			}
		}
		else if (arr.length > 2)
			arr.sort(solArraySorter);		// so testSolsMatch compares in same order
		if (arr.length >= allUniqueSolModifiers.length)
			allUniqueSolModifiers.length = arr.length + 1;
		if (!allUniqueSolModifiers[arr.length])
			allUniqueSolModifiers[arr.length] = [];
		subarr = allUniqueSolModifiers[arr.length];
		for (i = 0, len = subarr.length; i < len; i++)
		{
			u = subarr[i];
			if (testSolsMatch(arr, u))
				return u;
		}
		subarr.push(arr);
		return arr;
	};
	function EventSheet(runtime, m)
	{
		this.runtime = runtime;
		this.triggers = {};
		this.fasttriggers = {};
        this.hasRun = false;
        this.includes = new cr.ObjectSet(); 	// all event sheets included by this sheet, at first-level indirection only
		this.deep_includes = [];				// all includes from this sheet recursively, in trigger order
		this.already_included_sheets = [];		// used while building deep_includes
		this.name = m[0];
		var em = m[1];		// events model
		this.events = [];       // triggers won't make it to this array
		var i, len;
		for (i = 0, len = em.length; i < len; i++)
			this.init_event(em[i], null, this.events);
	};
    EventSheet.prototype.toString = function ()
    {
        return this.name;
    };
	EventSheet.prototype.init_event = function (m, parent, nontriggers)
	{
		switch (m[0]) {
		case 0:	// event block
		{
			var block = new cr.eventblock(this, parent, m);
			cr.seal(block);
			if (block.orblock)
			{
				nontriggers.push(block);
				var i, len;
				for (i = 0, len = block.conditions.length; i < len; i++)
				{
					if (block.conditions[i].trigger)
						this.init_trigger(block, i);
				}
			}
			else
			{
				if (block.is_trigger())
					this.init_trigger(block, 0);
				else
					nontriggers.push(block);
			}
			break;
		}
		case 1: // variable
		{
			var v = new cr.eventvariable(this, parent, m);
			cr.seal(v);
			nontriggers.push(v);
			break;
		}
        case 2:	// include
        {
            var inc = new cr.eventinclude(this, parent, m);
			cr.seal(inc);
            nontriggers.push(inc);
			break;
        }
		default:
;
		}
	};
	EventSheet.prototype.postInit = function ()
	{
		var i, len;
		for (i = 0, len = this.events.length; i < len; i++)
		{
			this.events[i].postInit(i < len - 1 && this.events[i + 1].is_else_block);
		}
	};
	EventSheet.prototype.updateDeepIncludes = function ()
	{
		cr.clearArray(this.deep_includes);
		cr.clearArray(this.already_included_sheets);
		this.addDeepIncludes(this);
		cr.clearArray(this.already_included_sheets);
	};
	EventSheet.prototype.addDeepIncludes = function (root_sheet)
	{
		var i, len, inc, sheet;
		var deep_includes = root_sheet.deep_includes;
		var already_included_sheets = root_sheet.already_included_sheets;
		var arr = this.includes.valuesRef();
		for (i = 0, len = arr.length; i < len; ++i)
		{
			inc = arr[i];
			sheet = inc.include_sheet;
			if (!inc.isActive() || root_sheet === sheet || already_included_sheets.indexOf(sheet) > -1)
				continue;
			already_included_sheets.push(sheet);
			sheet.addDeepIncludes(root_sheet);
			deep_includes.push(sheet);
		}
	};
	EventSheet.prototype.run = function (from_include)
	{
		if (!this.runtime.resuming_breakpoint)
		{
			this.hasRun = true;
			if (!from_include)
				this.runtime.isRunningEvents = true;
		}
		var i, len;
		for (i = 0, len = this.events.length; i < len; i++)
		{
			var ev = this.events[i];
			ev.run();
				this.runtime.clearSol(ev.solModifiers);
				if (this.runtime.hasPendingInstances)
					this.runtime.ClearDeathRow();
		}
			if (!from_include)
				this.runtime.isRunningEvents = false;
	};
	function isPerformanceSensitiveTrigger(method)
	{
		if (cr.plugins_.Sprite && method === cr.plugins_.Sprite.prototype.cnds.OnFrameChanged)
		{
			return true;
		}
		return false;
	};
	EventSheet.prototype.init_trigger = function (trig, index)
	{
		if (!trig.orblock)
			this.runtime.triggers_to_postinit.push(trig);	// needs to be postInit'd later
		var i, len;
		var cnd = trig.conditions[index];
		var type_name;
		if (cnd.type)
			type_name = cnd.type.name;
		else
			type_name = "system";
		var fasttrigger = cnd.fasttrigger;
		var triggers = (fasttrigger ? this.fasttriggers : this.triggers);
		if (!triggers[type_name])
			triggers[type_name] = [];
		var obj_entry = triggers[type_name];
		var method = cnd.func;
		if (fasttrigger)
		{
			if (!cnd.parameters.length)				// no parameters
				return;
			var firstparam = cnd.parameters[0];
			if (firstparam.type !== 1 ||			// not a string param
				firstparam.expression.type !== 2)	// not a string literal node
			{
				return;
			}
			var fastevs;
			var firstvalue = firstparam.expression.value.toLowerCase();
			var i, len;
			for (i = 0, len = obj_entry.length; i < len; i++)
			{
				if (obj_entry[i].method == method)
				{
					fastevs = obj_entry[i].evs;
					if (!fastevs[firstvalue])
						fastevs[firstvalue] = [[trig, index]];
					else
						fastevs[firstvalue].push([trig, index]);
					return;
				}
			}
			fastevs = {};
			fastevs[firstvalue] = [[trig, index]];
			obj_entry.push({ method: method, evs: fastevs });
		}
		else
		{
			for (i = 0, len = obj_entry.length; i < len; i++)
			{
				if (obj_entry[i].method == method)
				{
					obj_entry[i].evs.push([trig, index]);
					return;
				}
			}
			if (isPerformanceSensitiveTrigger(method))
				obj_entry.unshift({ method: method, evs: [[trig, index]]});
			else
				obj_entry.push({ method: method, evs: [[trig, index]]});
		}
	};
	cr.eventsheet = EventSheet;
	function Selection(type)
	{
		this.type = type;
		this.instances = [];        // subset of picked instances
		this.else_instances = [];	// subset of unpicked instances
		this.select_all = true;
	};
	Selection.prototype.hasObjects = function ()
	{
		if (this.select_all)
			return this.type.instances.length;
		else
			return this.instances.length;
	};
	Selection.prototype.getObjects = function ()
	{
		if (this.select_all)
			return this.type.instances;
		else
			return this.instances;
	};
	/*
	Selection.prototype.ensure_picked = function (inst, skip_siblings)
	{
		var i, len;
		var orblock = inst.runtime.getCurrentEventStack().current_event.orblock;
		if (this.select_all)
		{
			this.select_all = false;
			if (orblock)
			{
				cr.shallowAssignArray(this.else_instances, inst.type.instances);
				cr.arrayFindRemove(this.else_instances, inst);
			}
			this.instances.length = 1;
			this.instances[0] = inst;
		}
		else
		{
			if (orblock)
			{
				i = this.else_instances.indexOf(inst);
				if (i !== -1)
				{
					this.instances.push(this.else_instances[i]);
					this.else_instances.splice(i, 1);
				}
			}
			else
			{
				if (this.instances.indexOf(inst) === -1)
					this.instances.push(inst);
			}
		}
		if (!skip_siblings)
		{
		}
	};
	*/
	Selection.prototype.pick_one = function (inst)
	{
		if (!inst)
			return;
		if (inst.runtime.getCurrentEventStack().current_event.orblock)
		{
			if (this.select_all)
			{
				cr.clearArray(this.instances);
				cr.shallowAssignArray(this.else_instances, inst.type.instances);
				this.select_all = false;
			}
			var i = this.else_instances.indexOf(inst);
			if (i !== -1)
			{
				this.instances.push(this.else_instances[i]);
				this.else_instances.splice(i, 1);
			}
		}
		else
		{
			this.select_all = false;
			cr.clearArray(this.instances);
			this.instances[0] = inst;
		}
	};
	cr.selection = Selection;
	function EventBlock(sheet, parent, m)
	{
		this.sheet = sheet;
		this.parent = parent;
		this.runtime = sheet.runtime;
		this.solModifiers = [];
		this.solModifiersIncludingParents = [];
		this.solWriterAfterCnds = false;	// block does not change SOL after running its conditions
		this.group = false;					// is group of events
		this.initially_activated = false;	// if a group, is active on startup
		this.toplevelevent = false;			// is an event block parented only by a top-level group
		this.toplevelgroup = false;			// is parented only by other groups or is top-level (i.e. not in a subevent)
		this.has_else_block = false;		// is followed by else
;
		this.conditions = [];
		this.actions = [];
		this.subevents = [];
		this.group_name = "";
		this.group = false;
		this.initially_activated = false;
		this.group_active = false;
		this.contained_includes = null;
        if (m[1])
        {
			this.group_name = m[1][1].toLowerCase();
			this.group = true;
			this.initially_activated = !!m[1][0];
			this.contained_includes = [];
			this.group_active = this.initially_activated;
			this.runtime.allGroups.push(this);
            this.runtime.groups_by_name[this.group_name] = this;
        }
		this.orblock = m[2];
		this.sid = m[4];
		if (!this.group)
			this.runtime.blocksBySid[this.sid.toString()] = this;
		var i, len;
		var cm = m[5];
		for (i = 0, len = cm.length; i < len; i++)
		{
			var cnd = new cr.condition(this, cm[i]);
			cnd.index = i;
			cr.seal(cnd);
			this.conditions.push(cnd);
			/*
			if (cnd.is_logical())
				this.is_logical = true;
			if (cnd.type && !cnd.type.plugin.singleglobal && this.cndReferences.indexOf(cnd.type) === -1)
				this.cndReferences.push(cnd.type);
			*/
			this.addSolModifier(cnd.type);
		}
		var am = m[6];
		for (i = 0, len = am.length; i < len; i++)
		{
			var act = new cr.action(this, am[i]);
			act.index = i;
			cr.seal(act);
			this.actions.push(act);
		}
		if (m.length === 8)
		{
			var em = m[7];
			for (i = 0, len = em.length; i < len; i++)
				this.sheet.init_event(em[i], this, this.subevents);
		}
		this.is_else_block = false;
		if (this.conditions.length)
		{
			this.is_else_block = (this.conditions[0].type == null && this.conditions[0].func == cr.system_object.prototype.cnds.Else);
		}
	};
	window["_c2hh_"] = "2B59A9B0FDB68D50032D4698E0109E2BAA6742B5";
	EventBlock.prototype.postInit = function (hasElse/*, prevBlock_*/)
	{
		var i, len;
		var p = this.parent;
		if (this.group)
		{
			this.toplevelgroup = true;
			while (p)
			{
				if (!p.group)
				{
					this.toplevelgroup = false;
					break;
				}
				p = p.parent;
			}
		}
		this.toplevelevent = !this.is_trigger() && (!this.parent || (this.parent.group && this.parent.toplevelgroup));
		this.has_else_block = !!hasElse;
		this.solModifiersIncludingParents = this.solModifiers.slice(0);
		p = this.parent;
		while (p)
		{
			for (i = 0, len = p.solModifiers.length; i < len; i++)
				this.addParentSolModifier(p.solModifiers[i]);
			p = p.parent;
		}
		this.solModifiers = findMatchingSolModifier(this.solModifiers);
		this.solModifiersIncludingParents = findMatchingSolModifier(this.solModifiersIncludingParents);
		var i, len/*, s*/;
		for (i = 0, len = this.conditions.length; i < len; i++)
			this.conditions[i].postInit();
		for (i = 0, len = this.actions.length; i < len; i++)
			this.actions[i].postInit();
		for (i = 0, len = this.subevents.length; i < len; i++)
		{
			this.subevents[i].postInit(i < len - 1 && this.subevents[i + 1].is_else_block);
		}
		/*
		if (this.is_else_block && this.prev_block)
		{
			for (i = 0, len = this.prev_block.solModifiers.length; i < len; i++)
			{
				s = this.prev_block.solModifiers[i];
				if (this.solModifiers.indexOf(s) === -1)
					this.solModifiers.push(s);
			}
		}
		*/
	};
	EventBlock.prototype.setGroupActive = function (a)
	{
		if (this.group_active === !!a)
			return;		// same state
		this.group_active = !!a;
		var i, len;
		for (i = 0, len = this.contained_includes.length; i < len; ++i)
		{
			this.contained_includes[i].updateActive();
		}
		if (len > 0 && this.runtime.running_layout.event_sheet)
			this.runtime.running_layout.event_sheet.updateDeepIncludes();
	};
	function addSolModifierToList(type, arr)
	{
		var i, len, t;
		if (!type)
			return;
		if (arr.indexOf(type) === -1)
			arr.push(type);
		if (type.is_contained)
		{
			for (i = 0, len = type.container.length; i < len; i++)
			{
				t = type.container[i];
				if (type === t)
					continue;		// already handled
				if (arr.indexOf(t) === -1)
					arr.push(t);
			}
		}
	};
	EventBlock.prototype.addSolModifier = function (type)
	{
		addSolModifierToList(type, this.solModifiers);
	};
	EventBlock.prototype.addParentSolModifier = function (type)
	{
		addSolModifierToList(type, this.solModifiersIncludingParents);
	};
	EventBlock.prototype.setSolWriterAfterCnds = function ()
	{
		this.solWriterAfterCnds = true;
		if (this.parent)
			this.parent.setSolWriterAfterCnds();
	};
	EventBlock.prototype.is_trigger = function ()
	{
		if (!this.conditions.length)    // no conditions
			return false;
		else
			return this.conditions[0].trigger;
	};
	EventBlock.prototype.run = function ()
	{
		var i, len, c, any_true = false, cnd_result;
		var runtime = this.runtime;
		var evinfo = this.runtime.getCurrentEventStack();
		evinfo.current_event = this;
		var conditions = this.conditions;
			if (!this.is_else_block)
				evinfo.else_branch_ran = false;
		if (this.orblock)
		{
			if (conditions.length === 0)
				any_true = true;		// be sure to run if empty block
				evinfo.cndindex = 0
			for (len = conditions.length; evinfo.cndindex < len; evinfo.cndindex++)
			{
				c = conditions[evinfo.cndindex];
				if (c.trigger)		// skip triggers when running OR block
					continue;
				cnd_result = c.run();
				if (cnd_result)			// make sure all conditions run and run if any were true
					any_true = true;
			}
			evinfo.last_event_true = any_true;
			if (any_true)
				this.run_actions_and_subevents();
		}
		else
		{
				evinfo.cndindex = 0
			for (len = conditions.length; evinfo.cndindex < len; evinfo.cndindex++)
			{
				cnd_result = conditions[evinfo.cndindex].run();
				if (!cnd_result)    // condition failed
				{
					evinfo.last_event_true = false;
					if (this.toplevelevent && runtime.hasPendingInstances)
						runtime.ClearDeathRow();
					return;		// bail out now
				}
			}
			evinfo.last_event_true = true;
			this.run_actions_and_subevents();
		}
		this.end_run(evinfo);
	};
	EventBlock.prototype.end_run = function (evinfo)
	{
		if (evinfo.last_event_true && this.has_else_block)
			evinfo.else_branch_ran = true;
		if (this.toplevelevent && this.runtime.hasPendingInstances)
			this.runtime.ClearDeathRow();
	};
	EventBlock.prototype.run_orblocktrigger = function (index)
	{
		var evinfo = this.runtime.getCurrentEventStack();
		evinfo.current_event = this;
		if (this.conditions[index].run())
		{
			this.run_actions_and_subevents();
			this.runtime.getCurrentEventStack().last_event_true = true;
		}
	};
	EventBlock.prototype.run_actions_and_subevents = function ()
	{
		var evinfo = this.runtime.getCurrentEventStack();
		var len;
		for (evinfo.actindex = 0, len = this.actions.length; evinfo.actindex < len; evinfo.actindex++)
		{
			if (this.actions[evinfo.actindex].run())
				return;
		}
		this.run_subevents();
	};
	EventBlock.prototype.resume_actions_and_subevents = function ()
	{
		var evinfo = this.runtime.getCurrentEventStack();
		var len;
		for (len = this.actions.length; evinfo.actindex < len; evinfo.actindex++)
		{
			if (this.actions[evinfo.actindex].run())
				return;
		}
		this.run_subevents();
	};
	EventBlock.prototype.run_subevents = function ()
	{
		if (!this.subevents.length)
			return;
		var i, len, subev, pushpop/*, skipped_pop = false, pop_modifiers = null*/;
		var last = this.subevents.length - 1;
			this.runtime.pushEventStack(this);
		if (this.solWriterAfterCnds)
		{
			for (i = 0, len = this.subevents.length; i < len; i++)
			{
				subev = this.subevents[i];
					pushpop = (!this.toplevelgroup || (!this.group && i < last));
					if (pushpop)
						this.runtime.pushCopySol(subev.solModifiers);
				subev.run();
					if (pushpop)
						this.runtime.popSol(subev.solModifiers);
					else
						this.runtime.clearSol(subev.solModifiers);
			}
		}
		else
		{
			for (i = 0, len = this.subevents.length; i < len; i++)
			{
				this.subevents[i].run();
			}
		}
			this.runtime.popEventStack();
	};
	EventBlock.prototype.run_pretrigger = function ()
	{
		var evinfo = this.runtime.getCurrentEventStack();
		evinfo.current_event = this;
		var any_true = false;
		var i, len;
		for (evinfo.cndindex = 0, len = this.conditions.length; evinfo.cndindex < len; evinfo.cndindex++)
		{
;
			if (this.conditions[evinfo.cndindex].run())
				any_true = true;
			else if (!this.orblock)			// condition failed (let OR blocks run all conditions anyway)
				return false;               // bail out
		}
		return this.orblock ? any_true : true;
	};
	EventBlock.prototype.retrigger = function ()
	{
		this.runtime.execcount++;
		var prevcndindex = this.runtime.getCurrentEventStack().cndindex;
		var len;
		var evinfo = this.runtime.pushEventStack(this);
		if (!this.orblock)
		{
			for (evinfo.cndindex = prevcndindex + 1, len = this.conditions.length; evinfo.cndindex < len; evinfo.cndindex++)
			{
				if (!this.conditions[evinfo.cndindex].run())    // condition failed
				{
					this.runtime.popEventStack();               // moving up level of recursion
					return false;                               // bail out
				}
			}
		}
		this.run_actions_and_subevents();
		this.runtime.popEventStack();
		return true;		// ran an iteration
	};
	EventBlock.prototype.isFirstConditionOfType = function (cnd)
	{
		var cndindex = cnd.index;
		if (cndindex === 0)
			return true;
		--cndindex;
		for ( ; cndindex >= 0; --cndindex)
		{
			if (this.conditions[cndindex].type === cnd.type)
				return false;
		}
		return true;
	};
	cr.eventblock = EventBlock;
	function Condition(block, m)
	{
		this.block = block;
		this.sheet = block.sheet;
		this.runtime = block.runtime;
		this.parameters = [];
		this.results = [];
		this.extra = {};		// for plugins to stow away some custom info
		this.index = -1;
		this.anyParamVariesPerInstance = false;
		this.func = this.runtime.GetObjectReference(m[1]);
;
		this.trigger = (m[3] > 0);
		this.fasttrigger = (m[3] === 2);
		this.looping = m[4];
		this.inverted = m[5];
		this.isstatic = m[6];
		this.sid = m[7];
		this.runtime.cndsBySid[this.sid.toString()] = this;
		if (m[0] === -1)		// system object
		{
			this.type = null;
			this.run = this.run_system;
			this.behaviortype = null;
			this.beh_index = -1;
		}
		else
		{
			this.type = this.runtime.types_by_index[m[0]];
;
			if (this.isstatic)
				this.run = this.run_static;
			else
				this.run = this.run_object;
			if (m[2])
			{
				this.behaviortype = this.type.getBehaviorByName(m[2]);
;
				this.beh_index = this.type.getBehaviorIndexByName(m[2]);
;
			}
			else
			{
				this.behaviortype = null;
				this.beh_index = -1;
			}
			if (this.block.parent)
				this.block.parent.setSolWriterAfterCnds();
		}
		if (this.fasttrigger)
			this.run = this.run_true;
		if (m.length === 10)
		{
			var i, len;
			var em = m[9];
			for (i = 0, len = em.length; i < len; i++)
			{
				var param = new cr.parameter(this, em[i]);
				cr.seal(param);
				this.parameters.push(param);
			}
			this.results.length = em.length;
		}
	};
	Condition.prototype.postInit = function ()
	{
		var i, len, p;
		for (i = 0, len = this.parameters.length; i < len; i++)
		{
			p = this.parameters[i];
			p.postInit();
			if (p.variesPerInstance)
				this.anyParamVariesPerInstance = true;
		}
	};
	/*
	Condition.prototype.is_logical = function ()
	{
		return !this.type || this.type.plugin.singleglobal;
	};
	*/
	Condition.prototype.run_true = function ()
	{
		return true;
	};
	Condition.prototype.run_system = function ()
	{
		var i, len;
		for (i = 0, len = this.parameters.length; i < len; i++)
			this.results[i] = this.parameters[i].get();
		return cr.xor(this.func.apply(this.runtime.system, this.results), this.inverted);
	};
	Condition.prototype.run_static = function ()
	{
		var i, len;
		for (i = 0, len = this.parameters.length; i < len; i++)
			this.results[i] = this.parameters[i].get();
		var ret = this.func.apply(this.behaviortype ? this.behaviortype : this.type, this.results);
		this.type.applySolToContainer();
		return ret;
	};
	Condition.prototype.run_object = function ()
	{
		var i, j, k, leni, lenj, p, ret, met, inst, s, sol2;
		var type = this.type;
		var sol = type.getCurrentSol();
		var is_orblock = this.block.orblock && !this.trigger;		// triggers in OR blocks need to work normally
		var offset = 0;
		var is_contained = type.is_contained;
		var is_family = type.is_family;
		var family_index = type.family_index;
		var beh_index = this.beh_index;
		var is_beh = (beh_index > -1);
		var params_vary = this.anyParamVariesPerInstance;
		var parameters = this.parameters;
		var results = this.results;
		var inverted = this.inverted;
		var func = this.func;
		var arr, container;
		if (params_vary)
		{
			for (j = 0, lenj = parameters.length; j < lenj; ++j)
			{
				p = parameters[j];
				if (!p.variesPerInstance)
					results[j] = p.get(0);
			}
		}
		else
		{
			for (j = 0, lenj = parameters.length; j < lenj; ++j)
				results[j] = parameters[j].get(0);
		}
		if (sol.select_all) {
			cr.clearArray(sol.instances);       // clear contents
			cr.clearArray(sol.else_instances);
			arr = type.instances;
			for (i = 0, leni = arr.length; i < leni; ++i)
			{
				inst = arr[i];
;
				if (params_vary)
				{
					for (j = 0, lenj = parameters.length; j < lenj; ++j)
					{
						p = parameters[j];
						if (p.variesPerInstance)
							results[j] = p.get(i);        // default SOL index is current object
					}
				}
				if (is_beh)
				{
					offset = 0;
					if (is_family)
					{
						offset = inst.type.family_beh_map[family_index];
					}
					ret = func.apply(inst.behavior_insts[beh_index + offset], results);
				}
				else
					ret = func.apply(inst, results);
				met = cr.xor(ret, inverted);
				if (met)
					sol.instances.push(inst);
				else if (is_orblock)					// in OR blocks, keep the instances not meeting the condition for subsequent testing
					sol.else_instances.push(inst);
			}
			if (type.finish)
				type.finish(true);
			sol.select_all = false;
			type.applySolToContainer();
			return sol.hasObjects();
		}
		else {
			k = 0;
			var using_else_instances = (is_orblock && !this.block.isFirstConditionOfType(this));
			arr = (using_else_instances ? sol.else_instances : sol.instances);
			var any_true = false;
			for (i = 0, leni = arr.length; i < leni; ++i)
			{
				inst = arr[i];
;
				if (params_vary)
				{
					for (j = 0, lenj = parameters.length; j < lenj; ++j)
					{
						p = parameters[j];
						if (p.variesPerInstance)
							results[j] = p.get(i);        // default SOL index is current object
					}
				}
				if (is_beh)
				{
					offset = 0;
					if (is_family)
					{
						offset = inst.type.family_beh_map[family_index];
					}
					ret = func.apply(inst.behavior_insts[beh_index + offset], results);
				}
				else
					ret = func.apply(inst, results);
				if (cr.xor(ret, inverted))
				{
					any_true = true;
					if (using_else_instances)
					{
						sol.instances.push(inst);
						if (is_contained)
						{
							for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
							{
								s = inst.siblings[j];
								s.type.getCurrentSol().instances.push(s);
							}
						}
					}
					else
					{
						arr[k] = inst;
						if (is_contained)
						{
							for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
							{
								s = inst.siblings[j];
								s.type.getCurrentSol().instances[k] = s;
							}
						}
						k++;
					}
				}
				else
				{
					if (using_else_instances)
					{
						arr[k] = inst;
						if (is_contained)
						{
							for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
							{
								s = inst.siblings[j];
								s.type.getCurrentSol().else_instances[k] = s;
							}
						}
						k++;
					}
					else if (is_orblock)
					{
						sol.else_instances.push(inst);
						if (is_contained)
						{
							for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
							{
								s = inst.siblings[j];
								s.type.getCurrentSol().else_instances.push(s);
							}
						}
					}
				}
			}
			cr.truncateArray(arr, k);
			if (is_contained)
			{
				container = type.container;
				for (i = 0, leni = container.length; i < leni; i++)
				{
					sol2 = container[i].getCurrentSol();
					if (using_else_instances)
						cr.truncateArray(sol2.else_instances, k);
					else
						cr.truncateArray(sol2.instances, k);
				}
			}
			var pick_in_finish = any_true;		// don't pick in finish() if we're only doing the logic test below
			if (using_else_instances && !any_true)
			{
				for (i = 0, leni = sol.instances.length; i < leni; i++)
				{
					inst = sol.instances[i];
					if (params_vary)
					{
						for (j = 0, lenj = parameters.length; j < lenj; j++)
						{
							p = parameters[j];
							if (p.variesPerInstance)
								results[j] = p.get(i);
						}
					}
					if (is_beh)
						ret = func.apply(inst.behavior_insts[beh_index], results);
					else
						ret = func.apply(inst, results);
					if (cr.xor(ret, inverted))
					{
						any_true = true;
						break;		// got our flag, don't need to test any more
					}
				}
			}
			if (type.finish)
				type.finish(pick_in_finish || is_orblock);
			return is_orblock ? any_true : sol.hasObjects();
		}
	};
	cr.condition = Condition;
	function Action(block, m)
	{
		this.block = block;
		this.sheet = block.sheet;
		this.runtime = block.runtime;
		this.parameters = [];
		this.results = [];
		this.extra = {};		// for plugins to stow away some custom info
		this.index = -1;
		this.anyParamVariesPerInstance = false;
		this.func = this.runtime.GetObjectReference(m[1]);
;
		if (m[0] === -1)	// system
		{
			this.type = null;
			this.run = this.run_system;
			this.behaviortype = null;
			this.beh_index = -1;
		}
		else
		{
			this.type = this.runtime.types_by_index[m[0]];
;
			this.run = this.run_object;
			if (m[2])
			{
				this.behaviortype = this.type.getBehaviorByName(m[2]);
;
				this.beh_index = this.type.getBehaviorIndexByName(m[2]);
;
			}
			else
			{
				this.behaviortype = null;
				this.beh_index = -1;
			}
		}
		this.sid = m[3];
		this.runtime.actsBySid[this.sid.toString()] = this;
		if (m.length === 6)
		{
			var i, len;
			var em = m[5];
			for (i = 0, len = em.length; i < len; i++)
			{
				var param = new cr.parameter(this, em[i]);
				cr.seal(param);
				this.parameters.push(param);
			}
			this.results.length = em.length;
		}
	};
	Action.prototype.postInit = function ()
	{
		var i, len, p;
		for (i = 0, len = this.parameters.length; i < len; i++)
		{
			p = this.parameters[i];
			p.postInit();
			if (p.variesPerInstance)
				this.anyParamVariesPerInstance = true;
		}
	};
	Action.prototype.run_system = function ()
	{
		var runtime = this.runtime;
		var i, len;
		var parameters = this.parameters;
		var results = this.results;
		for (i = 0, len = parameters.length; i < len; ++i)
			results[i] = parameters[i].get();
		return this.func.apply(runtime.system, results);
	};
	Action.prototype.run_object = function ()
	{
		var type = this.type;
		var beh_index = this.beh_index;
		var family_index = type.family_index;
		var params_vary = this.anyParamVariesPerInstance;
		var parameters = this.parameters;
		var results = this.results;
		var func = this.func;
		var instances = type.getCurrentSol().getObjects();
		var is_family = type.is_family;
		var is_beh = (beh_index > -1);
		var i, j, leni, lenj, p, inst, offset;
		if (params_vary)
		{
			for (j = 0, lenj = parameters.length; j < lenj; ++j)
			{
				p = parameters[j];
				if (!p.variesPerInstance)
					results[j] = p.get(0);
			}
		}
		else
		{
			for (j = 0, lenj = parameters.length; j < lenj; ++j)
				results[j] = parameters[j].get(0);
		}
		for (i = 0, leni = instances.length; i < leni; ++i)
		{
			inst = instances[i];
			if (params_vary)
			{
				for (j = 0, lenj = parameters.length; j < lenj; ++j)
				{
					p = parameters[j];
					if (p.variesPerInstance)
						results[j] = p.get(i);    // pass i to use as default SOL index
				}
			}
			if (is_beh)
			{
				offset = 0;
				if (is_family)
				{
					offset = inst.type.family_beh_map[family_index];
				}
				func.apply(inst.behavior_insts[beh_index + offset], results);
			}
			else
				func.apply(inst, results);
		}
		return false;
	};
	cr.action = Action;
	var tempValues = [];
	var tempValuesPtr = -1;
	function pushTempValue()
	{
		tempValuesPtr++;
		if (tempValues.length === tempValuesPtr)
			tempValues.push(new cr.expvalue());
		return tempValues[tempValuesPtr];
	};
	function popTempValue()
	{
		tempValuesPtr--;
	};
	function Parameter(owner, m)
	{
		this.owner = owner;
		this.block = owner.block;
		this.sheet = owner.sheet;
		this.runtime = owner.runtime;
		this.type = m[0];
		this.expression = null;
		this.solindex = 0;
		this.get = null;
		this.combosel = 0;
		this.layout = null;
		this.key = 0;
		this.object = null;
		this.index = 0;
		this.varname = null;
		this.eventvar = null;
		this.fileinfo = null;
		this.subparams = null;
		this.variadicret = null;
		this.subparams = null;
		this.variadicret = null;
		this.variesPerInstance = false;
		var i, len, param;
		switch (m[0])
		{
			case 0:		// number
			case 7:		// any
				this.expression = new cr.expNode(this, m[1]);
				this.solindex = 0;
				this.get = this.get_exp;
				break;
			case 1:		// string
				this.expression = new cr.expNode(this, m[1]);
				this.solindex = 0;
				this.get = this.get_exp_str;
				break;
			case 5:		// layer
				this.expression = new cr.expNode(this, m[1]);
				this.solindex = 0;
				this.get = this.get_layer;
				break;
			case 3:		// combo
			case 8:		// cmp
				this.combosel = m[1];
				this.get = this.get_combosel;
				break;
			case 6:		// layout
				this.layout = this.runtime.layouts[m[1]];
;
				this.get = this.get_layout;
				break;
			case 9:		// keyb
				this.key = m[1];
				this.get = this.get_key;
				break;
			case 4:		// object
				this.object = this.runtime.types_by_index[m[1]];
;
				this.get = this.get_object;
				this.block.addSolModifier(this.object);
				if (this.owner instanceof cr.action)
					this.block.setSolWriterAfterCnds();
				else if (this.block.parent)
					this.block.parent.setSolWriterAfterCnds();
				break;
			case 10:	// instvar
				this.index = m[1];
				if (owner.type && owner.type.is_family)
				{
					this.get = this.get_familyvar;
					this.variesPerInstance = true;
				}
				else
					this.get = this.get_instvar;
				break;
			case 11:	// eventvar
				this.varname = m[1];
				this.eventvar = null;
				this.get = this.get_eventvar;
				break;
			case 2:		// audiofile	["name", ismusic]
			case 12:	// fileinfo		"name"
				this.fileinfo = m[1];
				this.get = this.get_audiofile;
				break;
			case 13:	// variadic
				this.get = this.get_variadic;
				this.subparams = [];
				this.variadicret = [];
				for (i = 1, len = m.length; i < len; i++)
				{
					param = new cr.parameter(this.owner, m[i]);
					cr.seal(param);
					this.subparams.push(param);
					this.variadicret.push(0);
				}
				break;
			default:
;
		}
	};
	Parameter.prototype.postInit = function ()
	{
		var i, len;
		if (this.type === 11)		// eventvar
		{
			this.eventvar = this.runtime.getEventVariableByName(this.varname, this.block.parent);
;
		}
		else if (this.type === 13)	// variadic, postInit all sub-params
		{
			for (i = 0, len = this.subparams.length; i < len; i++)
				this.subparams[i].postInit();
		}
		if (this.expression)
			this.expression.postInit();
	};
	Parameter.prototype.maybeVaryForType = function (t)
	{
		if (this.variesPerInstance)
			return;				// already varies per instance, no need to check again
		if (!t)
			return;				// never vary for system type
		if (!t.plugin.singleglobal)
		{
			this.variesPerInstance = true;
			return;
		}
	};
	Parameter.prototype.setVaries = function ()
	{
		this.variesPerInstance = true;
	};
	Parameter.prototype.get_exp = function (solindex)
	{
		this.solindex = solindex || 0;   // default SOL index to use
		var temp = pushTempValue();
		this.expression.get(temp);
		popTempValue();
		return temp.data;      			// return actual JS value, not expvalue
	};
	Parameter.prototype.get_exp_str = function (solindex)
	{
		this.solindex = solindex || 0;   // default SOL index to use
		var temp = pushTempValue();
		this.expression.get(temp);
		popTempValue();
		if (cr.is_string(temp.data))
			return temp.data;
		else
			return "";
	};
	Parameter.prototype.get_object = function ()
	{
		return this.object;
	};
	Parameter.prototype.get_combosel = function ()
	{
		return this.combosel;
	};
	Parameter.prototype.get_layer = function (solindex)
	{
		this.solindex = solindex || 0;   // default SOL index to use
		var temp = pushTempValue();
		this.expression.get(temp);
		popTempValue();
		if (temp.is_number())
			return this.runtime.getLayerByNumber(temp.data);
		else
			return this.runtime.getLayerByName(temp.data);
	}
	Parameter.prototype.get_layout = function ()
	{
		return this.layout;
	};
	Parameter.prototype.get_key = function ()
	{
		return this.key;
	};
	Parameter.prototype.get_instvar = function ()
	{
		return this.index;
	};
	Parameter.prototype.get_familyvar = function (solindex_)
	{
		var solindex = solindex_ || 0;
		var familytype = this.owner.type;
		var realtype = null;
		var sol = familytype.getCurrentSol();
		var objs = sol.getObjects();
		if (objs.length)
			realtype = objs[solindex % objs.length].type;
		else if (sol.else_instances.length)
			realtype = sol.else_instances[solindex % sol.else_instances.length].type;
		else if (familytype.instances.length)
			realtype = familytype.instances[solindex % familytype.instances.length].type;
		else
			return 0;
		return this.index + realtype.family_var_map[familytype.family_index];
	};
	Parameter.prototype.get_eventvar = function ()
	{
		return this.eventvar;
	};
	Parameter.prototype.get_audiofile = function ()
	{
		return this.fileinfo;
	};
	Parameter.prototype.get_variadic = function ()
	{
		var i, len;
		for (i = 0, len = this.subparams.length; i < len; i++)
		{
			this.variadicret[i] = this.subparams[i].get();
		}
		return this.variadicret;
	};
	cr.parameter = Parameter;
	function EventVariable(sheet, parent, m)
	{
		this.sheet = sheet;
		this.parent = parent;
		this.runtime = sheet.runtime;
		this.solModifiers = [];
		this.name = m[1];
		this.vartype = m[2];
		this.initial = m[3];
		this.is_static = !!m[4];
		this.is_constant = !!m[5];
		this.sid = m[6];
		this.runtime.varsBySid[this.sid.toString()] = this;
		this.data = this.initial;	// note: also stored in event stack frame for local nonstatic nonconst vars
		if (this.parent)			// local var
		{
			if (this.is_static || this.is_constant)
				this.localIndex = -1;
			else
				this.localIndex = this.runtime.stackLocalCount++;
			this.runtime.all_local_vars.push(this);
		}
		else						// global var
		{
			this.localIndex = -1;
			this.runtime.all_global_vars.push(this);
		}
	};
	EventVariable.prototype.postInit = function ()
	{
		this.solModifiers = findMatchingSolModifier(this.solModifiers);
	};
	EventVariable.prototype.setValue = function (x)
	{
;
		var lvs = this.runtime.getCurrentLocalVarStack();
		if (!this.parent || this.is_static || !lvs)
			this.data = x;
		else	// local nonstatic variable: use event stack to keep value at this level of recursion
		{
			if (this.localIndex >= lvs.length)
				lvs.length = this.localIndex + 1;
			lvs[this.localIndex] = x;
		}
	};
	EventVariable.prototype.getValue = function ()
	{
		var lvs = this.runtime.getCurrentLocalVarStack();
		if (!this.parent || this.is_static || !lvs || this.is_constant)
			return this.data;
		else	// local nonstatic variable
		{
			if (this.localIndex >= lvs.length)
			{
				return this.initial;
			}
			if (typeof lvs[this.localIndex] === "undefined")
			{
				return this.initial;
			}
			return lvs[this.localIndex];
		}
	};
	EventVariable.prototype.run = function ()
	{
			if (this.parent && !this.is_static && !this.is_constant)
				this.setValue(this.initial);
	};
	cr.eventvariable = EventVariable;
	function EventInclude(sheet, parent, m)
	{
		this.sheet = sheet;
		this.parent = parent;
		this.runtime = sheet.runtime;
		this.solModifiers = [];
		this.include_sheet = null;		// determined in postInit
		this.include_sheet_name = m[1];
		this.active = true;
	};
	EventInclude.prototype.toString = function ()
	{
		return "include:" + this.include_sheet.toString();
	};
	EventInclude.prototype.postInit = function ()
	{
        this.include_sheet = this.runtime.eventsheets[this.include_sheet_name];
;
;
        this.sheet.includes.add(this);
		this.solModifiers = findMatchingSolModifier(this.solModifiers);
		var p = this.parent;
		while (p)
		{
			if (p.group)
				p.contained_includes.push(this);
			p = p.parent;
		}
		this.updateActive();
	};
	EventInclude.prototype.run = function ()
	{
			if (this.parent)
				this.runtime.pushCleanSol(this.runtime.types_by_index);
        if (!this.include_sheet.hasRun)
            this.include_sheet.run(true);			// from include
			if (this.parent)
				this.runtime.popSol(this.runtime.types_by_index);
	};
	EventInclude.prototype.updateActive = function ()
	{
		var p = this.parent;
		while (p)
		{
			if (p.group && !p.group_active)
			{
				this.active = false;
				return;
			}
			p = p.parent;
		}
		this.active = true;
	};
	EventInclude.prototype.isActive = function ()
	{
		return this.active;
	};
	cr.eventinclude = EventInclude;
	function EventStackFrame()
	{
		this.temp_parents_arr = [];
		this.reset(null);
		cr.seal(this);
	};
	EventStackFrame.prototype.reset = function (cur_event)
	{
		this.current_event = cur_event;
		this.cndindex = 0;
		this.actindex = 0;
		cr.clearArray(this.temp_parents_arr);
		this.last_event_true = false;
		this.else_branch_ran = false;
		this.any_true_state = false;
	};
	EventStackFrame.prototype.isModifierAfterCnds = function ()
	{
		if (this.current_event.solWriterAfterCnds)
			return true;
		if (this.cndindex < this.current_event.conditions.length - 1)
			return !!this.current_event.solModifiers.length;
		return false;
	};
	cr.eventStackFrame = EventStackFrame;
}());
(function()
{
	function ExpNode(owner_, m)
	{
		this.owner = owner_;
		this.runtime = owner_.runtime;
		this.type = m[0];
;
		this.get = [this.eval_int,
					this.eval_float,
					this.eval_string,
					this.eval_unaryminus,
					this.eval_add,
					this.eval_subtract,
					this.eval_multiply,
					this.eval_divide,
					this.eval_mod,
					this.eval_power,
					this.eval_and,
					this.eval_or,
					this.eval_equal,
					this.eval_notequal,
					this.eval_less,
					this.eval_lessequal,
					this.eval_greater,
					this.eval_greaterequal,
					this.eval_conditional,
					this.eval_system_exp,
					this.eval_object_exp,
					this.eval_instvar_exp,
					this.eval_behavior_exp,
					this.eval_eventvar_exp][this.type];
		var paramsModel = null;
		this.value = null;
		this.first = null;
		this.second = null;
		this.third = null;
		this.func = null;
		this.results = null;
		this.parameters = null;
		this.object_type = null;
		this.beh_index = -1;
		this.instance_expr = null;
		this.varindex = -1;
		this.behavior_type = null;
		this.varname = null;
		this.eventvar = null;
		this.return_string = false;
		switch (this.type) {
		case 0:		// int
		case 1:		// float
		case 2:		// string
			this.value = m[1];
			break;
		case 3:		// unaryminus
			this.first = new cr.expNode(owner_, m[1]);
			break;
		case 18:	// conditional
			this.first = new cr.expNode(owner_, m[1]);
			this.second = new cr.expNode(owner_, m[2]);
			this.third = new cr.expNode(owner_, m[3]);
			break;
		case 19:	// system_exp
			this.func = this.runtime.GetObjectReference(m[1]);
;
			if (this.func === cr.system_object.prototype.exps.random
			 || this.func === cr.system_object.prototype.exps.choose)
			{
				this.owner.setVaries();
			}
			this.results = [];
			this.parameters = [];
			if (m.length === 3)
			{
				paramsModel = m[2];
				this.results.length = paramsModel.length + 1;	// must also fit 'ret'
			}
			else
				this.results.length = 1;      // to fit 'ret'
			break;
		case 20:	// object_exp
			this.object_type = this.runtime.types_by_index[m[1]];
;
			this.beh_index = -1;
			this.func = this.runtime.GetObjectReference(m[2]);
			this.return_string = m[3];
			if (cr.plugins_.Function && this.func === cr.plugins_.Function.prototype.exps.Call)
			{
				this.owner.setVaries();
			}
			if (m[4])
				this.instance_expr = new cr.expNode(owner_, m[4]);
			else
				this.instance_expr = null;
			this.results = [];
			this.parameters = [];
			if (m.length === 6)
			{
				paramsModel = m[5];
				this.results.length = paramsModel.length + 1;
			}
			else
				this.results.length = 1;	// to fit 'ret'
			break;
		case 21:		// instvar_exp
			this.object_type = this.runtime.types_by_index[m[1]];
;
			this.return_string = m[2];
			if (m[3])
				this.instance_expr = new cr.expNode(owner_, m[3]);
			else
				this.instance_expr = null;
			this.varindex = m[4];
			break;
		case 22:		// behavior_exp
			this.object_type = this.runtime.types_by_index[m[1]];
;
			this.behavior_type = this.object_type.getBehaviorByName(m[2]);
;
			this.beh_index = this.object_type.getBehaviorIndexByName(m[2]);
			this.func = this.runtime.GetObjectReference(m[3]);
			this.return_string = m[4];
			if (m[5])
				this.instance_expr = new cr.expNode(owner_, m[5]);
			else
				this.instance_expr = null;
			this.results = [];
			this.parameters = [];
			if (m.length === 7)
			{
				paramsModel = m[6];
				this.results.length = paramsModel.length + 1;
			}
			else
				this.results.length = 1;	// to fit 'ret'
			break;
		case 23:		// eventvar_exp
			this.varname = m[1];
			this.eventvar = null;	// assigned in postInit
			break;
		}
		this.owner.maybeVaryForType(this.object_type);
		if (this.type >= 4 && this.type <= 17)
		{
			this.first = new cr.expNode(owner_, m[1]);
			this.second = new cr.expNode(owner_, m[2]);
		}
		if (paramsModel)
		{
			var i, len;
			for (i = 0, len = paramsModel.length; i < len; i++)
				this.parameters.push(new cr.expNode(owner_, paramsModel[i]));
		}
		cr.seal(this);
	};
	ExpNode.prototype.postInit = function ()
	{
		if (this.type === 23)	// eventvar_exp
		{
			this.eventvar = this.owner.runtime.getEventVariableByName(this.varname, this.owner.block.parent);
;
		}
		if (this.first)
			this.first.postInit();
		if (this.second)
			this.second.postInit();
		if (this.third)
			this.third.postInit();
		if (this.instance_expr)
			this.instance_expr.postInit();
		if (this.parameters)
		{
			var i, len;
			for (i = 0, len = this.parameters.length; i < len; i++)
				this.parameters[i].postInit();
		}
	};
	var tempValues = [];
	var tempValuesPtr = -1;
	function pushTempValue()
	{
		++tempValuesPtr;
		if (tempValues.length === tempValuesPtr)
			tempValues.push(new cr.expvalue());
		return tempValues[tempValuesPtr];
	};
	function popTempValue()
	{
		--tempValuesPtr;
	};
	function eval_params(parameters, results, temp)
	{
		var i, len;
		for (i = 0, len = parameters.length; i < len; ++i)
		{
			parameters[i].get(temp);
			results[i + 1] = temp.data;   // passing actual javascript value as argument instead of expvalue
		}
	}
	ExpNode.prototype.eval_system_exp = function (ret)
	{
		var parameters = this.parameters;
		var results = this.results;
		results[0] = ret;
		var temp = pushTempValue();
		eval_params(parameters, results, temp);
		popTempValue();
		this.func.apply(this.runtime.system, results);
	};
	ExpNode.prototype.eval_object_exp = function (ret)
	{
		var object_type = this.object_type;
		var results = this.results;
		var parameters = this.parameters;
		var instance_expr = this.instance_expr;
		var func = this.func;
		var index = this.owner.solindex;			// default to parameter's intended SOL index
		var sol = object_type.getCurrentSol();
		var instances = sol.getObjects();
		if (!instances.length)
		{
			if (sol.else_instances.length)
				instances = sol.else_instances;
			else
			{
				if (this.return_string)
					ret.set_string("");
				else
					ret.set_int(0);
				return;
			}
		}
		results[0] = ret;
		ret.object_class = object_type;		// so expression can access family type if need be
		var temp = pushTempValue();
		eval_params(parameters, results, temp);
		if (instance_expr) {
			instance_expr.get(temp);
			if (temp.is_number()) {
				index = temp.data;
				instances = object_type.instances;    // pick from all instances, not SOL
			}
		}
		popTempValue();
		var len = instances.length;
		if (index >= len || index <= -len)
			index %= len;      // wraparound
		if (index < 0)
			index += len;
		var returned_val = func.apply(instances[index], results);
;
	};
	ExpNode.prototype.eval_behavior_exp = function (ret)
	{
		var object_type = this.object_type;
		var results = this.results;
		var parameters = this.parameters;
		var instance_expr = this.instance_expr;
		var beh_index = this.beh_index;
		var func = this.func;
		var index = this.owner.solindex;			// default to parameter's intended SOL index
		var sol = object_type.getCurrentSol();
		var instances = sol.getObjects();
		if (!instances.length)
		{
			if (sol.else_instances.length)
				instances = sol.else_instances;
			else
			{
				if (this.return_string)
					ret.set_string("");
				else
					ret.set_int(0);
				return;
			}
		}
		results[0] = ret;
		ret.object_class = object_type;		// so expression can access family type if need be
		var temp = pushTempValue();
		eval_params(parameters, results, temp);
		if (instance_expr) {
			instance_expr.get(temp);
			if (temp.is_number()) {
				index = temp.data;
				instances = object_type.instances;    // pick from all instances, not SOL
			}
		}
		popTempValue();
		var len = instances.length;
		if (index >= len || index <= -len)
			index %= len;      // wraparound
		if (index < 0)
			index += len;
		var inst = instances[index];
		var offset = 0;
		if (object_type.is_family)
		{
			offset = inst.type.family_beh_map[object_type.family_index];
		}
		var returned_val = func.apply(inst.behavior_insts[beh_index + offset], results);
;
	};
	ExpNode.prototype.eval_instvar_exp = function (ret)
	{
		var instance_expr = this.instance_expr;
		var object_type = this.object_type;
		var varindex = this.varindex;
		var index = this.owner.solindex;		// default to parameter's intended SOL index
		var sol = object_type.getCurrentSol();
		var instances = sol.getObjects();
		var inst;
		if (!instances.length)
		{
			if (sol.else_instances.length)
				instances = sol.else_instances;
			else
			{
				if (this.return_string)
					ret.set_string("");
				else
					ret.set_int(0);
				return;
			}
		}
		if (instance_expr)
		{
			var temp = pushTempValue();
			instance_expr.get(temp);
			if (temp.is_number())
			{
				index = temp.data;
				var type_instances = object_type.instances;
				if (type_instances.length !== 0)		// avoid NaN result with %
				{
					index %= type_instances.length;     // wraparound
					if (index < 0)                      // offset
						index += type_instances.length;
				}
				inst = object_type.getInstanceByIID(index);
				var to_ret = inst.instance_vars[varindex];
				if (cr.is_string(to_ret))
					ret.set_string(to_ret);
				else
					ret.set_float(to_ret);
				popTempValue();
				return;         // done
			}
			popTempValue();
		}
		var len = instances.length;
		if (index >= len || index <= -len)
			index %= len;		// wraparound
		if (index < 0)
			index += len;
		inst = instances[index];
		var offset = 0;
		if (object_type.is_family)
		{
			offset = inst.type.family_var_map[object_type.family_index];
		}
		var to_ret = inst.instance_vars[varindex + offset];
		if (cr.is_string(to_ret))
			ret.set_string(to_ret);
		else
			ret.set_float(to_ret);
	};
	ExpNode.prototype.eval_int = function (ret)
	{
		ret.type = cr.exptype.Integer;
		ret.data = this.value;
	};
	ExpNode.prototype.eval_float = function (ret)
	{
		ret.type = cr.exptype.Float;
		ret.data = this.value;
	};
	ExpNode.prototype.eval_string = function (ret)
	{
		ret.type = cr.exptype.String;
		ret.data = this.value;
	};
	ExpNode.prototype.eval_unaryminus = function (ret)
	{
		this.first.get(ret);                // retrieve operand
		if (ret.is_number())
			ret.data = -ret.data;
	};
	ExpNode.prototype.eval_add = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data += temp.data;          // both operands numbers: add
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_subtract = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data -= temp.data;          // both operands numbers: subtract
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_multiply = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data *= temp.data;          // both operands numbers: multiply
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_divide = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data /= temp.data;          // both operands numbers: divide
			ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_mod = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data %= temp.data;          // both operands numbers: modulo
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_power = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			ret.data = Math.pow(ret.data, temp.data);   // both operands numbers: raise to power
			if (temp.is_float())
				ret.make_float();
		}
		popTempValue();
	};
	ExpNode.prototype.eval_and = function (ret)
	{
		this.first.get(ret);			// left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (temp.is_string() || ret.is_string())
			this.eval_and_stringconcat(ret, temp);
		else
			this.eval_and_logical(ret, temp);
		popTempValue();
	};
	ExpNode.prototype.eval_and_stringconcat = function (ret, temp)
	{
		if (ret.is_string() && temp.is_string())
			this.eval_and_stringconcat_str_str(ret, temp);
		else
			this.eval_and_stringconcat_num(ret, temp);
	};
	ExpNode.prototype.eval_and_stringconcat_str_str = function (ret, temp)
	{
		ret.data += temp.data;
	};
	ExpNode.prototype.eval_and_stringconcat_num = function (ret, temp)
	{
		if (ret.is_string())
		{
			ret.data += (Math.round(temp.data * 1e10) / 1e10).toString();
		}
		else
		{
			ret.set_string(ret.data.toString() + temp.data);
		}
	};
	ExpNode.prototype.eval_and_logical = function (ret, temp)
	{
		ret.set_int(ret.data && temp.data ? 1 : 0);
	};
	ExpNode.prototype.eval_or = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		if (ret.is_number() && temp.is_number())
		{
			if (ret.data || temp.data)
				ret.set_int(1);
			else
				ret.set_int(0);
		}
		popTempValue();
	};
	ExpNode.prototype.eval_conditional = function (ret)
	{
		this.first.get(ret);                // condition operand
		if (ret.data)                       // is true
			this.second.get(ret);           // evaluate second operand to ret
		else
			this.third.get(ret);            // evaluate third operand to ret
	};
	ExpNode.prototype.eval_equal = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data === temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_notequal = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data !== temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_less = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data < temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_lessequal = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data <= temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_greater = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data > temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_greaterequal = function (ret)
	{
		this.first.get(ret);                // left operand
		var temp = pushTempValue();
		this.second.get(temp);			// right operand
		ret.set_int(ret.data >= temp.data ? 1 : 0);
		popTempValue();
	};
	ExpNode.prototype.eval_eventvar_exp = function (ret)
	{
		var val = this.eventvar.getValue();
		if (cr.is_number(val))
			ret.set_float(val);
		else
			ret.set_string(val);
	};
	cr.expNode = ExpNode;
	function ExpValue(type, data)
	{
		this.type = type || cr.exptype.Integer;
		this.data = data || 0;
		this.object_class = null;
;
;
;
		if (this.type == cr.exptype.Integer)
			this.data = Math.floor(this.data);
		cr.seal(this);
	};
	ExpValue.prototype.is_int = function ()
	{
		return this.type === cr.exptype.Integer;
	};
	ExpValue.prototype.is_float = function ()
	{
		return this.type === cr.exptype.Float;
	};
	ExpValue.prototype.is_number = function ()
	{
		return this.type === cr.exptype.Integer || this.type === cr.exptype.Float;
	};
	ExpValue.prototype.is_string = function ()
	{
		return this.type === cr.exptype.String;
	};
	ExpValue.prototype.make_int = function ()
	{
		if (!this.is_int())
		{
			if (this.is_float())
				this.data = Math.floor(this.data);      // truncate float
			else if (this.is_string())
				this.data = parseInt(this.data, 10);
			this.type = cr.exptype.Integer;
		}
	};
	ExpValue.prototype.make_float = function ()
	{
		if (!this.is_float())
		{
			if (this.is_string())
				this.data = parseFloat(this.data);
			this.type = cr.exptype.Float;
		}
	};
	ExpValue.prototype.make_string = function ()
	{
		if (!this.is_string())
		{
			this.data = this.data.toString();
			this.type = cr.exptype.String;
		}
	};
	ExpValue.prototype.set_int = function (val)
	{
;
		this.type = cr.exptype.Integer;
		this.data = Math.floor(val);
	};
	ExpValue.prototype.set_float = function (val)
	{
;
		this.type = cr.exptype.Float;
		this.data = val;
	};
	ExpValue.prototype.set_string = function (val)
	{
;
		this.type = cr.exptype.String;
		this.data = val;
	};
	ExpValue.prototype.set_any = function (val)
	{
		if (cr.is_number(val))
		{
			this.type = cr.exptype.Float;
			this.data = val;
		}
		else if (cr.is_string(val))
		{
			this.type = cr.exptype.String;
			this.data = val.toString();
		}
		else
		{
			this.type = cr.exptype.Integer;
			this.data = 0;
		}
	};
	cr.expvalue = ExpValue;
	cr.exptype = {
		Integer: 0,     // emulated; no native integer support in javascript
		Float: 1,
		String: 2
	};
}());
;
cr.system_object = function (runtime)
{
    this.runtime = runtime;
	this.waits = [];
};
cr.system_object.prototype.saveToJSON = function ()
{
	var o = {};
	var i, len, j, lenj, p, w, t, sobj;
	o["waits"] = [];
	var owaits = o["waits"];
	var waitobj;
	for (i = 0, len = this.waits.length; i < len; i++)
	{
		w = this.waits[i];
		waitobj = {
			"t": w.time,
			"st": w.signaltag,
			"s": w.signalled,
			"ev": w.ev.sid,
			"sm": [],
			"sols": {}
		};
		if (w.ev.actions[w.actindex])
			waitobj["act"] = w.ev.actions[w.actindex].sid;
		for (j = 0, lenj = w.solModifiers.length; j < lenj; j++)
			waitobj["sm"].push(w.solModifiers[j].sid);
		for (p in w.sols)
		{
			if (w.sols.hasOwnProperty(p))
			{
				t = this.runtime.types_by_index[parseInt(p, 10)];
;
				sobj = {
					"sa": w.sols[p].sa,
					"insts": []
				};
				for (j = 0, lenj = w.sols[p].insts.length; j < lenj; j++)
					sobj["insts"].push(w.sols[p].insts[j].uid);
				waitobj["sols"][t.sid.toString()] = sobj;
			}
		}
		owaits.push(waitobj);
	}
	return o;
};
cr.system_object.prototype.loadFromJSON = function (o)
{
	var owaits = o["waits"];
	var i, len, j, lenj, p, w, addWait, e, aindex, t, savedsol, nusol, inst;
	cr.clearArray(this.waits);
	for (i = 0, len = owaits.length; i < len; i++)
	{
		w = owaits[i];
		e = this.runtime.blocksBySid[w["ev"].toString()];
		if (!e)
			continue;	// event must've gone missing
		aindex = -1;
		for (j = 0, lenj = e.actions.length; j < lenj; j++)
		{
			if (e.actions[j].sid === w["act"])
			{
				aindex = j;
				break;
			}
		}
		if (aindex === -1)
			continue;	// action must've gone missing
		addWait = {};
		addWait.sols = {};
		addWait.solModifiers = [];
		addWait.deleteme = false;
		addWait.time = w["t"];
		addWait.signaltag = w["st"] || "";
		addWait.signalled = !!w["s"];
		addWait.ev = e;
		addWait.actindex = aindex;
		for (j = 0, lenj = w["sm"].length; j < lenj; j++)
		{
			t = this.runtime.getObjectTypeBySid(w["sm"][j]);
			if (t)
				addWait.solModifiers.push(t);
		}
		for (p in w["sols"])
		{
			if (w["sols"].hasOwnProperty(p))
			{
				t = this.runtime.getObjectTypeBySid(parseInt(p, 10));
				if (!t)
					continue;		// type must've been deleted
				savedsol = w["sols"][p];
				nusol = {
					sa: savedsol["sa"],
					insts: []
				};
				for (j = 0, lenj = savedsol["insts"].length; j < lenj; j++)
				{
					inst = this.runtime.getObjectByUID(savedsol["insts"][j]);
					if (inst)
						nusol.insts.push(inst);
				}
				addWait.sols[t.index.toString()] = nusol;
			}
		}
		this.waits.push(addWait);
	}
};
(function ()
{
	var sysProto = cr.system_object.prototype;
	function SysCnds() {};
    SysCnds.prototype.EveryTick = function()
    {
        return true;
    };
    SysCnds.prototype.OnLayoutStart = function()
    {
        return true;
    };
    SysCnds.prototype.OnLayoutEnd = function()
    {
        return true;
    };
    SysCnds.prototype.Compare = function(x, cmp, y)
    {
        return cr.do_cmp(x, cmp, y);
    };
    SysCnds.prototype.CompareTime = function (cmp, t)
    {
        var elapsed = this.runtime.kahanTime.sum;
        if (cmp === 0)
        {
            var cnd = this.runtime.getCurrentCondition();
            if (!cnd.extra["CompareTime_executed"])
            {
                if (elapsed >= t)
                {
                    cnd.extra["CompareTime_executed"] = true;
                    return true;
                }
            }
            return false;
        }
        return cr.do_cmp(elapsed, cmp, t);
    };
    SysCnds.prototype.LayerVisible = function (layer)
    {
        if (!layer)
            return false;
        else
            return layer.visible;
    };
	SysCnds.prototype.LayerEmpty = function (layer)
    {
        if (!layer)
            return false;
        else
            return !layer.instances.length;
    };
	SysCnds.prototype.LayerCmpOpacity = function (layer, cmp, opacity_)
	{
		if (!layer)
			return false;
		return cr.do_cmp(layer.opacity * 100, cmp, opacity_);
	};
    SysCnds.prototype.Repeat = function (count)
    {
		var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack();
        var i;
		if (solModifierAfterCnds)
		{
			for (i = 0; i < count && !current_loop.stopped; i++)
			{
				this.runtime.pushCopySol(current_event.solModifiers);
				current_loop.index = i;
				current_event.retrigger();
				this.runtime.popSol(current_event.solModifiers);
			}
		}
		else
		{
			for (i = 0; i < count && !current_loop.stopped; i++)
			{
				current_loop.index = i;
				current_event.retrigger();
			}
		}
        this.runtime.popLoopStack();
		return false;
    };
	SysCnds.prototype.While = function (count)
    {
		var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack();
        var i;
		if (solModifierAfterCnds)
		{
			for (i = 0; !current_loop.stopped; i++)
			{
				this.runtime.pushCopySol(current_event.solModifiers);
				current_loop.index = i;
				if (!current_event.retrigger())		// one of the other conditions returned false
					current_loop.stopped = true;	// break
				this.runtime.popSol(current_event.solModifiers);
			}
		}
		else
		{
			for (i = 0; !current_loop.stopped; i++)
			{
				current_loop.index = i;
				if (!current_event.retrigger())
					current_loop.stopped = true;
			}
		}
        this.runtime.popLoopStack();
		return false;
    };
    SysCnds.prototype.For = function (name, start, end)
    {
        var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack(name);
        var i;
		if (end < start)
		{
			if (solModifierAfterCnds)
			{
				for (i = start; i >= end && !current_loop.stopped; --i)  // inclusive to end
				{
					this.runtime.pushCopySol(current_event.solModifiers);
					current_loop.index = i;
					current_event.retrigger();
					this.runtime.popSol(current_event.solModifiers);
				}
			}
			else
			{
				for (i = start; i >= end && !current_loop.stopped; --i)  // inclusive to end
				{
					current_loop.index = i;
					current_event.retrigger();
				}
			}
		}
		else
		{
			if (solModifierAfterCnds)
			{
				for (i = start; i <= end && !current_loop.stopped; ++i)  // inclusive to end
				{
					this.runtime.pushCopySol(current_event.solModifiers);
					current_loop.index = i;
					current_event.retrigger();
					this.runtime.popSol(current_event.solModifiers);
				}
			}
			else
			{
				for (i = start; i <= end && !current_loop.stopped; ++i)  // inclusive to end
				{
					current_loop.index = i;
					current_event.retrigger();
				}
			}
		}
        this.runtime.popLoopStack();
		return false;
    };
	var foreach_instancestack = [];
	var foreach_instanceptr = -1;
    SysCnds.prototype.ForEach = function (obj)
    {
        var sol = obj.getCurrentSol();
		foreach_instanceptr++;
		if (foreach_instancestack.length === foreach_instanceptr)
			foreach_instancestack.push([]);
		var instances = foreach_instancestack[foreach_instanceptr];
		cr.shallowAssignArray(instances, sol.getObjects());
        var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack();
        var i, len, j, lenj, inst, s, sol2;
		var is_contained = obj.is_contained;
		if (solModifierAfterCnds)
		{
			for (i = 0, len = instances.length; i < len && !current_loop.stopped; i++)
			{
				this.runtime.pushCopySol(current_event.solModifiers);
				inst = instances[i];
				sol = obj.getCurrentSol();
				sol.select_all = false;
				cr.clearArray(sol.instances);
				sol.instances[0] = inst;
				if (is_contained)
				{
					for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
					{
						s = inst.siblings[j];
						sol2 = s.type.getCurrentSol();
						sol2.select_all = false;
						cr.clearArray(sol2.instances);
						sol2.instances[0] = s;
					}
				}
				current_loop.index = i;
				current_event.retrigger();
				this.runtime.popSol(current_event.solModifiers);
			}
		}
		else
		{
			sol.select_all = false;
			cr.clearArray(sol.instances);
			for (i = 0, len = instances.length; i < len && !current_loop.stopped; i++)
			{
				inst = instances[i];
				sol.instances[0] = inst;
				if (is_contained)
				{
					for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
					{
						s = inst.siblings[j];
						sol2 = s.type.getCurrentSol();
						sol2.select_all = false;
						cr.clearArray(sol2.instances);
						sol2.instances[0] = s;
					}
				}
				current_loop.index = i;
				current_event.retrigger();
			}
		}
		cr.clearArray(instances);
        this.runtime.popLoopStack();
		foreach_instanceptr--;
		return false;
    };
	function foreach_sortinstances(a, b)
	{
		var va = a.extra["c2_feo_val"];
		var vb = b.extra["c2_feo_val"];
		if (cr.is_number(va) && cr.is_number(vb))
			return va - vb;
		else
		{
			va = "" + va;
			vb = "" + vb;
			if (va < vb)
				return -1;
			else if (va > vb)
				return 1;
			else
				return 0;
		}
	};
	SysCnds.prototype.ForEachOrdered = function (obj, exp, order)
    {
        var sol = obj.getCurrentSol();
		foreach_instanceptr++;
		if (foreach_instancestack.length === foreach_instanceptr)
			foreach_instancestack.push([]);
		var instances = foreach_instancestack[foreach_instanceptr];
		cr.shallowAssignArray(instances, sol.getObjects());
        var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var current_condition = this.runtime.getCurrentCondition();
		var solModifierAfterCnds = current_frame.isModifierAfterCnds();
        var current_loop = this.runtime.pushLoopStack();
		var i, len, j, lenj, inst, s, sol2;
		for (i = 0, len = instances.length; i < len; i++)
		{
			instances[i].extra["c2_feo_val"] = current_condition.parameters[1].get(i);
		}
		instances.sort(foreach_sortinstances);
		if (order === 1)
			instances.reverse();
		var is_contained = obj.is_contained;
		if (solModifierAfterCnds)
		{
			for (i = 0, len = instances.length; i < len && !current_loop.stopped; i++)
			{
				this.runtime.pushCopySol(current_event.solModifiers);
				inst = instances[i];
				sol = obj.getCurrentSol();
				sol.select_all = false;
				cr.clearArray(sol.instances);
				sol.instances[0] = inst;
				if (is_contained)
				{
					for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
					{
						s = inst.siblings[j];
						sol2 = s.type.getCurrentSol();
						sol2.select_all = false;
						cr.clearArray(sol2.instances);
						sol2.instances[0] = s;
					}
				}
				current_loop.index = i;
				current_event.retrigger();
				this.runtime.popSol(current_event.solModifiers);
			}
		}
		else
		{
			sol.select_all = false;
			cr.clearArray(sol.instances);
			for (i = 0, len = instances.length; i < len && !current_loop.stopped; i++)
			{
				inst = instances[i];
				sol.instances[0] = inst;
				if (is_contained)
				{
					for (j = 0, lenj = inst.siblings.length; j < lenj; j++)
					{
						s = inst.siblings[j];
						sol2 = s.type.getCurrentSol();
						sol2.select_all = false;
						cr.clearArray(sol2.instances);
						sol2.instances[0] = s;
					}
				}
				current_loop.index = i;
				current_event.retrigger();
			}
		}
		cr.clearArray(instances);
        this.runtime.popLoopStack();
		foreach_instanceptr--;
		return false;
    };
	SysCnds.prototype.PickByComparison = function (obj_, exp_, cmp_, val_)
	{
		var i, len, k, inst;
		if (!obj_)
			return;
		foreach_instanceptr++;
		if (foreach_instancestack.length === foreach_instanceptr)
			foreach_instancestack.push([]);
		var tmp_instances = foreach_instancestack[foreach_instanceptr];
		var sol = obj_.getCurrentSol();
		cr.shallowAssignArray(tmp_instances, sol.getObjects());
		if (sol.select_all)
			cr.clearArray(sol.else_instances);
		var current_condition = this.runtime.getCurrentCondition();
		for (i = 0, k = 0, len = tmp_instances.length; i < len; i++)
		{
			inst = tmp_instances[i];
			tmp_instances[k] = inst;
			exp_ = current_condition.parameters[1].get(i);
			val_ = current_condition.parameters[3].get(i);
			if (cr.do_cmp(exp_, cmp_, val_))
			{
				k++;
			}
			else
			{
				sol.else_instances.push(inst);
			}
		}
		cr.truncateArray(tmp_instances, k);
		sol.select_all = false;
		cr.shallowAssignArray(sol.instances, tmp_instances);
		cr.clearArray(tmp_instances);
		foreach_instanceptr--;
		obj_.applySolToContainer();
		return !!sol.instances.length;
	};
	SysCnds.prototype.PickByEvaluate = function (obj_, exp_)
	{
		var i, len, k, inst;
		if (!obj_)
			return;
		foreach_instanceptr++;
		if (foreach_instancestack.length === foreach_instanceptr)
			foreach_instancestack.push([]);
		var tmp_instances = foreach_instancestack[foreach_instanceptr];
		var sol = obj_.getCurrentSol();
		cr.shallowAssignArray(tmp_instances, sol.getObjects());
		if (sol.select_all)
			cr.clearArray(sol.else_instances);
		var current_condition = this.runtime.getCurrentCondition();
		for (i = 0, k = 0, len = tmp_instances.length; i < len; i++)
		{
			inst = tmp_instances[i];
			tmp_instances[k] = inst;
			exp_ = current_condition.parameters[1].get(i);
			if (exp_)
			{
				k++;
			}
			else
			{
				sol.else_instances.push(inst);
			}
		}
		cr.truncateArray(tmp_instances, k);
		sol.select_all = false;
		cr.shallowAssignArray(sol.instances, tmp_instances);
		cr.clearArray(tmp_instances);
		foreach_instanceptr--;
		obj_.applySolToContainer();
		return !!sol.instances.length;
	};
    SysCnds.prototype.TriggerOnce = function ()
    {
        var cndextra = this.runtime.getCurrentCondition().extra;
		if (typeof cndextra["TriggerOnce_lastTick"] === "undefined")
			cndextra["TriggerOnce_lastTick"] = -1;
        var last_tick = cndextra["TriggerOnce_lastTick"];
        var cur_tick = this.runtime.tickcount;
        cndextra["TriggerOnce_lastTick"] = cur_tick;
        return this.runtime.layout_first_tick || last_tick !== cur_tick - 1;
    };
    SysCnds.prototype.Every = function (seconds)
    {
        var cnd = this.runtime.getCurrentCondition();
        var last_time = cnd.extra["Every_lastTime"] || 0;
        var cur_time = this.runtime.kahanTime.sum;
		if (typeof cnd.extra["Every_seconds"] === "undefined")
			cnd.extra["Every_seconds"] = seconds;
		var this_seconds = cnd.extra["Every_seconds"];
        if (cur_time >= last_time + this_seconds)
        {
            cnd.extra["Every_lastTime"] = last_time + this_seconds;
			if (cur_time >= cnd.extra["Every_lastTime"] + 0.04)
			{
				cnd.extra["Every_lastTime"] = cur_time;
			}
			cnd.extra["Every_seconds"] = seconds;
            return true;
        }
		else if (cur_time < last_time - 0.1)
		{
			cnd.extra["Every_lastTime"] = cur_time;
		}
		return false;
    };
    SysCnds.prototype.PickNth = function (obj, index)
    {
        if (!obj)
            return false;
        var sol = obj.getCurrentSol();
        var instances = sol.getObjects();
		index = cr.floor(index);
        if (index < 0 || index >= instances.length)
            return false;
		var inst = instances[index];
        sol.pick_one(inst);
		obj.applySolToContainer();
        return true;
    };
	SysCnds.prototype.PickRandom = function (obj)
    {
        if (!obj)
            return false;
        var sol = obj.getCurrentSol();
        var instances = sol.getObjects();
		var index = cr.floor(Math.random() * instances.length);
        if (index >= instances.length)
            return false;
		var inst = instances[index];
        sol.pick_one(inst);
		obj.applySolToContainer();
        return true;
    };
	SysCnds.prototype.CompareVar = function (v, cmp, val)
    {
        return cr.do_cmp(v.getValue(), cmp, val);
    };
    SysCnds.prototype.IsGroupActive = function (group)
    {
		var g = this.runtime.groups_by_name[group.toLowerCase()];
        return g && g.group_active;
    };
	SysCnds.prototype.IsPreview = function ()
	{
		return typeof cr_is_preview !== "undefined";
	};
	SysCnds.prototype.PickAll = function (obj)
    {
        if (!obj)
            return false;
		if (!obj.instances.length)
			return false;
        var sol = obj.getCurrentSol();
        sol.select_all = true;
		obj.applySolToContainer();
        return true;
    };
	SysCnds.prototype.IsMobile = function ()
	{
		return this.runtime.isMobile;
	};
	SysCnds.prototype.CompareBetween = function (x, a, b)
	{
		return x >= a && x <= b;
	};
	SysCnds.prototype.Else = function ()
	{
		var current_frame = this.runtime.getCurrentEventStack();
		if (current_frame.else_branch_ran)
			return false;		// another event in this else-if chain has run
		else
			return !current_frame.last_event_true;
		/*
		var current_frame = this.runtime.getCurrentEventStack();
        var current_event = current_frame.current_event;
		var prev_event = current_event.prev_block;
		if (!prev_event)
			return false;
		if (prev_event.is_logical)
			return !this.runtime.last_event_true;
		var i, len, j, lenj, s, sol, temp, inst, any_picked = false;
		for (i = 0, len = prev_event.cndReferences.length; i < len; i++)
		{
			s = prev_event.cndReferences[i];
			sol = s.getCurrentSol();
			if (sol.select_all || sol.instances.length === s.instances.length)
			{
				sol.select_all = false;
				sol.instances.length = 0;
			}
			else
			{
				if (sol.instances.length === 1 && sol.else_instances.length === 0 && s.instances.length >= 2)
				{
					inst = sol.instances[0];
					sol.instances.length = 0;
					for (j = 0, lenj = s.instances.length; j < lenj; j++)
					{
						if (s.instances[j] != inst)
							sol.instances.push(s.instances[j]);
					}
					any_picked = true;
				}
				else
				{
					temp = sol.instances;
					sol.instances = sol.else_instances;
					sol.else_instances = temp;
					any_picked = true;
				}
			}
		}
		return any_picked;
		*/
	};
	SysCnds.prototype.OnLoadFinished = function ()
	{
		return true;
	};
	SysCnds.prototype.OnCanvasSnapshot = function ()
	{
		return true;
	};
	SysCnds.prototype.EffectsSupported = function ()
	{
		return !!this.runtime.glwrap;
	};
	SysCnds.prototype.OnSaveComplete = function ()
	{
		return true;
	};
	SysCnds.prototype.OnSaveFailed = function ()
	{
		return true;
	};
	SysCnds.prototype.OnLoadComplete = function ()
	{
		return true;
	};
	SysCnds.prototype.OnLoadFailed = function ()
	{
		return true;
	};
	SysCnds.prototype.ObjectUIDExists = function (u)
	{
		return !!this.runtime.getObjectByUID(u);
	};
	SysCnds.prototype.IsOnPlatform = function (p)
	{
		var rt = this.runtime;
		switch (p) {
		case 0:		// HTML5 website
			return !rt.isDomFree && !rt.isNodeWebkit && !rt.isCordova && !rt.isWinJS && !rt.isWindowsPhone8 && !rt.isBlackberry10 && !rt.isAmazonWebApp;
		case 1:		// iOS
			return rt.isiOS;
		case 2:		// Android
			return rt.isAndroid;
		case 3:		// Windows 8
			return rt.isWindows8App;
		case 4:		// Windows Phone 8
			return rt.isWindowsPhone8;
		case 5:		// Blackberry 10
			return rt.isBlackberry10;
		case 6:		// Tizen
			return rt.isTizen;
		case 7:		// CocoonJS
			return rt.isCocoonJs;
		case 8:		// Cordova
			return rt.isCordova;
		case 9:	// Scirra Arcade
			return rt.isArcade;
		case 10:	// node-webkit
			return rt.isNodeWebkit;
		case 11:	// crosswalk
			return rt.isCrosswalk;
		case 12:	// amazon webapp
			return rt.isAmazonWebApp;
		case 13:	// windows 10 app
			return rt.isWindows10;
		default:	// should not be possible
			return false;
		}
	};
	var cacheRegex = null;
	var lastRegex = "";
	var lastFlags = "";
	function getRegex(regex_, flags_)
	{
		if (!cacheRegex || regex_ !== lastRegex || flags_ !== lastFlags)
		{
			cacheRegex = new RegExp(regex_, flags_);
			lastRegex = regex_;
			lastFlags = flags_;
		}
		cacheRegex.lastIndex = 0;		// reset
		return cacheRegex;
	};
	SysCnds.prototype.RegexTest = function (str_, regex_, flags_)
	{
		var regex = getRegex(regex_, flags_);
		return regex.test(str_);
	};
	var tmp_arr = [];
	SysCnds.prototype.PickOverlappingPoint = function (obj_, x_, y_)
	{
		if (!obj_)
            return false;
        var sol = obj_.getCurrentSol();
        var instances = sol.getObjects();
		var current_event = this.runtime.getCurrentEventStack().current_event;
		var orblock = current_event.orblock;
		var cnd = this.runtime.getCurrentCondition();
		var i, len, inst, pick;
		if (sol.select_all)
		{
			cr.shallowAssignArray(tmp_arr, instances);
			cr.clearArray(sol.else_instances);
			sol.select_all = false;
			cr.clearArray(sol.instances);
		}
		else
		{
			if (orblock)
			{
				cr.shallowAssignArray(tmp_arr, sol.else_instances);
				cr.clearArray(sol.else_instances);
			}
			else
			{
				cr.shallowAssignArray(tmp_arr, instances);
				cr.clearArray(sol.instances);
			}
		}
		for (i = 0, len = tmp_arr.length; i < len; ++i)
		{
			inst = tmp_arr[i];
			inst.update_bbox();
			pick = cr.xor(inst.contains_pt(x_, y_), cnd.inverted);
			if (pick)
				sol.instances.push(inst);
			else
				sol.else_instances.push(inst);
		}
		obj_.applySolToContainer();
		return cr.xor(!!sol.instances.length, cnd.inverted);
	};
	SysCnds.prototype.IsNaN = function (n)
	{
		return !!isNaN(n);
	};
	SysCnds.prototype.AngleWithin = function (a1, within, a2)
	{
		return cr.angleDiff(cr.to_radians(a1), cr.to_radians(a2)) <= cr.to_radians(within);
	};
	SysCnds.prototype.IsClockwiseFrom = function (a1, a2)
	{
		return cr.angleClockwise(cr.to_radians(a1), cr.to_radians(a2));
	};
	SysCnds.prototype.IsBetweenAngles = function (a, la, ua)
	{
		var angle = cr.to_clamped_radians(a);
		var lower = cr.to_clamped_radians(la);
		var upper = cr.to_clamped_radians(ua);
		var obtuse = (!cr.angleClockwise(upper, lower));
		if (obtuse)
			return !(!cr.angleClockwise(angle, lower) && cr.angleClockwise(angle, upper));
		else
			return cr.angleClockwise(angle, lower) && !cr.angleClockwise(angle, upper);
	};
	SysCnds.prototype.IsValueType = function (x, t)
	{
		if (typeof x === "number")
			return t === 0;
		else		// string
			return t === 1;
	};
	sysProto.cnds = new SysCnds();
    function SysActs() {};
    SysActs.prototype.GoToLayout = function (to)
    {
		if (this.runtime.isloading)
			return;		// cannot change layout while loading on loader layout
		if (this.runtime.changelayout)
			return;		// already changing to a different layout
;
        this.runtime.changelayout = to;
    };
	SysActs.prototype.NextPrevLayout = function (prev)
    {
		if (this.runtime.isloading)
			return;		// cannot change layout while loading on loader layout
		if (this.runtime.changelayout)
			return;		// already changing to a different layout
		var index = this.runtime.layouts_by_index.indexOf(this.runtime.running_layout);
		if (prev && index === 0)
			return;		// cannot go to previous layout from first layout
		if (!prev && index === this.runtime.layouts_by_index.length - 1)
			return;		// cannot go to next layout from last layout
		var to = this.runtime.layouts_by_index[index + (prev ? -1 : 1)];
;
        this.runtime.changelayout = to;
    };
    SysActs.prototype.CreateObject = function (obj, layer, x, y)
    {
        if (!layer || !obj)
            return;
        var inst = this.runtime.createInstance(obj, layer, x, y);
		if (!inst)
			return;
		this.runtime.isInOnDestroy++;
		var i, len, s;
		this.runtime.trigger(Object.getPrototypeOf(obj.plugin).cnds.OnCreated, inst);
		if (inst.is_contained)
		{
			for (i = 0, len = inst.siblings.length; i < len; i++)
			{
				s = inst.siblings[i];
				this.runtime.trigger(Object.getPrototypeOf(s.type.plugin).cnds.OnCreated, s);
			}
		}
		this.runtime.isInOnDestroy--;
        var sol = obj.getCurrentSol();
        sol.select_all = false;
		cr.clearArray(sol.instances);
		sol.instances[0] = inst;
		if (inst.is_contained)
		{
			for (i = 0, len = inst.siblings.length; i < len; i++)
			{
				s = inst.siblings[i];
				sol = s.type.getCurrentSol();
				sol.select_all = false;
				cr.clearArray(sol.instances);
				sol.instances[0] = s;
			}
		}
    };
    SysActs.prototype.SetLayerVisible = function (layer, visible_)
    {
        if (!layer)
            return;
		if (layer.visible !== visible_)
		{
			layer.visible = visible_;
			this.runtime.redraw = true;
		}
    };
	SysActs.prototype.SetLayerOpacity = function (layer, opacity_)
	{
		if (!layer)
			return;
		opacity_ = cr.clamp(opacity_ / 100, 0, 1);
		if (layer.opacity !== opacity_)
		{
			layer.opacity = opacity_;
			this.runtime.redraw = true;
		}
	};
	SysActs.prototype.SetLayerScaleRate = function (layer, sr)
	{
		if (!layer)
			return;
		if (layer.zoomRate !== sr)
		{
			layer.zoomRate = sr;
			this.runtime.redraw = true;
		}
	};
	SysActs.prototype.SetLayerForceOwnTexture = function (layer, f)
	{
		if (!layer)
			return;
		f = !!f;
		if (layer.forceOwnTexture !== f)
		{
			layer.forceOwnTexture = f;
			this.runtime.redraw = true;
		}
	};
	SysActs.prototype.SetLayoutScale = function (s)
	{
		if (!this.runtime.running_layout)
			return;
		if (this.runtime.running_layout.scale !== s)
		{
			this.runtime.running_layout.scale = s;
			this.runtime.running_layout.boundScrolling();
			this.runtime.redraw = true;
		}
	};
    SysActs.prototype.ScrollX = function(x)
    {
        this.runtime.running_layout.scrollToX(x);
    };
    SysActs.prototype.ScrollY = function(y)
    {
        this.runtime.running_layout.scrollToY(y);
    };
    SysActs.prototype.Scroll = function(x, y)
    {
        this.runtime.running_layout.scrollToX(x);
        this.runtime.running_layout.scrollToY(y);
    };
    SysActs.prototype.ScrollToObject = function(obj)
    {
        var inst = obj.getFirstPicked();
        if (inst)
        {
            this.runtime.running_layout.scrollToX(inst.x);
            this.runtime.running_layout.scrollToY(inst.y);
        }
    };
	SysActs.prototype.SetVar = function(v, x)
	{
;
		if (v.vartype === 0)
		{
			if (cr.is_number(x))
				v.setValue(x);
			else
				v.setValue(parseFloat(x));
		}
		else if (v.vartype === 1)
			v.setValue(x.toString());
	};
	SysActs.prototype.AddVar = function(v, x)
	{
;
		if (v.vartype === 0)
		{
			if (cr.is_number(x))
				v.setValue(v.getValue() + x);
			else
				v.setValue(v.getValue() + parseFloat(x));
		}
		else if (v.vartype === 1)
			v.setValue(v.getValue() + x.toString());
	};
	SysActs.prototype.SubVar = function(v, x)
	{
;
		if (v.vartype === 0)
		{
			if (cr.is_number(x))
				v.setValue(v.getValue() - x);
			else
				v.setValue(v.getValue() - parseFloat(x));
		}
	};
    SysActs.prototype.SetGroupActive = function (group, active)
    {
		var g = this.runtime.groups_by_name[group.toLowerCase()];
		if (!g)
			return;
		switch (active) {
		case 0:
			g.setGroupActive(false);
			break;
		case 1:
			g.setGroupActive(true);
			break;
		case 2:
			g.setGroupActive(!g.group_active);
			break;
		}
    };
    SysActs.prototype.SetTimescale = function (ts_)
    {
        var ts = ts_;
        if (ts < 0)
            ts = 0;
        this.runtime.timescale = ts;
    };
    SysActs.prototype.SetObjectTimescale = function (obj, ts_)
    {
        var ts = ts_;
        if (ts < 0)
            ts = 0;
        if (!obj)
            return;
        var sol = obj.getCurrentSol();
        var instances = sol.getObjects();
        var i, len;
        for (i = 0, len = instances.length; i < len; i++)
        {
            instances[i].my_timescale = ts;
        }
    };
    SysActs.prototype.RestoreObjectTimescale = function (obj)
    {
        if (!obj)
            return false;
        var sol = obj.getCurrentSol();
        var instances = sol.getObjects();
        var i, len;
        for (i = 0, len = instances.length; i < len; i++)
        {
            instances[i].my_timescale = -1.0;
        }
    };
	var waitobjrecycle = [];
	function allocWaitObject()
	{
		var w;
		if (waitobjrecycle.length)
			w = waitobjrecycle.pop();
		else
		{
			w = {};
			w.sols = {};
			w.solModifiers = [];
		}
		w.deleteme = false;
		return w;
	};
	function freeWaitObject(w)
	{
		cr.wipe(w.sols);
		cr.clearArray(w.solModifiers);
		waitobjrecycle.push(w);
	};
	var solstateobjects = [];
	function allocSolStateObject()
	{
		var s;
		if (solstateobjects.length)
			s = solstateobjects.pop();
		else
		{
			s = {};
			s.insts = [];
		}
		s.sa = false;
		return s;
	};
	function freeSolStateObject(s)
	{
		cr.clearArray(s.insts);
		solstateobjects.push(s);
	};
	SysActs.prototype.Wait = function (seconds)
	{
		if (seconds < 0)
			return;
		var i, len, s, t, ss;
		var evinfo = this.runtime.getCurrentEventStack();
		var waitobj = allocWaitObject();
		waitobj.time = this.runtime.kahanTime.sum + seconds;
		waitobj.signaltag = "";
		waitobj.signalled = false;
		waitobj.ev = evinfo.current_event;
		waitobj.actindex = evinfo.actindex + 1;	// pointing at next action
		for (i = 0, len = this.runtime.types_by_index.length; i < len; i++)
		{
			t = this.runtime.types_by_index[i];
			s = t.getCurrentSol();
			if (s.select_all && evinfo.current_event.solModifiers.indexOf(t) === -1)
				continue;
			waitobj.solModifiers.push(t);
			ss = allocSolStateObject();
			ss.sa = s.select_all;
			cr.shallowAssignArray(ss.insts, s.instances);
			waitobj.sols[i.toString()] = ss;
		}
		this.waits.push(waitobj);
		return true;
	};
	SysActs.prototype.WaitForSignal = function (tag)
	{
		var i, len, s, t, ss;
		var evinfo = this.runtime.getCurrentEventStack();
		var waitobj = allocWaitObject();
		waitobj.time = -1;
		waitobj.signaltag = tag.toLowerCase();
		waitobj.signalled = false;
		waitobj.ev = evinfo.current_event;
		waitobj.actindex = evinfo.actindex + 1;	// pointing at next action
		for (i = 0, len = this.runtime.types_by_index.length; i < len; i++)
		{
			t = this.runtime.types_by_index[i];
			s = t.getCurrentSol();
			if (s.select_all && evinfo.current_event.solModifiers.indexOf(t) === -1)
				continue;
			waitobj.solModifiers.push(t);
			ss = allocSolStateObject();
			ss.sa = s.select_all;
			cr.shallowAssignArray(ss.insts, s.instances);
			waitobj.sols[i.toString()] = ss;
		}
		this.waits.push(waitobj);
		return true;
	};
	SysActs.prototype.Signal = function (tag)
	{
		var lowertag = tag.toLowerCase();
		var i, len, w;
		for (i = 0, len = this.waits.length; i < len; ++i)
		{
			w = this.waits[i];
			if (w.time !== -1)
				continue;					// timer wait, ignore
			if (w.signaltag === lowertag)	// waiting for this signal
				w.signalled = true;			// will run on next check
		}
	};
	SysActs.prototype.SetLayerScale = function (layer, scale)
    {
        if (!layer)
            return;
		if (layer.scale === scale)
			return;
        layer.scale = scale;
        this.runtime.redraw = true;
    };
	SysActs.prototype.ResetGlobals = function ()
	{
		var i, len, g;
		for (i = 0, len = this.runtime.all_global_vars.length; i < len; i++)
		{
			g = this.runtime.all_global_vars[i];
			g.data = g.initial;
		}
	};
	SysActs.prototype.SetLayoutAngle = function (a)
	{
		a = cr.to_radians(a);
		a = cr.clamp_angle(a);
		if (this.runtime.running_layout)
		{
			if (this.runtime.running_layout.angle !== a)
			{
				this.runtime.running_layout.angle = a;
				this.runtime.redraw = true;
			}
		}
	};
	SysActs.prototype.SetLayerAngle = function (layer, a)
    {
        if (!layer)
            return;
		a = cr.to_radians(a);
		a = cr.clamp_angle(a);
		if (layer.angle === a)
			return;
        layer.angle = a;
        this.runtime.redraw = true;
    };
	SysActs.prototype.SetLayerParallax = function (layer, px, py)
    {
        if (!layer)
            return;
		if (layer.parallaxX === px / 100 && layer.parallaxY === py / 100)
			return;
        layer.parallaxX = px / 100;
		layer.parallaxY = py / 100;
		if (layer.parallaxX !== 1 || layer.parallaxY !== 1)
		{
			var i, len, instances = layer.instances;
			for (i = 0, len = instances.length; i < len; ++i)
			{
				instances[i].type.any_instance_parallaxed = true;
			}
		}
        this.runtime.redraw = true;
    };
	SysActs.prototype.SetLayerBackground = function (layer, c)
    {
        if (!layer)
            return;
		var r = cr.GetRValue(c);
		var g = cr.GetGValue(c);
		var b = cr.GetBValue(c);
		if (layer.background_color[0] === r && layer.background_color[1] === g && layer.background_color[2] === b)
			return;
        layer.background_color[0] = r;
		layer.background_color[1] = g;
		layer.background_color[2] = b;
        this.runtime.redraw = true;
    };
	SysActs.prototype.SetLayerTransparent = function (layer, t)
    {
        if (!layer)
            return;
		if (!!t === !!layer.transparent)
			return;
		layer.transparent = !!t;
        this.runtime.redraw = true;
    };
	SysActs.prototype.SetLayerBlendMode = function (layer, bm)
    {
        if (!layer)
            return;
		if (layer.blend_mode === bm)
			return;
		layer.blend_mode = bm;
		layer.compositeOp = cr.effectToCompositeOp(layer.blend_mode);
		if (this.runtime.gl)
			cr.setGLBlend(layer, layer.blend_mode, this.runtime.gl);
        this.runtime.redraw = true;
    };
	SysActs.prototype.StopLoop = function ()
	{
		if (this.runtime.loop_stack_index < 0)
			return;		// no loop currently running
		this.runtime.getCurrentLoop().stopped = true;
	};
	SysActs.prototype.GoToLayoutByName = function (layoutname)
	{
		if (this.runtime.isloading)
			return;		// cannot change layout while loading on loader layout
		if (this.runtime.changelayout)
			return;		// already changing to different layout
;
		var l;
		for (l in this.runtime.layouts)
		{
			if (this.runtime.layouts.hasOwnProperty(l) && cr.equals_nocase(l, layoutname))
			{
				this.runtime.changelayout = this.runtime.layouts[l];
				return;
			}
		}
	};
	SysActs.prototype.RestartLayout = function (layoutname)
	{
		if (this.runtime.isloading)
			return;		// cannot restart loader layouts
		if (this.runtime.changelayout)
			return;		// already changing to a different layout
;
		if (!this.runtime.running_layout)
			return;
		this.runtime.changelayout = this.runtime.running_layout;
		var i, len, g;
		for (i = 0, len = this.runtime.allGroups.length; i < len; i++)
		{
			g = this.runtime.allGroups[i];
			g.setGroupActive(g.initially_activated);
		}
	};
	SysActs.prototype.SnapshotCanvas = function (format_, quality_)
	{
		this.runtime.doCanvasSnapshot(format_ === 0 ? "image/png" : "image/jpeg", quality_ / 100);
	};
	SysActs.prototype.SetCanvasSize = function (w, h)
	{
		if (w <= 0 || h <= 0)
			return;
		var mode = this.runtime.fullscreen_mode;
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || !!document["msFullscreenElement"] || document["fullScreen"] || this.runtime.isNodeFullscreen);
		if (isfullscreen && this.runtime.fullscreen_scaling > 0)
			mode = this.runtime.fullscreen_scaling;
		if (mode === 0)
		{
			this.runtime["setSize"](w, h, true);
		}
		else
		{
			this.runtime.original_width = w;
			this.runtime.original_height = h;
			this.runtime["setSize"](this.runtime.lastWindowWidth, this.runtime.lastWindowHeight, true);
		}
	};
	SysActs.prototype.SetLayoutEffectEnabled = function (enable_, effectname_)
	{
		if (!this.runtime.running_layout || !this.runtime.glwrap)
			return;
		var et = this.runtime.running_layout.getEffectByName(effectname_);
		if (!et)
			return;		// effect name not found
		var enable = (enable_ === 1);
		if (et.active == enable)
			return;		// no change
		et.active = enable;
		this.runtime.running_layout.updateActiveEffects();
		this.runtime.redraw = true;
	};
	SysActs.prototype.SetLayerEffectEnabled = function (layer, enable_, effectname_)
	{
		if (!layer || !this.runtime.glwrap)
			return;
		var et = layer.getEffectByName(effectname_);
		if (!et)
			return;		// effect name not found
		var enable = (enable_ === 1);
		if (et.active == enable)
			return;		// no change
		et.active = enable;
		layer.updateActiveEffects();
		this.runtime.redraw = true;
	};
	SysActs.prototype.SetLayoutEffectParam = function (effectname_, index_, value_)
	{
		if (!this.runtime.running_layout || !this.runtime.glwrap)
			return;
		var et = this.runtime.running_layout.getEffectByName(effectname_);
		if (!et)
			return;		// effect name not found
		var params = this.runtime.running_layout.effect_params[et.index];
		index_ = Math.floor(index_);
		if (index_ < 0 || index_ >= params.length)
			return;		// effect index out of bounds
		if (this.runtime.glwrap.getProgramParameterType(et.shaderindex, index_) === 1)
			value_ /= 100.0;
		if (params[index_] === value_)
			return;		// no change
		params[index_] = value_;
		if (et.active)
			this.runtime.redraw = true;
	};
	SysActs.prototype.SetLayerEffectParam = function (layer, effectname_, index_, value_)
	{
		if (!layer || !this.runtime.glwrap)
			return;
		var et = layer.getEffectByName(effectname_);
		if (!et)
			return;		// effect name not found
		var params = layer.effect_params[et.index];
		index_ = Math.floor(index_);
		if (index_ < 0 || index_ >= params.length)
			return;		// effect index out of bounds
		if (this.runtime.glwrap.getProgramParameterType(et.shaderindex, index_) === 1)
			value_ /= 100.0;
		if (params[index_] === value_)
			return;		// no change
		params[index_] = value_;
		if (et.active)
			this.runtime.redraw = true;
	};
	SysActs.prototype.SaveState = function (slot_)
	{
		this.runtime.saveToSlot = slot_;
	};
	SysActs.prototype.LoadState = function (slot_)
	{
		this.runtime.loadFromSlot = slot_;
	};
	SysActs.prototype.LoadStateJSON = function (jsonstr_)
	{
		this.runtime.loadFromJson = jsonstr_;
	};
	SysActs.prototype.SetHalfFramerateMode = function (set_)
	{
		this.runtime.halfFramerateMode = (set_ !== 0);
	};
	SysActs.prototype.SetFullscreenQuality = function (q)
	{
		var isfullscreen = (document["mozFullScreen"] || document["webkitIsFullScreen"] || !!document["msFullscreenElement"] || document["fullScreen"] || this.isNodeFullscreen);
		if (!isfullscreen && this.runtime.fullscreen_mode === 0)
			return;
		this.runtime.wantFullscreenScalingQuality = (q !== 0);
		this.runtime["setSize"](this.runtime.lastWindowWidth, this.runtime.lastWindowHeight, true);
	};
	SysActs.prototype.ResetPersisted = function ()
	{
		var i, len;
		for (i = 0, len = this.runtime.layouts_by_index.length; i < len; ++i)
		{
			this.runtime.layouts_by_index[i].persist_data = {};
			this.runtime.layouts_by_index[i].first_visit = true;
		}
	};
	SysActs.prototype.RecreateInitialObjects = function (obj, x1, y1, x2, y2)
	{
		if (!obj)
			return;
		this.runtime.running_layout.recreateInitialObjects(obj, x1, y1, x2, y2);
	};
	SysActs.prototype.SetPixelRounding = function (m)
	{
		this.runtime.pixel_rounding = (m !== 0);
		this.runtime.redraw = true;
	};
	SysActs.prototype.SetMinimumFramerate = function (f)
	{
		if (f < 1)
			f = 1;
		if (f > 120)
			f = 120;
		this.runtime.minimumFramerate = f;
	};
	function SortZOrderList(a, b)
	{
		var layerA = a[0];
		var layerB = b[0];
		var diff = layerA - layerB;
		if (diff !== 0)
			return diff;
		var indexA = a[1];
		var indexB = b[1];
		return indexA - indexB;
	};
	function SortInstancesByValue(a, b)
	{
		return a[1] - b[1];
	};
	SysActs.prototype.SortZOrderByInstVar = function (obj, iv)
	{
		if (!obj)
			return;
		var i, len, inst, value, r, layer, toZ;
		var sol = obj.getCurrentSol();
		var pickedInstances = sol.getObjects();
		var zOrderList = [];
		var instValues = [];
		var layout = this.runtime.running_layout;
		var isFamily = obj.is_family;
		var familyIndex = obj.family_index;
		for (i = 0, len = pickedInstances.length; i < len; ++i)
		{
			inst = pickedInstances[i];
			if (!inst.layer)
				continue;		// not a world instance
			if (isFamily)
				value = inst.instance_vars[iv + inst.type.family_var_map[familyIndex]];
			else
				value = inst.instance_vars[iv];
			zOrderList.push([
				inst.layer.index,
				inst.get_zindex()
			]);
			instValues.push([
				inst,
				value
			]);
		}
		if (!zOrderList.length)
			return;				// no instances were world instances
		zOrderList.sort(SortZOrderList);
		instValues.sort(SortInstancesByValue);
		for (i = 0, len = zOrderList.length; i < len; ++i)
		{
			inst = instValues[i][0];					// instance in the order we want
			layer = layout.layers[zOrderList[i][0]];	// layer to put it on
			toZ = zOrderList[i][1];						// Z index on that layer to put it
			if (layer.instances[toZ] !== inst)			// not already got this instance there
			{
				layer.instances[toZ] = inst;			// update instance
				inst.layer = layer;						// update instance's layer reference (could have changed)
				layer.setZIndicesStaleFrom(toZ);		// mark Z indices stale from this point since they have changed
			}
		}
	};
	sysProto.acts = new SysActs();
    function SysExps() {};
    SysExps.prototype["int"] = function(ret, x)
    {
        if (cr.is_string(x))
        {
            ret.set_int(parseInt(x, 10));
            if (isNaN(ret.data))
                ret.data = 0;
        }
        else
            ret.set_int(x);
    };
    SysExps.prototype["float"] = function(ret, x)
    {
        if (cr.is_string(x))
        {
            ret.set_float(parseFloat(x));
            if (isNaN(ret.data))
                ret.data = 0;
        }
        else
            ret.set_float(x);
    };
    SysExps.prototype.str = function(ret, x)
    {
        if (cr.is_string(x))
            ret.set_string(x);
        else
            ret.set_string(x.toString());
    };
    SysExps.prototype.len = function(ret, x)
    {
        ret.set_int(x.length || 0);
    };
    SysExps.prototype.random = function (ret, a, b)
    {
        if (b === undefined)
        {
            ret.set_float(Math.random() * a);
        }
        else
        {
            ret.set_float(Math.random() * (b - a) + a);
        }
    };
    SysExps.prototype.sqrt = function(ret, x)
    {
        ret.set_float(Math.sqrt(x));
    };
    SysExps.prototype.abs = function(ret, x)
    {
        ret.set_float(Math.abs(x));
    };
    SysExps.prototype.round = function(ret, x)
    {
        ret.set_int(Math.round(x));
    };
    SysExps.prototype.floor = function(ret, x)
    {
        ret.set_int(Math.floor(x));
    };
    SysExps.prototype.ceil = function(ret, x)
    {
        ret.set_int(Math.ceil(x));
    };
    SysExps.prototype.sin = function(ret, x)
    {
        ret.set_float(Math.sin(cr.to_radians(x)));
    };
    SysExps.prototype.cos = function(ret, x)
    {
        ret.set_float(Math.cos(cr.to_radians(x)));
    };
    SysExps.prototype.tan = function(ret, x)
    {
        ret.set_float(Math.tan(cr.to_radians(x)));
    };
    SysExps.prototype.asin = function(ret, x)
    {
        ret.set_float(cr.to_degrees(Math.asin(x)));
    };
    SysExps.prototype.acos = function(ret, x)
    {
        ret.set_float(cr.to_degrees(Math.acos(x)));
    };
    SysExps.prototype.atan = function(ret, x)
    {
        ret.set_float(cr.to_degrees(Math.atan(x)));
    };
    SysExps.prototype.exp = function(ret, x)
    {
        ret.set_float(Math.exp(x));
    };
    SysExps.prototype.ln = function(ret, x)
    {
        ret.set_float(Math.log(x));
    };
    SysExps.prototype.log10 = function(ret, x)
    {
        ret.set_float(Math.log(x) / Math.LN10);
    };
    SysExps.prototype.max = function(ret)
    {
		var max_ = arguments[1];
		if (typeof max_ !== "number")
			max_ = 0;
		var i, len, a;
		for (i = 2, len = arguments.length; i < len; i++)
		{
			a = arguments[i];
			if (typeof a !== "number")
				continue;		// ignore non-numeric types
			if (max_ < a)
				max_ = a;
		}
		ret.set_float(max_);
    };
    SysExps.prototype.min = function(ret)
    {
        var min_ = arguments[1];
		if (typeof min_ !== "number")
			min_ = 0;
		var i, len, a;
		for (i = 2, len = arguments.length; i < len; i++)
		{
			a = arguments[i];
			if (typeof a !== "number")
				continue;		// ignore non-numeric types
			if (min_ > a)
				min_ = a;
		}
		ret.set_float(min_);
    };
    SysExps.prototype.dt = function(ret)
    {
        ret.set_float(this.runtime.dt);
    };
    SysExps.prototype.timescale = function(ret)
    {
        ret.set_float(this.runtime.timescale);
    };
    SysExps.prototype.wallclocktime = function(ret)
    {
        ret.set_float((Date.now() - this.runtime.start_time) / 1000.0);
    };
    SysExps.prototype.time = function(ret)
    {
        ret.set_float(this.runtime.kahanTime.sum);
    };
    SysExps.prototype.tickcount = function(ret)
    {
        ret.set_int(this.runtime.tickcount);
    };
    SysExps.prototype.objectcount = function(ret)
    {
        ret.set_int(this.runtime.objectcount);
    };
    SysExps.prototype.fps = function(ret)
    {
        ret.set_int(this.runtime.fps);
    };
    SysExps.prototype.loopindex = function(ret, name_)
    {
		var loop, i, len;
        if (!this.runtime.loop_stack.length)
        {
            ret.set_int(0);
            return;
        }
        if (name_)
        {
            for (i = this.runtime.loop_stack_index; i >= 0; --i)
            {
                loop = this.runtime.loop_stack[i];
                if (loop.name === name_)
                {
                    ret.set_int(loop.index);
                    return;
                }
            }
            ret.set_int(0);
        }
        else
        {
			loop = this.runtime.getCurrentLoop();
			ret.set_int(loop ? loop.index : -1);
        }
    };
    SysExps.prototype.distance = function(ret, x1, y1, x2, y2)
    {
        ret.set_float(cr.distanceTo(x1, y1, x2, y2));
    };
    SysExps.prototype.angle = function(ret, x1, y1, x2, y2)
    {
        ret.set_float(cr.to_degrees(cr.angleTo(x1, y1, x2, y2)));
    };
    SysExps.prototype.scrollx = function(ret)
    {
        ret.set_float(this.runtime.running_layout.scrollX);
    };
    SysExps.prototype.scrolly = function(ret)
    {
        ret.set_float(this.runtime.running_layout.scrollY);
    };
    SysExps.prototype.newline = function(ret)
    {
        ret.set_string("\n");
    };
    SysExps.prototype.lerp = function(ret, a, b, x)
    {
        ret.set_float(cr.lerp(a, b, x));
    };
	SysExps.prototype.qarp = function(ret, a, b, c, x)
    {
        ret.set_float(cr.qarp(a, b, c, x));
    };
	SysExps.prototype.cubic = function(ret, a, b, c, d, x)
    {
        ret.set_float(cr.cubic(a, b, c, d, x));
    };
	SysExps.prototype.cosp = function(ret, a, b, x)
    {
        ret.set_float(cr.cosp(a, b, x));
    };
    SysExps.prototype.windowwidth = function(ret)
    {
        ret.set_int(this.runtime.width);
    };
    SysExps.prototype.windowheight = function(ret)
    {
        ret.set_int(this.runtime.height);
    };
	SysExps.prototype.uppercase = function(ret, str)
	{
		ret.set_string(cr.is_string(str) ? str.toUpperCase() : "");
	};
	SysExps.prototype.lowercase = function(ret, str)
	{
		ret.set_string(cr.is_string(str) ? str.toLowerCase() : "");
	};
	SysExps.prototype.clamp = function(ret, x, l, u)
	{
		if (x < l)
			ret.set_float(l);
		else if (x > u)
			ret.set_float(u);
		else
			ret.set_float(x);
	};
	SysExps.prototype.layerscale = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.scale);
	};
	SysExps.prototype.layeropacity = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.opacity * 100);
	};
	SysExps.prototype.layerscalerate = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.zoomRate);
	};
	SysExps.prototype.layerparallaxx = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.parallaxX * 100);
	};
	SysExps.prototype.layerparallaxy = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(layer.parallaxY * 100);
	};
	SysExps.prototype.layerindex = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_int(-1);
		else
			ret.set_int(layer.index);
	};
	SysExps.prototype.layoutscale = function (ret)
	{
		if (this.runtime.running_layout)
			ret.set_float(this.runtime.running_layout.scale);
		else
			ret.set_float(0);
	};
	SysExps.prototype.layoutangle = function (ret)
	{
		ret.set_float(cr.to_degrees(this.runtime.running_layout.angle));
	};
	SysExps.prototype.layerangle = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		if (!layer)
			ret.set_float(0);
		else
			ret.set_float(cr.to_degrees(layer.angle));
	};
	SysExps.prototype.layoutwidth = function (ret)
	{
		ret.set_int(this.runtime.running_layout.width);
	};
	SysExps.prototype.layoutheight = function (ret)
	{
		ret.set_int(this.runtime.running_layout.height);
	};
	SysExps.prototype.find = function (ret, text, searchstr)
	{
		if (cr.is_string(text) && cr.is_string(searchstr))
			ret.set_int(text.search(new RegExp(cr.regexp_escape(searchstr), "i")));
		else
			ret.set_int(-1);
	};
	SysExps.prototype.findcase = function (ret, text, searchstr)
	{
		if (cr.is_string(text) && cr.is_string(searchstr))
			ret.set_int(text.search(new RegExp(cr.regexp_escape(searchstr), "")));
		else
			ret.set_int(-1);
	};
	SysExps.prototype.left = function (ret, text, n)
	{
		ret.set_string(cr.is_string(text) ? text.substr(0, n) : "");
	};
	SysExps.prototype.right = function (ret, text, n)
	{
		ret.set_string(cr.is_string(text) ? text.substr(text.length - n) : "");
	};
	SysExps.prototype.mid = function (ret, text, index_, length_)
	{
		ret.set_string(cr.is_string(text) ? text.substr(index_, length_) : "");
	};
	SysExps.prototype.tokenat = function (ret, text, index_, sep)
	{
		if (cr.is_string(text) && cr.is_string(sep))
		{
			var arr = text.split(sep);
			var i = cr.floor(index_);
			if (i < 0 || i >= arr.length)
				ret.set_string("");
			else
				ret.set_string(arr[i]);
		}
		else
			ret.set_string("");
	};
	SysExps.prototype.tokencount = function (ret, text, sep)
	{
		if (cr.is_string(text) && text.length)
			ret.set_int(text.split(sep).length);
		else
			ret.set_int(0);
	};
	SysExps.prototype.replace = function (ret, text, find_, replace_)
	{
		if (cr.is_string(text) && cr.is_string(find_) && cr.is_string(replace_))
			ret.set_string(text.replace(new RegExp(cr.regexp_escape(find_), "gi"), replace_));
		else
			ret.set_string(cr.is_string(text) ? text : "");
	};
	SysExps.prototype.trim = function (ret, text)
	{
		ret.set_string(cr.is_string(text) ? text.trim() : "");
	};
	SysExps.prototype.pi = function (ret)
	{
		ret.set_float(cr.PI);
	};
	SysExps.prototype.layoutname = function (ret)
	{
		if (this.runtime.running_layout)
			ret.set_string(this.runtime.running_layout.name);
		else
			ret.set_string("");
	};
	SysExps.prototype.renderer = function (ret)
	{
		ret.set_string(this.runtime.gl ? "webgl" : "canvas2d");
	};
	SysExps.prototype.rendererdetail = function (ret)
	{
		ret.set_string(this.runtime.glUnmaskedRenderer);
	};
	SysExps.prototype.anglediff = function (ret, a, b)
	{
		ret.set_float(cr.to_degrees(cr.angleDiff(cr.to_radians(a), cr.to_radians(b))));
	};
	SysExps.prototype.choose = function (ret)
	{
		var index = cr.floor(Math.random() * (arguments.length - 1));
		ret.set_any(arguments[index + 1]);
	};
	SysExps.prototype.rgb = function (ret, r, g, b)
	{
		ret.set_int(cr.RGB(r, g, b));
	};
	SysExps.prototype.projectversion = function (ret)
	{
		ret.set_string(this.runtime.versionstr);
	};
	SysExps.prototype.projectname = function (ret)
	{
		ret.set_string(this.runtime.projectName);
	};
	SysExps.prototype.anglelerp = function (ret, a, b, x)
	{
		a = cr.to_radians(a);
		b = cr.to_radians(b);
		var diff = cr.angleDiff(a, b);
		if (cr.angleClockwise(b, a))
		{
			ret.set_float(cr.to_clamped_degrees(a + diff * x));
		}
		else
		{
			ret.set_float(cr.to_clamped_degrees(a - diff * x));
		}
	};
	SysExps.prototype.anglerotate = function (ret, a, b, c)
	{
		a = cr.to_radians(a);
		b = cr.to_radians(b);
		c = cr.to_radians(c);
		ret.set_float(cr.to_clamped_degrees(cr.angleRotate(a, b, c)));
	};
	SysExps.prototype.zeropad = function (ret, n, d)
	{
		var s = (n < 0 ? "-" : "");
		if (n < 0) n = -n;
		var zeroes = d - n.toString().length;
		for (var i = 0; i < zeroes; i++)
			s += "0";
		ret.set_string(s + n.toString());
	};
	SysExps.prototype.cpuutilisation = function (ret)
	{
		ret.set_float(this.runtime.cpuutilisation / 1000);
	};
	SysExps.prototype.viewportleft = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.viewLeft : 0);
	};
	SysExps.prototype.viewporttop = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.viewTop : 0);
	};
	SysExps.prototype.viewportright = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.viewRight : 0);
	};
	SysExps.prototype.viewportbottom = function (ret, layerparam)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.viewBottom : 0);
	};
	SysExps.prototype.loadingprogress = function (ret)
	{
		ret.set_float(this.runtime.loadingprogress);
	};
	SysExps.prototype.unlerp = function(ret, a, b, y)
    {
        ret.set_float(cr.unlerp(a, b, y));
    };
	SysExps.prototype.canvassnapshot = function (ret)
	{
		ret.set_string(this.runtime.snapshotData);
	};
	SysExps.prototype.urlencode = function (ret, s)
	{
		ret.set_string(encodeURIComponent(s));
	};
	SysExps.prototype.urldecode = function (ret, s)
	{
		ret.set_string(decodeURIComponent(s));
	};
	SysExps.prototype.canvastolayerx = function (ret, layerparam, x, y)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.canvasToLayer(x, y, true) : 0);
	};
	SysExps.prototype.canvastolayery = function (ret, layerparam, x, y)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.canvasToLayer(x, y, false) : 0);
	};
	SysExps.prototype.layertocanvasx = function (ret, layerparam, x, y)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.layerToCanvas(x, y, true) : 0);
	};
	SysExps.prototype.layertocanvasy = function (ret, layerparam, x, y)
	{
		var layer = this.runtime.getLayer(layerparam);
		ret.set_float(layer ? layer.layerToCanvas(x, y, false) : 0);
	};
	SysExps.prototype.savestatejson = function (ret)
	{
		ret.set_string(this.runtime.lastSaveJson);
	};
	SysExps.prototype.imagememoryusage = function (ret)
	{
		if (this.runtime.glwrap)
			ret.set_float(Math.round(100 * this.runtime.glwrap.estimateVRAM() / (1024 * 1024)) / 100);
		else
			ret.set_float(0);
	};
	SysExps.prototype.regexsearch = function (ret, str_, regex_, flags_)
	{
		var regex = getRegex(regex_, flags_);
		ret.set_int(str_ ? str_.search(regex) : -1);
	};
	SysExps.prototype.regexreplace = function (ret, str_, regex_, flags_, replace_)
	{
		var regex = getRegex(regex_, flags_);
		ret.set_string(str_ ? str_.replace(regex, replace_) : "");
	};
	var regexMatches = [];
	var lastMatchesStr = "";
	var lastMatchesRegex = "";
	var lastMatchesFlags = "";
	function updateRegexMatches(str_, regex_, flags_)
	{
		if (str_ === lastMatchesStr && regex_ === lastMatchesRegex && flags_ === lastMatchesFlags)
			return;
		var regex = getRegex(regex_, flags_);
		regexMatches = str_.match(regex);
		lastMatchesStr = str_;
		lastMatchesRegex = regex_;
		lastMatchesFlags = flags_;
	};
	SysExps.prototype.regexmatchcount = function (ret, str_, regex_, flags_)
	{
		var regex = getRegex(regex_, flags_);
		updateRegexMatches(str_, regex_, flags_);
		ret.set_int(regexMatches ? regexMatches.length : 0);
	};
	SysExps.prototype.regexmatchat = function (ret, str_, regex_, flags_, index_)
	{
		index_ = Math.floor(index_);
		var regex = getRegex(regex_, flags_);
		updateRegexMatches(str_, regex_, flags_);
		if (!regexMatches || index_ < 0 || index_ >= regexMatches.length)
			ret.set_string("");
		else
			ret.set_string(regexMatches[index_]);
	};
	SysExps.prototype.infinity = function (ret)
	{
		ret.set_float(Infinity);
	};
	SysExps.prototype.setbit = function (ret, n, b, v)
	{
		n = n | 0;
		b = b | 0;
		v = (v !== 0 ? 1 : 0);
		ret.set_int((n & ~(1 << b)) | (v << b));
	};
	SysExps.prototype.togglebit = function (ret, n, b)
	{
		n = n | 0;
		b = b | 0;
		ret.set_int(n ^ (1 << b));
	};
	SysExps.prototype.getbit = function (ret, n, b)
	{
		n = n | 0;
		b = b | 0;
		ret.set_int((n & (1 << b)) ? 1 : 0);
	};
	SysExps.prototype.originalwindowwidth = function (ret)
	{
		ret.set_int(this.runtime.original_width);
	};
	SysExps.prototype.originalwindowheight = function (ret)
	{
		ret.set_int(this.runtime.original_height);
	};
	sysProto.exps = new SysExps();
	sysProto.runWaits = function ()
	{
		var i, j, len, w, k, s, ss;
		var evinfo = this.runtime.getCurrentEventStack();
		for (i = 0, len = this.waits.length; i < len; i++)
		{
			w = this.waits[i];
			if (w.time === -1)		// signalled wait
			{
				if (!w.signalled)
					continue;		// not yet signalled
			}
			else					// timer wait
			{
				if (w.time > this.runtime.kahanTime.sum)
					continue;		// timer not yet expired
			}
			evinfo.current_event = w.ev;
			evinfo.actindex = w.actindex;
			evinfo.cndindex = 0;
			for (k in w.sols)
			{
				if (w.sols.hasOwnProperty(k))
				{
					s = this.runtime.types_by_index[parseInt(k, 10)].getCurrentSol();
					ss = w.sols[k];
					s.select_all = ss.sa;
					cr.shallowAssignArray(s.instances, ss.insts);
					freeSolStateObject(ss);
				}
			}
			w.ev.resume_actions_and_subevents();
			this.runtime.clearSol(w.solModifiers);
			w.deleteme = true;
		}
		for (i = 0, j = 0, len = this.waits.length; i < len; i++)
		{
			w = this.waits[i];
			this.waits[j] = w;
			if (w.deleteme)
				freeWaitObject(w);
			else
				j++;
		}
		cr.truncateArray(this.waits, j);
	};
}());
;
(function () {
	cr.add_common_aces = function (m, pluginProto)
	{
		var singleglobal_ = m[1];
		var position_aces = m[3];
		var size_aces = m[4];
		var angle_aces = m[5];
		var appearance_aces = m[6];
		var zorder_aces = m[7];
		var effects_aces = m[8];
		if (!pluginProto.cnds)
			pluginProto.cnds = {};
		if (!pluginProto.acts)
			pluginProto.acts = {};
		if (!pluginProto.exps)
			pluginProto.exps = {};
		var cnds = pluginProto.cnds;
		var acts = pluginProto.acts;
		var exps = pluginProto.exps;
		if (position_aces)
		{
			cnds.CompareX = function (cmp, x)
			{
				return cr.do_cmp(this.x, cmp, x);
			};
			cnds.CompareY = function (cmp, y)
			{
				return cr.do_cmp(this.y, cmp, y);
			};
			cnds.IsOnScreen = function ()
			{
				var layer = this.layer;
				this.update_bbox();
				var bbox = this.bbox;
				return !(bbox.right < layer.viewLeft || bbox.bottom < layer.viewTop || bbox.left > layer.viewRight || bbox.top > layer.viewBottom);
			};
			cnds.IsOutsideLayout = function ()
			{
				this.update_bbox();
				var bbox = this.bbox;
				var layout = this.runtime.running_layout;
				return (bbox.right < 0 || bbox.bottom < 0 || bbox.left > layout.width || bbox.top > layout.height);
			};
			cnds.PickDistance = function (which, x, y)
			{
				var sol = this.getCurrentSol();
				var instances = sol.getObjects();
				if (!instances.length)
					return false;
				var inst = instances[0];
				var pickme = inst;
				var dist = cr.distanceTo(inst.x, inst.y, x, y);
				var i, len, d;
				for (i = 1, len = instances.length; i < len; i++)
				{
					inst = instances[i];
					d = cr.distanceTo(inst.x, inst.y, x, y);
					if ((which === 0 && d < dist) || (which === 1 && d > dist))
					{
						dist = d;
						pickme = inst;
					}
				}
				sol.pick_one(pickme);
				return true;
			};
			acts.SetX = function (x)
			{
				if (this.x !== x)
				{
					this.x = x;
					this.set_bbox_changed();
				}
			};
			acts.SetY = function (y)
			{
				if (this.y !== y)
				{
					this.y = y;
					this.set_bbox_changed();
				}
			};
			acts.SetPos = function (x, y)
			{
				if (this.x !== x || this.y !== y)
				{
					this.x = x;
					this.y = y;
					this.set_bbox_changed();
				}
			};
			acts.SetPosToObject = function (obj, imgpt)
			{
				var inst = obj.getPairedInstance(this);
				if (!inst)
					return;
				var newx, newy;
				if (inst.getImagePoint)
				{
					newx = inst.getImagePoint(imgpt, true);
					newy = inst.getImagePoint(imgpt, false);
				}
				else
				{
					newx = inst.x;
					newy = inst.y;
				}
				if (this.x !== newx || this.y !== newy)
				{
					this.x = newx;
					this.y = newy;
					this.set_bbox_changed();
				}
			};
			acts.MoveForward = function (dist)
			{
				if (dist !== 0)
				{
					this.x += Math.cos(this.angle) * dist;
					this.y += Math.sin(this.angle) * dist;
					this.set_bbox_changed();
				}
			};
			acts.MoveAtAngle = function (a, dist)
			{
				if (dist !== 0)
				{
					this.x += Math.cos(cr.to_radians(a)) * dist;
					this.y += Math.sin(cr.to_radians(a)) * dist;
					this.set_bbox_changed();
				}
			};
			exps.X = function (ret)
			{
				ret.set_float(this.x);
			};
			exps.Y = function (ret)
			{
				ret.set_float(this.y);
			};
			exps.dt = function (ret)
			{
				ret.set_float(this.runtime.getDt(this));
			};
		}
		if (size_aces)
		{
			cnds.CompareWidth = function (cmp, w)
			{
				return cr.do_cmp(this.width, cmp, w);
			};
			cnds.CompareHeight = function (cmp, h)
			{
				return cr.do_cmp(this.height, cmp, h);
			};
			acts.SetWidth = function (w)
			{
				if (this.width !== w)
				{
					this.width = w;
					this.set_bbox_changed();
				}
			};
			acts.SetHeight = function (h)
			{
				if (this.height !== h)
				{
					this.height = h;
					this.set_bbox_changed();
				}
			};
			acts.SetSize = function (w, h)
			{
				if (this.width !== w || this.height !== h)
				{
					this.width = w;
					this.height = h;
					this.set_bbox_changed();
				}
			};
			exps.Width = function (ret)
			{
				ret.set_float(this.width);
			};
			exps.Height = function (ret)
			{
				ret.set_float(this.height);
			};
			exps.BBoxLeft = function (ret)
			{
				this.update_bbox();
				ret.set_float(this.bbox.left);
			};
			exps.BBoxTop = function (ret)
			{
				this.update_bbox();
				ret.set_float(this.bbox.top);
			};
			exps.BBoxRight = function (ret)
			{
				this.update_bbox();
				ret.set_float(this.bbox.right);
			};
			exps.BBoxBottom = function (ret)
			{
				this.update_bbox();
				ret.set_float(this.bbox.bottom);
			};
		}
		if (angle_aces)
		{
			cnds.AngleWithin = function (within, a)
			{
				return cr.angleDiff(this.angle, cr.to_radians(a)) <= cr.to_radians(within);
			};
			cnds.IsClockwiseFrom = function (a)
			{
				return cr.angleClockwise(this.angle, cr.to_radians(a));
			};
			cnds.IsBetweenAngles = function (a, b)
			{
				var lower = cr.to_clamped_radians(a);
				var upper = cr.to_clamped_radians(b);
				var angle = cr.clamp_angle(this.angle);
				var obtuse = (!cr.angleClockwise(upper, lower));
				if (obtuse)
					return !(!cr.angleClockwise(angle, lower) && cr.angleClockwise(angle, upper));
				else
					return cr.angleClockwise(angle, lower) && !cr.angleClockwise(angle, upper);
			};
			acts.SetAngle = function (a)
			{
				var newangle = cr.to_radians(cr.clamp_angle_degrees(a));
				if (isNaN(newangle))
					return;
				if (this.angle !== newangle)
				{
					this.angle = newangle;
					this.set_bbox_changed();
				}
			};
			acts.RotateClockwise = function (a)
			{
				if (a !== 0 && !isNaN(a))
				{
					this.angle += cr.to_radians(a);
					this.angle = cr.clamp_angle(this.angle);
					this.set_bbox_changed();
				}
			};
			acts.RotateCounterclockwise = function (a)
			{
				if (a !== 0 && !isNaN(a))
				{
					this.angle -= cr.to_radians(a);
					this.angle = cr.clamp_angle(this.angle);
					this.set_bbox_changed();
				}
			};
			acts.RotateTowardAngle = function (amt, target)
			{
				var newangle = cr.angleRotate(this.angle, cr.to_radians(target), cr.to_radians(amt));
				if (isNaN(newangle))
					return;
				if (this.angle !== newangle)
				{
					this.angle = newangle;
					this.set_bbox_changed();
				}
			};
			acts.RotateTowardPosition = function (amt, x, y)
			{
				var dx = x - this.x;
				var dy = y - this.y;
				var target = Math.atan2(dy, dx);
				var newangle = cr.angleRotate(this.angle, target, cr.to_radians(amt));
				if (isNaN(newangle))
					return;
				if (this.angle !== newangle)
				{
					this.angle = newangle;
					this.set_bbox_changed();
				}
			};
			acts.SetTowardPosition = function (x, y)
			{
				var dx = x - this.x;
				var dy = y - this.y;
				var newangle = Math.atan2(dy, dx);
				if (isNaN(newangle))
					return;
				if (this.angle !== newangle)
				{
					this.angle = newangle;
					this.set_bbox_changed();
				}
			};
			exps.Angle = function (ret)
			{
				ret.set_float(cr.to_clamped_degrees(this.angle));
			};
		}
		if (!singleglobal_)
		{
			cnds.CompareInstanceVar = function (iv, cmp, val)
			{
				return cr.do_cmp(this.instance_vars[iv], cmp, val);
			};
			cnds.IsBoolInstanceVarSet = function (iv)
			{
				return this.instance_vars[iv];
			};
			cnds.PickInstVarHiLow = function (which, iv)
			{
				var sol = this.getCurrentSol();
				var instances = sol.getObjects();
				if (!instances.length)
					return false;
				var inst = instances[0];
				var pickme = inst;
				var val = inst.instance_vars[iv];
				var i, len, v;
				for (i = 1, len = instances.length; i < len; i++)
				{
					inst = instances[i];
					v = inst.instance_vars[iv];
					if ((which === 0 && v < val) || (which === 1 && v > val))
					{
						val = v;
						pickme = inst;
					}
				}
				sol.pick_one(pickme);
				return true;
			};
			cnds.PickByUID = function (u)
			{
				var i, len, j, inst, families, instances, sol;
				var cnd = this.runtime.getCurrentCondition();
				if (cnd.inverted)
				{
					sol = this.getCurrentSol();
					if (sol.select_all)
					{
						sol.select_all = false;
						cr.clearArray(sol.instances);
						cr.clearArray(sol.else_instances);
						instances = this.instances;
						for (i = 0, len = instances.length; i < len; i++)
						{
							inst = instances[i];
							if (inst.uid === u)
								sol.else_instances.push(inst);
							else
								sol.instances.push(inst);
						}
						this.applySolToContainer();
						return !!sol.instances.length;
					}
					else
					{
						for (i = 0, j = 0, len = sol.instances.length; i < len; i++)
						{
							inst = sol.instances[i];
							sol.instances[j] = inst;
							if (inst.uid === u)
							{
								sol.else_instances.push(inst);
							}
							else
								j++;
						}
						cr.truncateArray(sol.instances, j);
						this.applySolToContainer();
						return !!sol.instances.length;
					}
				}
				else
				{
					inst = this.runtime.getObjectByUID(u);
					if (!inst)
						return false;
					sol = this.getCurrentSol();
					if (!sol.select_all && sol.instances.indexOf(inst) === -1)
						return false;		// not picked
					if (this.is_family)
					{
						families = inst.type.families;
						for (i = 0, len = families.length; i < len; i++)
						{
							if (families[i] === this)
							{
								sol.pick_one(inst);
								this.applySolToContainer();
								return true;
							}
						}
					}
					else if (inst.type === this)
					{
						sol.pick_one(inst);
						this.applySolToContainer();
						return true;
					}
					return false;
				}
			};
			cnds.OnCreated = function ()
			{
				return true;
			};
			cnds.OnDestroyed = function ()
			{
				return true;
			};
			acts.SetInstanceVar = function (iv, val)
			{
				var myinstvars = this.instance_vars;
				if (cr.is_number(myinstvars[iv]))
				{
					if (cr.is_number(val))
						myinstvars[iv] = val;
					else
						myinstvars[iv] = parseFloat(val);
				}
				else if (cr.is_string(myinstvars[iv]))
				{
					if (cr.is_string(val))
						myinstvars[iv] = val;
					else
						myinstvars[iv] = val.toString();
				}
				else
;
			};
			acts.AddInstanceVar = function (iv, val)
			{
				var myinstvars = this.instance_vars;
				if (cr.is_number(myinstvars[iv]))
				{
					if (cr.is_number(val))
						myinstvars[iv] += val;
					else
						myinstvars[iv] += parseFloat(val);
				}
				else if (cr.is_string(myinstvars[iv]))
				{
					if (cr.is_string(val))
						myinstvars[iv] += val;
					else
						myinstvars[iv] += val.toString();
				}
				else
;
			};
			acts.SubInstanceVar = function (iv, val)
			{
				var myinstvars = this.instance_vars;
				if (cr.is_number(myinstvars[iv]))
				{
					if (cr.is_number(val))
						myinstvars[iv] -= val;
					else
						myinstvars[iv] -= parseFloat(val);
				}
				else
;
			};
			acts.SetBoolInstanceVar = function (iv, val)
			{
				this.instance_vars[iv] = val ? 1 : 0;
			};
			acts.ToggleBoolInstanceVar = function (iv)
			{
				this.instance_vars[iv] = 1 - this.instance_vars[iv];
			};
			acts.Destroy = function ()
			{
				this.runtime.DestroyInstance(this);
			};
			if (!acts.LoadFromJsonString)
			{
				acts.LoadFromJsonString = function (str_)
				{
					var o, i, len, binst;
					try {
						o = JSON.parse(str_);
					}
					catch (e) {
						return;
					}
					this.runtime.loadInstanceFromJSON(this, o, true);
					if (this.afterLoad)
						this.afterLoad();
					if (this.behavior_insts)
					{
						for (i = 0, len = this.behavior_insts.length; i < len; ++i)
						{
							binst = this.behavior_insts[i];
							if (binst.afterLoad)
								binst.afterLoad();
						}
					}
				};
			}
			exps.Count = function (ret)
			{
				var count = ret.object_class.instances.length;
				var i, len, inst;
				for (i = 0, len = this.runtime.createRow.length; i < len; i++)
				{
					inst = this.runtime.createRow[i];
					if (ret.object_class.is_family)
					{
						if (inst.type.families.indexOf(ret.object_class) >= 0)
							count++;
					}
					else
					{
						if (inst.type === ret.object_class)
							count++;
					}
				}
				ret.set_int(count);
			};
			exps.PickedCount = function (ret)
			{
				ret.set_int(ret.object_class.getCurrentSol().getObjects().length);
			};
			exps.UID = function (ret)
			{
				ret.set_int(this.uid);
			};
			exps.IID = function (ret)
			{
				ret.set_int(this.get_iid());
			};
			if (!exps.AsJSON)
			{
				exps.AsJSON = function (ret)
				{
					ret.set_string(JSON.stringify(this.runtime.saveInstanceToJSON(this, true)));
				};
			}
		}
		if (appearance_aces)
		{
			cnds.IsVisible = function ()
			{
				return this.visible;
			};
			acts.SetVisible = function (v)
			{
				if (!v !== !this.visible)
				{
					this.visible = !!v;
					this.runtime.redraw = true;
				}
			};
			cnds.CompareOpacity = function (cmp, x)
			{
				return cr.do_cmp(cr.round6dp(this.opacity * 100), cmp, x);
			};
			acts.SetOpacity = function (x)
			{
				var new_opacity = x / 100.0;
				if (new_opacity < 0)
					new_opacity = 0;
				else if (new_opacity > 1)
					new_opacity = 1;
				if (new_opacity !== this.opacity)
				{
					this.opacity = new_opacity;
					this.runtime.redraw = true;
				}
			};
			exps.Opacity = function (ret)
			{
				ret.set_float(cr.round6dp(this.opacity * 100.0));
			};
		}
		if (zorder_aces)
		{
			cnds.IsOnLayer = function (layer_)
			{
				if (!layer_)
					return false;
				return this.layer === layer_;
			};
			cnds.PickTopBottom = function (which_)
			{
				var sol = this.getCurrentSol();
				var instances = sol.getObjects();
				if (!instances.length)
					return false;
				var inst = instances[0];
				var pickme = inst;
				var i, len;
				for (i = 1, len = instances.length; i < len; i++)
				{
					inst = instances[i];
					if (which_ === 0)
					{
						if (inst.layer.index > pickme.layer.index || (inst.layer.index === pickme.layer.index && inst.get_zindex() > pickme.get_zindex()))
						{
							pickme = inst;
						}
					}
					else
					{
						if (inst.layer.index < pickme.layer.index || (inst.layer.index === pickme.layer.index && inst.get_zindex() < pickme.get_zindex()))
						{
							pickme = inst;
						}
					}
				}
				sol.pick_one(pickme);
				return true;
			};
			acts.MoveToTop = function ()
			{
				var layer = this.layer;
				var layer_instances = layer.instances;
				if (layer_instances.length && layer_instances[layer_instances.length - 1] === this)
					return;		// is already at top
				layer.removeFromInstanceList(this, false);
				layer.appendToInstanceList(this, false);
				this.runtime.redraw = true;
			};
			acts.MoveToBottom = function ()
			{
				var layer = this.layer;
				var layer_instances = layer.instances;
				if (layer_instances.length && layer_instances[0] === this)
					return;		// is already at bottom
				layer.removeFromInstanceList(this, false);
				layer.prependToInstanceList(this, false);
				this.runtime.redraw = true;
			};
			acts.MoveToLayer = function (layerMove)
			{
				if (!layerMove || layerMove == this.layer)
					return;
				this.layer.removeFromInstanceList(this, true);
				this.layer = layerMove;
				layerMove.appendToInstanceList(this, true);
				this.runtime.redraw = true;
			};
			acts.ZMoveToObject = function (where_, obj_)
			{
				var isafter = (where_ === 0);
				if (!obj_)
					return;
				var other = obj_.getFirstPicked(this);
				if (!other || other.uid === this.uid)
					return;
				if (this.layer.index !== other.layer.index)
				{
					this.layer.removeFromInstanceList(this, true);
					this.layer = other.layer;
					other.layer.appendToInstanceList(this, true);
				}
				this.layer.moveInstanceAdjacent(this, other, isafter);
				this.runtime.redraw = true;
			};
			exps.LayerNumber = function (ret)
			{
				ret.set_int(this.layer.number);
			};
			exps.LayerName = function (ret)
			{
				ret.set_string(this.layer.name);
			};
			exps.ZIndex = function (ret)
			{
				ret.set_int(this.get_zindex());
			};
		}
		if (effects_aces)
		{
			acts.SetEffectEnabled = function (enable_, effectname_)
			{
				if (!this.runtime.glwrap)
					return;
				var i = this.type.getEffectIndexByName(effectname_);
				if (i < 0)
					return;		// effect name not found
				var enable = (enable_ === 1);
				if (this.active_effect_flags[i] === enable)
					return;		// no change
				this.active_effect_flags[i] = enable;
				this.updateActiveEffects();
				this.runtime.redraw = true;
			};
			acts.SetEffectParam = function (effectname_, index_, value_)
			{
				if (!this.runtime.glwrap)
					return;
				var i = this.type.getEffectIndexByName(effectname_);
				if (i < 0)
					return;		// effect name not found
				var et = this.type.effect_types[i];
				var params = this.effect_params[i];
				index_ = Math.floor(index_);
				if (index_ < 0 || index_ >= params.length)
					return;		// effect index out of bounds
				if (this.runtime.glwrap.getProgramParameterType(et.shaderindex, index_) === 1)
					value_ /= 100.0;
				if (params[index_] === value_)
					return;		// no change
				params[index_] = value_;
				if (et.active)
					this.runtime.redraw = true;
			};
		}
	};
	cr.set_bbox_changed = function ()
	{
		this.bbox_changed = true;      		// will recreate next time box requested
		this.cell_changed = true;
		this.type.any_cell_changed = true;	// avoid unnecessary updateAllBBox() calls
		this.runtime.redraw = true;     	// assume runtime needs to redraw
		var i, len, callbacks = this.bbox_changed_callbacks;
		for (i = 0, len = callbacks.length; i < len; ++i)
		{
			callbacks[i](this);
		}
		if (this.layer.useRenderCells)
			this.update_bbox();
	};
	cr.add_bbox_changed_callback = function (f)
	{
		if (f)
		{
			this.bbox_changed_callbacks.push(f);
		}
	};
	cr.update_bbox = function ()
	{
		if (!this.bbox_changed)
			return;                 // bounding box not changed
		var bbox = this.bbox;
		var bquad = this.bquad;
		bbox.set(this.x, this.y, this.x + this.width, this.y + this.height);
		bbox.offset(-this.hotspotX * this.width, -this.hotspotY * this.height);
		if (!this.angle)
		{
			bquad.set_from_rect(bbox);    // make bounding quad from box
		}
		else
		{
			bbox.offset(-this.x, -this.y);       			// translate to origin
			bquad.set_from_rotated_rect(bbox, this.angle);	// rotate around origin
			bquad.offset(this.x, this.y);      				// translate back to original position
			bquad.bounding_box(bbox);
		}
		bbox.normalize();
		this.bbox_changed = false;  // bounding box up to date
		this.update_render_cell();
	};
	var tmprc = new cr.rect(0, 0, 0, 0);
	cr.update_render_cell = function ()
	{
		if (!this.layer.useRenderCells)
			return;
		var mygrid = this.layer.render_grid;
		var bbox = this.bbox;
		tmprc.set(mygrid.XToCell(bbox.left), mygrid.YToCell(bbox.top), mygrid.XToCell(bbox.right), mygrid.YToCell(bbox.bottom));
		if (this.rendercells.equals(tmprc))
			return;
		if (this.rendercells.right < this.rendercells.left)
			mygrid.update(this, null, tmprc);		// first insertion with invalid rect: don't provide old range
		else
			mygrid.update(this, this.rendercells, tmprc);
		this.rendercells.copy(tmprc);
		this.layer.render_list_stale = true;
	};
	cr.update_collision_cell = function ()
	{
		if (!this.cell_changed || !this.collisionsEnabled)
			return;
		this.update_bbox();
		var mygrid = this.type.collision_grid;
		var bbox = this.bbox;
		tmprc.set(mygrid.XToCell(bbox.left), mygrid.YToCell(bbox.top), mygrid.XToCell(bbox.right), mygrid.YToCell(bbox.bottom));
		if (this.collcells.equals(tmprc))
			return;
		if (this.collcells.right < this.collcells.left)
			mygrid.update(this, null, tmprc);		// first insertion with invalid rect: don't provide old range
		else
			mygrid.update(this, this.collcells, tmprc);
		this.collcells.copy(tmprc);
		this.cell_changed = false;
	};
	cr.inst_contains_pt = function (x, y)
	{
		if (!this.bbox.contains_pt(x, y))
			return false;
		if (!this.bquad.contains_pt(x, y))
			return false;
		if (this.collision_poly && !this.collision_poly.is_empty())
		{
			this.collision_poly.cache_poly(this.width, this.height, this.angle);
			return this.collision_poly.contains_pt(x - this.x, y - this.y);
		}
		else
			return true;
	};
	cr.inst_get_iid = function ()
	{
		this.type.updateIIDs();
		return this.iid;
	};
	cr.inst_get_zindex = function ()
	{
		this.layer.updateZIndices();
		return this.zindex;
	};
	cr.inst_updateActiveEffects = function ()
	{
		cr.clearArray(this.active_effect_types);
		var i, len, et;
		var preserves_opaqueness = true;
		for (i = 0, len = this.active_effect_flags.length; i < len; i++)
		{
			if (this.active_effect_flags[i])
			{
				et = this.type.effect_types[i];
				this.active_effect_types.push(et);
				if (!et.preservesOpaqueness)
					preserves_opaqueness = false;
			}
		}
		this.uses_shaders = !!this.active_effect_types.length;
		this.shaders_preserve_opaqueness = preserves_opaqueness;
	};
	cr.inst_toString = function ()
	{
		return "Inst" + this.puid;
	};
	cr.type_getFirstPicked = function (frominst)
	{
		if (frominst && frominst.is_contained && frominst.type != this)
		{
			var i, len, s;
			for (i = 0, len = frominst.siblings.length; i < len; i++)
			{
				s = frominst.siblings[i];
				if (s.type == this)
					return s;
			}
		}
		var instances = this.getCurrentSol().getObjects();
		if (instances.length)
			return instances[0];
		else
			return null;
	};
	cr.type_getPairedInstance = function (inst)
	{
		var instances = this.getCurrentSol().getObjects();
		if (instances.length)
			return instances[inst.get_iid() % instances.length];
		else
			return null;
	};
	cr.type_updateIIDs = function ()
	{
		if (!this.stale_iids || this.is_family)
			return;		// up to date or is family - don't want family to overwrite IIDs
		var i, len;
		for (i = 0, len = this.instances.length; i < len; i++)
			this.instances[i].iid = i;
		var next_iid = i;
		var createRow = this.runtime.createRow;
		for (i = 0, len = createRow.length; i < len; ++i)
		{
			if (createRow[i].type === this)
				createRow[i].iid = next_iid++;
		}
		this.stale_iids = false;
	};
	cr.type_getInstanceByIID = function (i)
	{
		if (i < this.instances.length)
			return this.instances[i];
		i -= this.instances.length;
		var createRow = this.runtime.createRow;
		var j, lenj;
		for (j = 0, lenj = createRow.length; j < lenj; ++j)
		{
			if (createRow[j].type === this)
			{
				if (i === 0)
					return createRow[j];
				--i;
			}
		}
;
		return null;
	};
	cr.type_getCurrentSol = function ()
	{
		return this.solstack[this.cur_sol];
	};
	cr.type_pushCleanSol = function ()
	{
		this.cur_sol++;
		if (this.cur_sol === this.solstack.length)
		{
			this.solstack.push(new cr.selection(this));
		}
		else
		{
			this.solstack[this.cur_sol].select_all = true;  // else clear next SOL
			cr.clearArray(this.solstack[this.cur_sol].else_instances);
		}
	};
	cr.type_pushCopySol = function ()
	{
		this.cur_sol++;
		if (this.cur_sol === this.solstack.length)
			this.solstack.push(new cr.selection(this));
		var clonesol = this.solstack[this.cur_sol];
		var prevsol = this.solstack[this.cur_sol - 1];
		if (prevsol.select_all)
		{
			clonesol.select_all = true;
			cr.clearArray(clonesol.else_instances);
		}
		else
		{
			clonesol.select_all = false;
			cr.shallowAssignArray(clonesol.instances, prevsol.instances);
			cr.shallowAssignArray(clonesol.else_instances, prevsol.else_instances);
		}
	};
	cr.type_popSol = function ()
	{
;
		this.cur_sol--;
	};
	cr.type_getBehaviorByName = function (behname)
	{
		var i, len, j, lenj, f, index = 0;
		if (!this.is_family)
		{
			for (i = 0, len = this.families.length; i < len; i++)
			{
				f = this.families[i];
				for (j = 0, lenj = f.behaviors.length; j < lenj; j++)
				{
					if (behname === f.behaviors[j].name)
					{
						this.extra["lastBehIndex"] = index;
						return f.behaviors[j];
					}
					index++;
				}
			}
		}
		for (i = 0, len = this.behaviors.length; i < len; i++) {
			if (behname === this.behaviors[i].name)
			{
				this.extra["lastBehIndex"] = index;
				return this.behaviors[i];
			}
			index++;
		}
		return null;
	};
	cr.type_getBehaviorIndexByName = function (behname)
	{
		var b = this.getBehaviorByName(behname);
		if (b)
			return this.extra["lastBehIndex"];
		else
			return -1;
	};
	cr.type_getEffectIndexByName = function (name_)
	{
		var i, len;
		for (i = 0, len = this.effect_types.length; i < len; i++)
		{
			if (this.effect_types[i].name === name_)
				return i;
		}
		return -1;
	};
	cr.type_applySolToContainer = function ()
	{
		if (!this.is_contained || this.is_family)
			return;
		var i, len, j, lenj, t, sol, sol2;
		this.updateIIDs();
		sol = this.getCurrentSol();
		var select_all = sol.select_all;
		var es = this.runtime.getCurrentEventStack();
		var orblock = es && es.current_event && es.current_event.orblock;
		for (i = 0, len = this.container.length; i < len; i++)
		{
			t = this.container[i];
			if (t === this)
				continue;
			t.updateIIDs();
			sol2 = t.getCurrentSol();
			sol2.select_all = select_all;
			if (!select_all)
			{
				cr.clearArray(sol2.instances);
				for (j = 0, lenj = sol.instances.length; j < lenj; ++j)
					sol2.instances[j] = t.getInstanceByIID(sol.instances[j].iid);
				if (orblock)
				{
					cr.clearArray(sol2.else_instances);
					for (j = 0, lenj = sol.else_instances.length; j < lenj; ++j)
						sol2.else_instances[j] = t.getInstanceByIID(sol.else_instances[j].iid);
				}
			}
		}
	};
	cr.type_toString = function ()
	{
		return "Type" + this.sid;
	};
	cr.do_cmp = function (x, cmp, y)
	{
		if (typeof x === "undefined" || typeof y === "undefined")
			return false;
		switch (cmp)
		{
			case 0:     // equal
				return x === y;
			case 1:     // not equal
				return x !== y;
			case 2:     // less
				return x < y;
			case 3:     // less/equal
				return x <= y;
			case 4:     // greater
				return x > y;
			case 5:     // greater/equal
				return x >= y;
			default:
;
				return false;
		}
	};
})();
cr.shaders = {};
cr.shaders["prralphathreshold"] = {src: ["varying mediump vec2 vTex;",
"uniform lowp sampler2D samplerFront;",
"uniform mediump float threshold;",
"uniform mediump float smoothness;",
"uniform mediump float unpremultiply;",
"void main(void)",
"{",
"lowp vec4 color = texture2D( samplerFront, vTex ) ;",
"if( unpremultiply > 0.0 ){ color.rgb /= color.a ; }",
"mediump float range = ( color.a - (1.0 - threshold) - (smoothness * 0.05) ) / (0.0001 + smoothness * 0.1) ;",
"color.a = smoothstep( 0.0, 1.0, range ) ;",
"color.rgb *= color.a ;",
"gl_FragColor = color ;",
"}"
].join("\n"),
	extendBoxHorizontal: 0,
	extendBoxVertical: 0,
	crossSampling: false,
	preservesOpaqueness: false,
	animated: false,
	parameters: [["threshold", 0, 1], ["smoothness", 0, 1], ["unpremultiply", 0, 0]] }
cr.shaders["tint"] = {src: ["varying mediump vec2 vTex;",
"uniform lowp sampler2D samplerFront;",
"uniform lowp float red;",
"uniform lowp float green;",
"uniform lowp float blue;",
"void main(void)",
"{",
"lowp vec4 front = texture2D(samplerFront, vTex);",
"gl_FragColor = front * vec4(red, green, blue, 1.0);",
"}"
].join("\n"),
	extendBoxHorizontal: 0,
	extendBoxVertical: 0,
	crossSampling: false,
	preservesOpaqueness: true,
	animated: false,
	parameters: [["red", 0, 1], ["green", 0, 1], ["blue", 0, 1]] }
;
;
cr.plugins_.Keyboard = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Keyboard.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		this.keyMap = new Array(256);	// stores key up/down state
		this.usedKeys = new Array(256);
		this.triggerKey = 0;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		var self = this;
		if (!this.runtime.isDomFree)
		{
			jQuery(document).keydown(
				function(info) {
					self.onKeyDown(info);
				}
			);
			jQuery(document).keyup(
				function(info) {
					self.onKeyUp(info);
				}
			);
		}
	};
	var keysToBlockWhenFramed = [32, 33, 34, 35, 36, 37, 38, 39, 40, 44];
	instanceProto.onKeyDown = function (info)
	{
		var alreadyPreventedDefault = false;
		if (window != window.top && keysToBlockWhenFramed.indexOf(info.which) > -1)
		{
			info.preventDefault();
			alreadyPreventedDefault = true;
			info.stopPropagation();
		}
		if (this.keyMap[info.which])
		{
			if (this.usedKeys[info.which] && !alreadyPreventedDefault)
				info.preventDefault();
			return;
		}
		this.keyMap[info.which] = true;
		this.triggerKey = info.which;
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnAnyKey, this);
		var eventRan = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKey, this);
		var eventRan2 = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyCode, this);
		this.runtime.isInUserInputEvent = false;
		if (eventRan || eventRan2)
		{
			this.usedKeys[info.which] = true;
			if (!alreadyPreventedDefault)
				info.preventDefault();
		}
	};
	instanceProto.onKeyUp = function (info)
	{
		this.keyMap[info.which] = false;
		this.triggerKey = info.which;
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnAnyKeyReleased, this);
		var eventRan = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyReleased, this);
		var eventRan2 = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyCodeReleased, this);
		this.runtime.isInUserInputEvent = false;
		if (eventRan || eventRan2 || this.usedKeys[info.which])
		{
			this.usedKeys[info.which] = true;
			info.preventDefault();
		}
	};
	instanceProto.onWindowBlur = function ()
	{
		var i;
		for (i = 0; i < 256; ++i)
		{
			if (!this.keyMap[i])
				continue;		// key already up
			this.keyMap[i] = false;
			this.triggerKey = i;
			this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnAnyKeyReleased, this);
			var eventRan = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyReleased, this);
			var eventRan2 = this.runtime.trigger(cr.plugins_.Keyboard.prototype.cnds.OnKeyCodeReleased, this);
			if (eventRan || eventRan2)
				this.usedKeys[i] = true;
		}
	};
	instanceProto.saveToJSON = function ()
	{
		return { "triggerKey": this.triggerKey };
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.triggerKey = o["triggerKey"];
	};
	function Cnds() {};
	Cnds.prototype.IsKeyDown = function(key)
	{
		return this.keyMap[key];
	};
	Cnds.prototype.OnKey = function(key)
	{
		return (key === this.triggerKey);
	};
	Cnds.prototype.OnAnyKey = function(key)
	{
		return true;
	};
	Cnds.prototype.OnAnyKeyReleased = function(key)
	{
		return true;
	};
	Cnds.prototype.OnKeyReleased = function(key)
	{
		return (key === this.triggerKey);
	};
	Cnds.prototype.IsKeyCodeDown = function(key)
	{
		key = Math.floor(key);
		if (key < 0 || key >= this.keyMap.length)
			return false;
		return this.keyMap[key];
	};
	Cnds.prototype.OnKeyCode = function(key)
	{
		return (key === this.triggerKey);
	};
	Cnds.prototype.OnKeyCodeReleased = function(key)
	{
		return (key === this.triggerKey);
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.LastKeyCode = function (ret)
	{
		ret.set_int(this.triggerKey);
	};
	function fixedStringFromCharCode(kc)
	{
		kc = Math.floor(kc);
		switch (kc) {
		case 8:		return "backspace";
		case 9:		return "tab";
		case 13:	return "enter";
		case 16:	return "shift";
		case 17:	return "control";
		case 18:	return "alt";
		case 19:	return "pause";
		case 20:	return "capslock";
		case 27:	return "esc";
		case 33:	return "pageup";
		case 34:	return "pagedown";
		case 35:	return "end";
		case 36:	return "home";
		case 37:	return "←";
		case 38:	return "↑";
		case 39:	return "→";
		case 40:	return "↓";
		case 45:	return "insert";
		case 46:	return "del";
		case 91:	return "left window key";
		case 92:	return "right window key";
		case 93:	return "select";
		case 96:	return "numpad 0";
		case 97:	return "numpad 1";
		case 98:	return "numpad 2";
		case 99:	return "numpad 3";
		case 100:	return "numpad 4";
		case 101:	return "numpad 5";
		case 102:	return "numpad 6";
		case 103:	return "numpad 7";
		case 104:	return "numpad 8";
		case 105:	return "numpad 9";
		case 106:	return "numpad *";
		case 107:	return "numpad +";
		case 109:	return "numpad -";
		case 110:	return "numpad .";
		case 111:	return "numpad /";
		case 112:	return "F1";
		case 113:	return "F2";
		case 114:	return "F3";
		case 115:	return "F4";
		case 116:	return "F5";
		case 117:	return "F6";
		case 118:	return "F7";
		case 119:	return "F8";
		case 120:	return "F9";
		case 121:	return "F10";
		case 122:	return "F11";
		case 123:	return "F12";
		case 144:	return "numlock";
		case 145:	return "scroll lock";
		case 186:	return ";";
		case 187:	return "=";
		case 188:	return ",";
		case 189:	return "-";
		case 190:	return ".";
		case 191:	return "/";
		case 192:	return "'";
		case 219:	return "[";
		case 220:	return "\\";
		case 221:	return "]";
		case 222:	return "#";
		case 223:	return "`";
		default:	return String.fromCharCode(kc);
		}
	};
	Exps.prototype.StringFromKeyCode = function (ret, kc)
	{
		ret.set_string(fixedStringFromCharCode(kc));
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Mouse = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Mouse.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		this.buttonMap = new Array(4);		// mouse down states
		this.mouseXcanvas = 0;				// mouse position relative to canvas
		this.mouseYcanvas = 0;
		this.triggerButton = 0;
		this.triggerType = 0;
		this.triggerDir = 0;
		this.handled = false;
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		var self = this;
		if (!this.runtime.isDomFree)
		{
			jQuery(document).mousemove(
				function(info) {
					self.onMouseMove(info);
				}
			);
			jQuery(document).mousedown(
				function(info) {
					self.onMouseDown(info);
				}
			);
			jQuery(document).mouseup(
				function(info) {
					self.onMouseUp(info);
				}
			);
			jQuery(document).dblclick(
				function(info) {
					self.onDoubleClick(info);
				}
			);
			var wheelevent = function(info) {
								self.onWheel(info);
							};
			document.addEventListener("mousewheel", wheelevent, false);
			document.addEventListener("DOMMouseScroll", wheelevent, false);
		}
	};
	var dummyoffset = {left: 0, top: 0};
	instanceProto.onMouseMove = function(info)
	{
		var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
		this.mouseXcanvas = info.pageX - offset.left;
		this.mouseYcanvas = info.pageY - offset.top;
	};
	instanceProto.mouseInGame = function ()
	{
		if (this.runtime.fullscreen_mode > 0)
			return true;
		return this.mouseXcanvas >= 0 && this.mouseYcanvas >= 0
		    && this.mouseXcanvas < this.runtime.width && this.mouseYcanvas < this.runtime.height;
	};
	instanceProto.onMouseDown = function(info)
	{
		if (!this.mouseInGame())
			return;
		this.buttonMap[info.which] = true;
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnAnyClick, this);
		this.triggerButton = info.which - 1;	// 1-based
		this.triggerType = 0;					// single click
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnClick, this);
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnObjectClicked, this);
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.onMouseUp = function(info)
	{
		if (!this.buttonMap[info.which])
			return;
		if (this.runtime.had_a_click && !this.runtime.isMobile)
			info.preventDefault();
		this.runtime.had_a_click = true;
		this.buttonMap[info.which] = false;
		this.runtime.isInUserInputEvent = true;
		this.triggerButton = info.which - 1;	// 1-based
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnRelease, this);
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.onDoubleClick = function(info)
	{
		if (!this.mouseInGame())
			return;
		info.preventDefault();
		this.runtime.isInUserInputEvent = true;
		this.triggerButton = info.which - 1;	// 1-based
		this.triggerType = 1;					// double click
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnClick, this);
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnObjectClicked, this);
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.onWheel = function (info)
	{
		var delta = info.wheelDelta ? info.wheelDelta : info.detail ? -info.detail : 0;
		this.triggerDir = (delta < 0 ? 0 : 1);
		this.handled = false;
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnWheel, this);
		this.runtime.isInUserInputEvent = false;
		if (this.handled && cr.isCanvasInputEvent(info))
			info.preventDefault();
	};
	instanceProto.onWindowBlur = function ()
	{
		var i, len;
		for (i = 0, len = this.buttonMap.length; i < len; ++i)
		{
			if (!this.buttonMap[i])
				continue;
			this.buttonMap[i] = false;
			this.triggerButton = i - 1;
			this.runtime.trigger(cr.plugins_.Mouse.prototype.cnds.OnRelease, this);
		}
	};
	function Cnds() {};
	Cnds.prototype.OnClick = function (button, type)
	{
		return button === this.triggerButton && type === this.triggerType;
	};
	Cnds.prototype.OnAnyClick = function ()
	{
		return true;
	};
	Cnds.prototype.IsButtonDown = function (button)
	{
		return this.buttonMap[button + 1];	// jQuery uses 1-based buttons for some reason
	};
	Cnds.prototype.OnRelease = function (button)
	{
		return button === this.triggerButton;
	};
	Cnds.prototype.IsOverObject = function (obj)
	{
		var cnd = this.runtime.getCurrentCondition();
		var mx = this.mouseXcanvas;
		var my = this.mouseYcanvas;
		return cr.xor(this.runtime.testAndSelectCanvasPointOverlap(obj, mx, my, cnd.inverted), cnd.inverted);
	};
	Cnds.prototype.OnObjectClicked = function (button, type, obj)
	{
		if (button !== this.triggerButton || type !== this.triggerType)
			return false;	// wrong click type
		return this.runtime.testAndSelectCanvasPointOverlap(obj, this.mouseXcanvas, this.mouseYcanvas, false);
	};
	Cnds.prototype.OnWheel = function (dir)
	{
		this.handled = true;
		return dir === this.triggerDir;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	var lastSetCursor = null;
	Acts.prototype.SetCursor = function (c)
	{
		if (this.runtime.isDomFree)
			return;
		var cursor_style = ["auto", "pointer", "text", "crosshair", "move", "help", "wait", "none"][c];
		if (lastSetCursor === cursor_style)
			return;		// redundant
		lastSetCursor = cursor_style;
		document.body.style.cursor = cursor_style;
	};
	Acts.prototype.SetCursorSprite = function (obj)
	{
		if (this.runtime.isDomFree || this.runtime.isMobile || !obj)
			return;
		var inst = obj.getFirstPicked();
		if (!inst || !inst.curFrame)
			return;
		var frame = inst.curFrame;
		if (lastSetCursor === frame)
			return;		// already set this frame
		lastSetCursor = frame;
		var datauri = frame.getDataUri();
		var cursor_style = "url(" + datauri + ") " + Math.round(frame.hotspotX * frame.width) + " " + Math.round(frame.hotspotY * frame.height) + ", auto";
		document.body.style.cursor = "";
		document.body.style.cursor = cursor_style;
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.X = function (ret, layerparam)
	{
		var layer, oldScale, oldZoomRate, oldParallaxX, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxX = layer.parallaxX;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxX = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(this.mouseXcanvas, this.mouseYcanvas, true));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxX = oldParallaxX;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(this.mouseXcanvas, this.mouseYcanvas, true));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.Y = function (ret, layerparam)
	{
		var layer, oldScale, oldZoomRate, oldParallaxY, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxY = layer.parallaxY;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxY = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(this.mouseXcanvas, this.mouseYcanvas, false));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxY = oldParallaxY;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(this.mouseXcanvas, this.mouseYcanvas, false));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.AbsoluteX = function (ret)
	{
		ret.set_float(this.mouseXcanvas);
	};
	Exps.prototype.AbsoluteY = function (ret)
	{
		ret.set_float(this.mouseYcanvas);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Sprite = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Sprite.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	function frame_getDataUri()
	{
		if (this.datauri.length === 0)
		{
			var tmpcanvas = document.createElement("canvas");
			tmpcanvas.width = this.width;
			tmpcanvas.height = this.height;
			var tmpctx = tmpcanvas.getContext("2d");
			if (this.spritesheeted)
			{
				tmpctx.drawImage(this.texture_img, this.offx, this.offy, this.width, this.height,
										 0, 0, this.width, this.height);
			}
			else
			{
				tmpctx.drawImage(this.texture_img, 0, 0, this.width, this.height);
			}
			this.datauri = tmpcanvas.toDataURL("image/png");
		}
		return this.datauri;
	};
	typeProto.onCreate = function()
	{
		if (this.is_family)
			return;
		var i, leni, j, lenj;
		var anim, frame, animobj, frameobj, wt, uv;
		this.all_frames = [];
		this.has_loaded_textures = false;
		for (i = 0, leni = this.animations.length; i < leni; i++)
		{
			anim = this.animations[i];
			animobj = {};
			animobj.name = anim[0];
			animobj.speed = anim[1];
			animobj.loop = anim[2];
			animobj.repeatcount = anim[3];
			animobj.repeatto = anim[4];
			animobj.pingpong = anim[5];
			animobj.sid = anim[6];
			animobj.frames = [];
			for (j = 0, lenj = anim[7].length; j < lenj; j++)
			{
				frame = anim[7][j];
				frameobj = {};
				frameobj.texture_file = frame[0];
				frameobj.texture_filesize = frame[1];
				frameobj.offx = frame[2];
				frameobj.offy = frame[3];
				frameobj.width = frame[4];
				frameobj.height = frame[5];
				frameobj.duration = frame[6];
				frameobj.hotspotX = frame[7];
				frameobj.hotspotY = frame[8];
				frameobj.image_points = frame[9];
				frameobj.poly_pts = frame[10];
				frameobj.pixelformat = frame[11];
				frameobj.spritesheeted = (frameobj.width !== 0);
				frameobj.datauri = "";		// generated on demand and cached
				frameobj.getDataUri = frame_getDataUri;
				uv = {};
				uv.left = 0;
				uv.top = 0;
				uv.right = 1;
				uv.bottom = 1;
				frameobj.sheetTex = uv;
				frameobj.webGL_texture = null;
				wt = this.runtime.findWaitingTexture(frame[0]);
				if (wt)
				{
					frameobj.texture_img = wt;
				}
				else
				{
					frameobj.texture_img = new Image();
					frameobj.texture_img.cr_src = frame[0];
					frameobj.texture_img.cr_filesize = frame[1];
					frameobj.texture_img.c2webGL_texture = null;
					this.runtime.waitForImageLoad(frameobj.texture_img, frame[0]);
				}
				cr.seal(frameobj);
				animobj.frames.push(frameobj);
				this.all_frames.push(frameobj);
			}
			cr.seal(animobj);
			this.animations[i] = animobj;		// swap array data for object
		}
	};
	typeProto.updateAllCurrentTexture = function ()
	{
		var i, len, inst;
		for (i = 0, len = this.instances.length; i < len; i++)
		{
			inst = this.instances[i];
			inst.curWebGLTexture = inst.curFrame.webGL_texture;
		}
	};
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
		var i, len, frame;
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			frame.texture_img.c2webGL_texture = null;
			frame.webGL_texture = null;
		}
		this.has_loaded_textures = false;
		this.updateAllCurrentTexture();
	};
	typeProto.onRestoreWebGLContext = function ()
	{
		if (this.is_family || !this.instances.length)
			return;
		var i, len, frame;
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			frame.webGL_texture = this.runtime.glwrap.loadTexture(frame.texture_img, false, this.runtime.linearSampling, frame.pixelformat);
		}
		this.updateAllCurrentTexture();
	};
	typeProto.loadTextures = function ()
	{
		if (this.is_family || this.has_loaded_textures || !this.runtime.glwrap)
			return;
		var i, len, frame;
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			frame.webGL_texture = this.runtime.glwrap.loadTexture(frame.texture_img, false, this.runtime.linearSampling, frame.pixelformat);
		}
		this.has_loaded_textures = true;
	};
	typeProto.unloadTextures = function ()
	{
		if (this.is_family || this.instances.length || !this.has_loaded_textures)
			return;
		var i, len, frame;
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frame = this.all_frames[i];
			this.runtime.glwrap.deleteTexture(frame.webGL_texture);
			frame.webGL_texture = null;
		}
		this.has_loaded_textures = false;
	};
	var already_drawn_images = [];
	typeProto.preloadCanvas2D = function (ctx)
	{
		var i, len, frameimg;
		cr.clearArray(already_drawn_images);
		for (i = 0, len = this.all_frames.length; i < len; ++i)
		{
			frameimg = this.all_frames[i].texture_img;
			if (already_drawn_images.indexOf(frameimg) !== -1)
					continue;
			ctx.drawImage(frameimg, 0, 0);
			already_drawn_images.push(frameimg);
		}
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		var poly_pts = this.type.animations[0].frames[0].poly_pts;
		if (this.recycled)
			this.collision_poly.set_pts(poly_pts);
		else
			this.collision_poly = new cr.CollisionPoly(poly_pts);
	};
	var instanceProto = pluginProto.Instance.prototype;
	instanceProto.onCreate = function()
	{
		this.visible = (this.properties[0] === 0);	// 0=visible, 1=invisible
		this.isTicking = false;
		this.inAnimTrigger = false;
		this.collisionsEnabled = (this.properties[3] !== 0);
		this.cur_animation = this.getAnimationByName(this.properties[1]) || this.type.animations[0];
		this.cur_frame = this.properties[2];
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
		var curanimframe = this.cur_animation.frames[this.cur_frame];
		this.collision_poly.set_pts(curanimframe.poly_pts);
		this.hotspotX = curanimframe.hotspotX;
		this.hotspotY = curanimframe.hotspotY;
		this.cur_anim_speed = this.cur_animation.speed;
		this.cur_anim_repeatto = this.cur_animation.repeatto;
		if (!(this.type.animations.length === 1 && this.type.animations[0].frames.length === 1) && this.cur_anim_speed !== 0)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		if (this.recycled)
			this.animTimer.reset();
		else
			this.animTimer = new cr.KahanAdder();
		this.frameStart = this.getNowTime();
		this.animPlaying = true;
		this.animRepeats = 0;
		this.animForwards = true;
		this.animTriggerName = "";
		this.changeAnimName = "";
		this.changeAnimFrom = 0;
		this.changeAnimFrame = -1;
		this.type.loadTextures();
		var i, leni, j, lenj;
		var anim, frame, uv, maintex;
		for (i = 0, leni = this.type.animations.length; i < leni; i++)
		{
			anim = this.type.animations[i];
			for (j = 0, lenj = anim.frames.length; j < lenj; j++)
			{
				frame = anim.frames[j];
				if (frame.width === 0)
				{
					frame.width = frame.texture_img.width;
					frame.height = frame.texture_img.height;
				}
				if (frame.spritesheeted)
				{
					maintex = frame.texture_img;
					uv = frame.sheetTex;
					uv.left = frame.offx / maintex.width;
					uv.top = frame.offy / maintex.height;
					uv.right = (frame.offx + frame.width) / maintex.width;
					uv.bottom = (frame.offy + frame.height) / maintex.height;
					if (frame.offx === 0 && frame.offy === 0 && frame.width === maintex.width && frame.height === maintex.height)
					{
						frame.spritesheeted = false;
					}
				}
			}
		}
		this.curFrame = this.cur_animation.frames[this.cur_frame];
		this.curWebGLTexture = this.curFrame.webGL_texture;
	};
	instanceProto.saveToJSON = function ()
	{
		var o = {
			"a": this.cur_animation.sid,
			"f": this.cur_frame,
			"cas": this.cur_anim_speed,
			"fs": this.frameStart,
			"ar": this.animRepeats,
			"at": this.animTimer.sum,
			"rt": this.cur_anim_repeatto
		};
		if (!this.animPlaying)
			o["ap"] = this.animPlaying;
		if (!this.animForwards)
			o["af"] = this.animForwards;
		return o;
	};
	instanceProto.loadFromJSON = function (o)
	{
		var anim = this.getAnimationBySid(o["a"]);
		if (anim)
			this.cur_animation = anim;
		this.cur_frame = o["f"];
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
		this.cur_anim_speed = o["cas"];
		this.frameStart = o["fs"];
		this.animRepeats = o["ar"];
		this.animTimer.reset();
		this.animTimer.sum = o["at"];
		this.animPlaying = o.hasOwnProperty("ap") ? o["ap"] : true;
		this.animForwards = o.hasOwnProperty("af") ? o["af"] : true;
		if (o.hasOwnProperty("rt"))
			this.cur_anim_repeatto = o["rt"];
		else
			this.cur_anim_repeatto = this.cur_animation.repeatto;
		this.curFrame = this.cur_animation.frames[this.cur_frame];
		this.curWebGLTexture = this.curFrame.webGL_texture;
		this.collision_poly.set_pts(this.curFrame.poly_pts);
		this.hotspotX = this.curFrame.hotspotX;
		this.hotspotY = this.curFrame.hotspotY;
	};
	instanceProto.animationFinish = function (reverse)
	{
		this.cur_frame = reverse ? 0 : this.cur_animation.frames.length - 1;
		this.animPlaying = false;
		this.animTriggerName = this.cur_animation.name;
		this.inAnimTrigger = true;
		this.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnAnyAnimFinished, this);
		this.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnAnimFinished, this);
		this.inAnimTrigger = false;
		this.animRepeats = 0;
	};
	instanceProto.getNowTime = function()
	{
		return this.animTimer.sum;
	};
	instanceProto.tick = function()
	{
		this.animTimer.add(this.runtime.getDt(this));
		if (this.changeAnimName.length)
			this.doChangeAnim();
		if (this.changeAnimFrame >= 0)
			this.doChangeAnimFrame();
		var now = this.getNowTime();
		var cur_animation = this.cur_animation;
		var prev_frame = cur_animation.frames[this.cur_frame];
		var next_frame;
		var cur_frame_time = prev_frame.duration / this.cur_anim_speed;
		if (this.animPlaying && now >= this.frameStart + cur_frame_time)
		{
			if (this.animForwards)
			{
				this.cur_frame++;
			}
			else
			{
				this.cur_frame--;
			}
			this.frameStart += cur_frame_time;
			if (this.cur_frame >= cur_animation.frames.length)
			{
				if (cur_animation.pingpong)
				{
					this.animForwards = false;
					this.cur_frame = cur_animation.frames.length - 2;
				}
				else if (cur_animation.loop)
				{
					this.cur_frame = this.cur_anim_repeatto;
				}
				else
				{
					this.animRepeats++;
					if (this.animRepeats >= cur_animation.repeatcount)
					{
						this.animationFinish(false);
					}
					else
					{
						this.cur_frame = this.cur_anim_repeatto;
					}
				}
			}
			if (this.cur_frame < 0)
			{
				if (cur_animation.pingpong)
				{
					this.cur_frame = 1;
					this.animForwards = true;
					if (!cur_animation.loop)
					{
						this.animRepeats++;
						if (this.animRepeats >= cur_animation.repeatcount)
						{
							this.animationFinish(true);
						}
					}
				}
				else
				{
					if (cur_animation.loop)
					{
						this.cur_frame = this.cur_anim_repeatto;
					}
					else
					{
						this.animRepeats++;
						if (this.animRepeats >= cur_animation.repeatcount)
						{
							this.animationFinish(true);
						}
						else
						{
							this.cur_frame = this.cur_anim_repeatto;
						}
					}
				}
			}
			if (this.cur_frame < 0)
				this.cur_frame = 0;
			else if (this.cur_frame >= cur_animation.frames.length)
				this.cur_frame = cur_animation.frames.length - 1;
			if (now > this.frameStart + (cur_animation.frames[this.cur_frame].duration / this.cur_anim_speed))
			{
				this.frameStart = now;
			}
			next_frame = cur_animation.frames[this.cur_frame];
			this.OnFrameChanged(prev_frame, next_frame);
			this.runtime.redraw = true;
		}
	};
	instanceProto.getAnimationByName = function (name_)
	{
		var i, len, a;
		for (i = 0, len = this.type.animations.length; i < len; i++)
		{
			a = this.type.animations[i];
			if (cr.equals_nocase(a.name, name_))
				return a;
		}
		return null;
	};
	instanceProto.getAnimationBySid = function (sid_)
	{
		var i, len, a;
		for (i = 0, len = this.type.animations.length; i < len; i++)
		{
			a = this.type.animations[i];
			if (a.sid === sid_)
				return a;
		}
		return null;
	};
	instanceProto.doChangeAnim = function ()
	{
		var prev_frame = this.cur_animation.frames[this.cur_frame];
		var anim = this.getAnimationByName(this.changeAnimName);
		this.changeAnimName = "";
		if (!anim)
			return;
		if (cr.equals_nocase(anim.name, this.cur_animation.name) && this.animPlaying)
			return;
		this.cur_animation = anim;
		this.cur_anim_speed = anim.speed;
		this.cur_anim_repeatto = anim.repeatto;
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
		if (this.changeAnimFrom === 1)
			this.cur_frame = 0;
		this.animPlaying = true;
		this.frameStart = this.getNowTime();
		this.animForwards = true;
		this.OnFrameChanged(prev_frame, this.cur_animation.frames[this.cur_frame]);
		this.runtime.redraw = true;
	};
	instanceProto.doChangeAnimFrame = function ()
	{
		var prev_frame = this.cur_animation.frames[this.cur_frame];
		var prev_frame_number = this.cur_frame;
		this.cur_frame = cr.floor(this.changeAnimFrame);
		if (this.cur_frame < 0)
			this.cur_frame = 0;
		if (this.cur_frame >= this.cur_animation.frames.length)
			this.cur_frame = this.cur_animation.frames.length - 1;
		if (prev_frame_number !== this.cur_frame)
		{
			this.OnFrameChanged(prev_frame, this.cur_animation.frames[this.cur_frame]);
			this.frameStart = this.getNowTime();
			this.runtime.redraw = true;
		}
		this.changeAnimFrame = -1;
	};
	instanceProto.OnFrameChanged = function (prev_frame, next_frame)
	{
		var oldw = prev_frame.width;
		var oldh = prev_frame.height;
		var neww = next_frame.width;
		var newh = next_frame.height;
		if (oldw != neww)
			this.width *= (neww / oldw);
		if (oldh != newh)
			this.height *= (newh / oldh);
		this.hotspotX = next_frame.hotspotX;
		this.hotspotY = next_frame.hotspotY;
		this.collision_poly.set_pts(next_frame.poly_pts);
		this.set_bbox_changed();
		this.curFrame = next_frame;
		this.curWebGLTexture = next_frame.webGL_texture;
		var i, len, b;
		for (i = 0, len = this.behavior_insts.length; i < len; i++)
		{
			b = this.behavior_insts[i];
			if (b.onSpriteFrameChanged)
				b.onSpriteFrameChanged(prev_frame, next_frame);
		}
		this.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnFrameChanged, this);
	};
	instanceProto.draw = function(ctx)
	{
		ctx.globalAlpha = this.opacity;
		var cur_frame = this.curFrame;
		var spritesheeted = cur_frame.spritesheeted;
		var cur_image = cur_frame.texture_img;
		var myx = this.x;
		var myy = this.y;
		var w = this.width;
		var h = this.height;
		if (this.angle === 0 && w >= 0 && h >= 0)
		{
			myx -= this.hotspotX * w;
			myy -= this.hotspotY * h;
			if (this.runtime.pixel_rounding)
			{
				myx = Math.round(myx);
				myy = Math.round(myy);
			}
			if (spritesheeted)
			{
				ctx.drawImage(cur_image, cur_frame.offx, cur_frame.offy, cur_frame.width, cur_frame.height,
										 myx, myy, w, h);
			}
			else
			{
				ctx.drawImage(cur_image, myx, myy, w, h);
			}
		}
		else
		{
			if (this.runtime.pixel_rounding)
			{
				myx = Math.round(myx);
				myy = Math.round(myy);
			}
			ctx.save();
			var widthfactor = w > 0 ? 1 : -1;
			var heightfactor = h > 0 ? 1 : -1;
			ctx.translate(myx, myy);
			if (widthfactor !== 1 || heightfactor !== 1)
				ctx.scale(widthfactor, heightfactor);
			ctx.rotate(this.angle * widthfactor * heightfactor);
			var drawx = 0 - (this.hotspotX * cr.abs(w))
			var drawy = 0 - (this.hotspotY * cr.abs(h));
			if (spritesheeted)
			{
				ctx.drawImage(cur_image, cur_frame.offx, cur_frame.offy, cur_frame.width, cur_frame.height,
										 drawx, drawy, cr.abs(w), cr.abs(h));
			}
			else
			{
				ctx.drawImage(cur_image, drawx, drawy, cr.abs(w), cr.abs(h));
			}
			ctx.restore();
		}
		/*
		ctx.strokeStyle = "#f00";
		ctx.lineWidth = 3;
		ctx.beginPath();
		this.collision_poly.cache_poly(this.width, this.height, this.angle);
		var i, len, ax, ay, bx, by;
		for (i = 0, len = this.collision_poly.pts_count; i < len; i++)
		{
			ax = this.collision_poly.pts_cache[i*2] + this.x;
			ay = this.collision_poly.pts_cache[i*2+1] + this.y;
			bx = this.collision_poly.pts_cache[((i+1)%len)*2] + this.x;
			by = this.collision_poly.pts_cache[((i+1)%len)*2+1] + this.y;
			ctx.moveTo(ax, ay);
			ctx.lineTo(bx, by);
		}
		ctx.stroke();
		ctx.closePath();
		*/
		/*
		if (this.behavior_insts.length >= 1 && this.behavior_insts[0].draw)
		{
			this.behavior_insts[0].draw(ctx);
		}
		*/
	};
	instanceProto.drawGL_earlyZPass = function(glw)
	{
		this.drawGL(glw);
	};
	instanceProto.drawGL = function(glw)
	{
		glw.setTexture(this.curWebGLTexture);
		glw.setOpacity(this.opacity);
		var cur_frame = this.curFrame;
		var q = this.bquad;
		if (this.runtime.pixel_rounding)
		{
			var ox = Math.round(this.x) - this.x;
			var oy = Math.round(this.y) - this.y;
			if (cur_frame.spritesheeted)
				glw.quadTex(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy, cur_frame.sheetTex);
			else
				glw.quad(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy);
		}
		else
		{
			if (cur_frame.spritesheeted)
				glw.quadTex(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly, cur_frame.sheetTex);
			else
				glw.quad(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly);
		}
	};
	instanceProto.getImagePointIndexByName = function(name_)
	{
		var cur_frame = this.curFrame;
		var i, len;
		for (i = 0, len = cur_frame.image_points.length; i < len; i++)
		{
			if (cr.equals_nocase(name_, cur_frame.image_points[i][0]))
				return i;
		}
		return -1;
	};
	instanceProto.getImagePoint = function(imgpt, getX)
	{
		var cur_frame = this.curFrame;
		var image_points = cur_frame.image_points;
		var index;
		if (cr.is_string(imgpt))
			index = this.getImagePointIndexByName(imgpt);
		else
			index = imgpt - 1;	// 0 is origin
		index = cr.floor(index);
		if (index < 0 || index >= image_points.length)
			return getX ? this.x : this.y;	// return origin
		var x = (image_points[index][1] - cur_frame.hotspotX) * this.width;
		var y = image_points[index][2];
		y = (y - cur_frame.hotspotY) * this.height;
		var cosa = Math.cos(this.angle);
		var sina = Math.sin(this.angle);
		var x_temp = (x * cosa) - (y * sina);
		y = (y * cosa) + (x * sina);
		x = x_temp;
		x += this.x;
		y += this.y;
		return getX ? x : y;
	};
	function Cnds() {};
	var arrCache = [];
	function allocArr()
	{
		if (arrCache.length)
			return arrCache.pop();
		else
			return [0, 0, 0];
	};
	function freeArr(a)
	{
		a[0] = 0;
		a[1] = 0;
		a[2] = 0;
		arrCache.push(a);
	};
	function makeCollKey(a, b)
	{
		if (a < b)
			return "" + a + "," + b;
		else
			return "" + b + "," + a;
	};
	function collmemory_add(collmemory, a, b, tickcount)
	{
		var a_uid = a.uid;
		var b_uid = b.uid;
		var key = makeCollKey(a_uid, b_uid);
		if (collmemory.hasOwnProperty(key))
		{
			collmemory[key][2] = tickcount;
			return;
		}
		var arr = allocArr();
		arr[0] = a_uid;
		arr[1] = b_uid;
		arr[2] = tickcount;
		collmemory[key] = arr;
	};
	function collmemory_remove(collmemory, a, b)
	{
		var key = makeCollKey(a.uid, b.uid);
		if (collmemory.hasOwnProperty(key))
		{
			freeArr(collmemory[key]);
			delete collmemory[key];
		}
	};
	function collmemory_removeInstance(collmemory, inst)
	{
		var uid = inst.uid;
		var p, entry;
		for (p in collmemory)
		{
			if (collmemory.hasOwnProperty(p))
			{
				entry = collmemory[p];
				if (entry[0] === uid || entry[1] === uid)
				{
					freeArr(collmemory[p]);
					delete collmemory[p];
				}
			}
		}
	};
	var last_coll_tickcount = -2;
	function collmemory_has(collmemory, a, b)
	{
		var key = makeCollKey(a.uid, b.uid);
		if (collmemory.hasOwnProperty(key))
		{
			last_coll_tickcount = collmemory[key][2];
			return true;
		}
		else
		{
			last_coll_tickcount = -2;
			return false;
		}
	};
	var candidates1 = [];
	Cnds.prototype.OnCollision = function (rtype)
	{
		if (!rtype)
			return false;
		var runtime = this.runtime;
		var cnd = runtime.getCurrentCondition();
		var ltype = cnd.type;
		var collmemory = null;
		if (cnd.extra["collmemory"])
		{
			collmemory = cnd.extra["collmemory"];
		}
		else
		{
			collmemory = {};
			cnd.extra["collmemory"] = collmemory;
		}
		if (!cnd.extra["spriteCreatedDestroyCallback"])
		{
			cnd.extra["spriteCreatedDestroyCallback"] = true;
			runtime.addDestroyCallback(function(inst) {
				collmemory_removeInstance(cnd.extra["collmemory"], inst);
			});
		}
		var lsol = ltype.getCurrentSol();
		var rsol = rtype.getCurrentSol();
		var linstances = lsol.getObjects();
		var rinstances;
		var l, linst, r, rinst;
		var curlsol, currsol;
		var tickcount = this.runtime.tickcount;
		var lasttickcount = tickcount - 1;
		var exists, run;
		var current_event = runtime.getCurrentEventStack().current_event;
		var orblock = current_event.orblock;
		for (l = 0; l < linstances.length; l++)
		{
			linst = linstances[l];
			if (rsol.select_all)
			{
				linst.update_bbox();
				this.runtime.getCollisionCandidates(linst.layer, rtype, linst.bbox, candidates1);
				rinstances = candidates1;
			}
			else
				rinstances = rsol.getObjects();
			for (r = 0; r < rinstances.length; r++)
			{
				rinst = rinstances[r];
				if (runtime.testOverlap(linst, rinst) || runtime.checkRegisteredCollision(linst, rinst))
				{
					exists = collmemory_has(collmemory, linst, rinst);
					run = (!exists || (last_coll_tickcount < lasttickcount));
					collmemory_add(collmemory, linst, rinst, tickcount);
					if (run)
					{
						runtime.pushCopySol(current_event.solModifiers);
						curlsol = ltype.getCurrentSol();
						currsol = rtype.getCurrentSol();
						curlsol.select_all = false;
						currsol.select_all = false;
						if (ltype === rtype)
						{
							curlsol.instances.length = 2;	// just use lsol, is same reference as rsol
							curlsol.instances[0] = linst;
							curlsol.instances[1] = rinst;
							ltype.applySolToContainer();
						}
						else
						{
							curlsol.instances.length = 1;
							currsol.instances.length = 1;
							curlsol.instances[0] = linst;
							currsol.instances[0] = rinst;
							ltype.applySolToContainer();
							rtype.applySolToContainer();
						}
						current_event.retrigger();
						runtime.popSol(current_event.solModifiers);
					}
				}
				else
				{
					collmemory_remove(collmemory, linst, rinst);
				}
			}
			cr.clearArray(candidates1);
		}
		return false;
	};
	var rpicktype = null;
	var rtopick = new cr.ObjectSet();
	var needscollisionfinish = false;
	var candidates2 = [];
	var temp_bbox = new cr.rect(0, 0, 0, 0);
	function DoOverlapCondition(rtype, offx, offy)
	{
		if (!rtype)
			return false;
		var do_offset = (offx !== 0 || offy !== 0);
		var oldx, oldy, ret = false, r, lenr, rinst;
		var cnd = this.runtime.getCurrentCondition();
		var ltype = cnd.type;
		var inverted = cnd.inverted;
		var rsol = rtype.getCurrentSol();
		var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
		var rinstances;
		if (rsol.select_all)
		{
			this.update_bbox();
			temp_bbox.copy(this.bbox);
			temp_bbox.offset(offx, offy);
			this.runtime.getCollisionCandidates(this.layer, rtype, temp_bbox, candidates2);
			rinstances = candidates2;
		}
		else if (orblock)
		{
			if (this.runtime.isCurrentConditionFirst() && !rsol.else_instances.length && rsol.instances.length)
				rinstances = rsol.instances;
			else
				rinstances = rsol.else_instances;
		}
		else
		{
			rinstances = rsol.instances;
		}
		rpicktype = rtype;
		needscollisionfinish = (ltype !== rtype && !inverted);
		if (do_offset)
		{
			oldx = this.x;
			oldy = this.y;
			this.x += offx;
			this.y += offy;
			this.set_bbox_changed();
		}
		for (r = 0, lenr = rinstances.length; r < lenr; r++)
		{
			rinst = rinstances[r];
			if (this.runtime.testOverlap(this, rinst))
			{
				ret = true;
				if (inverted)
					break;
				if (ltype !== rtype)
					rtopick.add(rinst);
			}
		}
		if (do_offset)
		{
			this.x = oldx;
			this.y = oldy;
			this.set_bbox_changed();
		}
		cr.clearArray(candidates2);
		return ret;
	};
	typeProto.finish = function (do_pick)
	{
		if (!needscollisionfinish)
			return;
		if (do_pick)
		{
			var orblock = this.runtime.getCurrentEventStack().current_event.orblock;
			var sol = rpicktype.getCurrentSol();
			var topick = rtopick.valuesRef();
			var i, len, inst;
			if (sol.select_all)
			{
				sol.select_all = false;
				cr.clearArray(sol.instances);
				for (i = 0, len = topick.length; i < len; ++i)
				{
					sol.instances[i] = topick[i];
				}
				if (orblock)
				{
					cr.clearArray(sol.else_instances);
					for (i = 0, len = rpicktype.instances.length; i < len; ++i)
					{
						inst = rpicktype.instances[i];
						if (!rtopick.contains(inst))
							sol.else_instances.push(inst);
					}
				}
			}
			else
			{
				if (orblock)
				{
					var initsize = sol.instances.length;
					for (i = 0, len = topick.length; i < len; ++i)
					{
						sol.instances[initsize + i] = topick[i];
						cr.arrayFindRemove(sol.else_instances, topick[i]);
					}
				}
				else
				{
					cr.shallowAssignArray(sol.instances, topick);
				}
			}
			rpicktype.applySolToContainer();
		}
		rtopick.clear();
		needscollisionfinish = false;
	};
	Cnds.prototype.IsOverlapping = function (rtype)
	{
		return DoOverlapCondition.call(this, rtype, 0, 0);
	};
	Cnds.prototype.IsOverlappingOffset = function (rtype, offx, offy)
	{
		return DoOverlapCondition.call(this, rtype, offx, offy);
	};
	Cnds.prototype.IsAnimPlaying = function (animname)
	{
		if (this.changeAnimName.length)
			return cr.equals_nocase(this.changeAnimName, animname);
		else
			return cr.equals_nocase(this.cur_animation.name, animname);
	};
	Cnds.prototype.CompareFrame = function (cmp, framenum)
	{
		return cr.do_cmp(this.cur_frame, cmp, framenum);
	};
	Cnds.prototype.CompareAnimSpeed = function (cmp, x)
	{
		var s = (this.animForwards ? this.cur_anim_speed : -this.cur_anim_speed);
		return cr.do_cmp(s, cmp, x);
	};
	Cnds.prototype.OnAnimFinished = function (animname)
	{
		return cr.equals_nocase(this.animTriggerName, animname);
	};
	Cnds.prototype.OnAnyAnimFinished = function ()
	{
		return true;
	};
	Cnds.prototype.OnFrameChanged = function ()
	{
		return true;
	};
	Cnds.prototype.IsMirrored = function ()
	{
		return this.width < 0;
	};
	Cnds.prototype.IsFlipped = function ()
	{
		return this.height < 0;
	};
	Cnds.prototype.OnURLLoaded = function ()
	{
		return true;
	};
	Cnds.prototype.IsCollisionEnabled = function ()
	{
		return this.collisionsEnabled;
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.Spawn = function (obj, layer, imgpt)
	{
		if (!obj || !layer)
			return;
		var inst = this.runtime.createInstance(obj, layer, this.getImagePoint(imgpt, true), this.getImagePoint(imgpt, false));
		if (!inst)
			return;
		if (typeof inst.angle !== "undefined")
		{
			inst.angle = this.angle;
			inst.set_bbox_changed();
		}
		this.runtime.isInOnDestroy++;
		var i, len, s;
		this.runtime.trigger(Object.getPrototypeOf(obj.plugin).cnds.OnCreated, inst);
		if (inst.is_contained)
		{
			for (i = 0, len = inst.siblings.length; i < len; i++)
			{
				s = inst.siblings[i];
				this.runtime.trigger(Object.getPrototypeOf(s.type.plugin).cnds.OnCreated, s);
			}
		}
		this.runtime.isInOnDestroy--;
		var cur_act = this.runtime.getCurrentAction();
		var reset_sol = false;
		if (cr.is_undefined(cur_act.extra["Spawn_LastExec"]) || cur_act.extra["Spawn_LastExec"] < this.runtime.execcount)
		{
			reset_sol = true;
			cur_act.extra["Spawn_LastExec"] = this.runtime.execcount;
		}
		var sol;
		if (obj != this.type)
		{
			sol = obj.getCurrentSol();
			sol.select_all = false;
			if (reset_sol)
			{
				cr.clearArray(sol.instances);
				sol.instances[0] = inst;
			}
			else
				sol.instances.push(inst);
			if (inst.is_contained)
			{
				for (i = 0, len = inst.siblings.length; i < len; i++)
				{
					s = inst.siblings[i];
					sol = s.type.getCurrentSol();
					sol.select_all = false;
					if (reset_sol)
					{
						cr.clearArray(sol.instances);
						sol.instances[0] = s;
					}
					else
						sol.instances.push(s);
				}
			}
		}
	};
	Acts.prototype.SetEffect = function (effect)
	{
		this.blend_mode = effect;
		this.compositeOp = cr.effectToCompositeOp(effect);
		cr.setGLBlend(this, effect, this.runtime.gl);
		this.runtime.redraw = true;
	};
	Acts.prototype.StopAnim = function ()
	{
		this.animPlaying = false;
	};
	Acts.prototype.StartAnim = function (from)
	{
		this.animPlaying = true;
		this.frameStart = this.getNowTime();
		if (from === 1 && this.cur_frame !== 0)
		{
			this.changeAnimFrame = 0;
			if (!this.inAnimTrigger)
				this.doChangeAnimFrame();
		}
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
	};
	Acts.prototype.SetAnim = function (animname, from)
	{
		this.changeAnimName = animname;
		this.changeAnimFrom = from;
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		if (!this.inAnimTrigger)
			this.doChangeAnim();
	};
	Acts.prototype.SetAnimFrame = function (framenumber)
	{
		this.changeAnimFrame = framenumber;
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
		if (!this.inAnimTrigger)
			this.doChangeAnimFrame();
	};
	Acts.prototype.SetAnimSpeed = function (s)
	{
		this.cur_anim_speed = cr.abs(s);
		this.animForwards = (s >= 0);
		if (!this.isTicking)
		{
			this.runtime.tickMe(this);
			this.isTicking = true;
		}
	};
	Acts.prototype.SetAnimRepeatToFrame = function (s)
	{
		s = Math.floor(s);
		if (s < 0)
			s = 0;
		if (s >= this.cur_animation.frames.length)
			s = this.cur_animation.frames.length - 1;
		this.cur_anim_repeatto = s;
	};
	Acts.prototype.SetMirrored = function (m)
	{
		var neww = cr.abs(this.width) * (m === 0 ? -1 : 1);
		if (this.width === neww)
			return;
		this.width = neww;
		this.set_bbox_changed();
	};
	Acts.prototype.SetFlipped = function (f)
	{
		var newh = cr.abs(this.height) * (f === 0 ? -1 : 1);
		if (this.height === newh)
			return;
		this.height = newh;
		this.set_bbox_changed();
	};
	Acts.prototype.SetScale = function (s)
	{
		var cur_frame = this.curFrame;
		var mirror_factor = (this.width < 0 ? -1 : 1);
		var flip_factor = (this.height < 0 ? -1 : 1);
		var new_width = cur_frame.width * s * mirror_factor;
		var new_height = cur_frame.height * s * flip_factor;
		if (this.width !== new_width || this.height !== new_height)
		{
			this.width = new_width;
			this.height = new_height;
			this.set_bbox_changed();
		}
	};
	Acts.prototype.LoadURL = function (url_, resize_)
	{
		var img = new Image();
		var self = this;
		var curFrame_ = this.curFrame;
		img.onload = function ()
		{
			if (curFrame_.texture_img.src === img.src)
			{
				if (self.runtime.glwrap && self.curFrame === curFrame_)
					self.curWebGLTexture = curFrame_.webGL_texture;
				if (resize_ === 0)		// resize to image size
				{
					self.width = img.width;
					self.height = img.height;
					self.set_bbox_changed();
				}
				self.runtime.redraw = true;
				self.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnURLLoaded, self);
				return;
			}
			curFrame_.texture_img = img;
			curFrame_.offx = 0;
			curFrame_.offy = 0;
			curFrame_.width = img.width;
			curFrame_.height = img.height;
			curFrame_.spritesheeted = false;
			curFrame_.datauri = "";
			curFrame_.pixelformat = 0;	// reset to RGBA, since we don't know what type of image will have come in
			if (self.runtime.glwrap)
			{
				if (curFrame_.webGL_texture)
					self.runtime.glwrap.deleteTexture(curFrame_.webGL_texture);
				curFrame_.webGL_texture = self.runtime.glwrap.loadTexture(img, false, self.runtime.linearSampling);
				if (self.curFrame === curFrame_)
					self.curWebGLTexture = curFrame_.webGL_texture;
				self.type.updateAllCurrentTexture();
			}
			if (resize_ === 0)		// resize to image size
			{
				self.width = img.width;
				self.height = img.height;
				self.set_bbox_changed();
			}
			self.runtime.redraw = true;
			self.runtime.trigger(cr.plugins_.Sprite.prototype.cnds.OnURLLoaded, self);
		};
		if (url_.substr(0, 5) !== "data:")
			img["crossOrigin"] = "anonymous";
		this.runtime.setImageSrc(img, url_);
	};
	Acts.prototype.SetCollisions = function (set_)
	{
		if (this.collisionsEnabled === (set_ !== 0))
			return;		// no change
		this.collisionsEnabled = (set_ !== 0);
		if (this.collisionsEnabled)
			this.set_bbox_changed();		// needs to be added back to cells
		else
		{
			if (this.collcells.right >= this.collcells.left)
				this.type.collision_grid.update(this, this.collcells, null);
			this.collcells.set(0, 0, -1, -1);
		}
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.AnimationFrame = function (ret)
	{
		ret.set_int(this.cur_frame);
	};
	Exps.prototype.AnimationFrameCount = function (ret)
	{
		ret.set_int(this.cur_animation.frames.length);
	};
	Exps.prototype.AnimationName = function (ret)
	{
		ret.set_string(this.cur_animation.name);
	};
	Exps.prototype.AnimationSpeed = function (ret)
	{
		ret.set_float(this.animForwards ? this.cur_anim_speed : -this.cur_anim_speed);
	};
	Exps.prototype.ImagePointX = function (ret, imgpt)
	{
		ret.set_float(this.getImagePoint(imgpt, true));
	};
	Exps.prototype.ImagePointY = function (ret, imgpt)
	{
		ret.set_float(this.getImagePoint(imgpt, false));
	};
	Exps.prototype.ImagePointCount = function (ret)
	{
		ret.set_int(this.curFrame.image_points.length);
	};
	Exps.prototype.ImageWidth = function (ret)
	{
		ret.set_float(this.curFrame.width);
	};
	Exps.prototype.ImageHeight = function (ret)
	{
		ret.set_float(this.curFrame.height);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Text = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Text.prototype;
	pluginProto.onCreate = function ()
	{
		pluginProto.acts.SetWidth = function (w)
		{
			if (this.width !== w)
			{
				this.width = w;
				this.text_changed = true;	// also recalculate text wrapping
				this.set_bbox_changed();
			}
		};
	};
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
		var i, len, inst;
		for (i = 0, len = this.instances.length; i < len; i++)
		{
			inst = this.instances[i];
			inst.mycanvas = null;
			inst.myctx = null;
			inst.mytex = null;
		}
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		if (this.recycled)
			cr.clearArray(this.lines);
		else
			this.lines = [];		// for word wrapping
		this.text_changed = true;
	};
	var instanceProto = pluginProto.Instance.prototype;
	var requestedWebFonts = {};		// already requested web fonts have an entry here
	instanceProto.onCreate = function()
	{
		this.text = this.properties[0];
		this.visible = (this.properties[1] === 0);		// 0=visible, 1=invisible
		this.font = this.properties[2];
		this.color = this.properties[3];
		this.halign = this.properties[4];				// 0=left, 1=center, 2=right
		this.valign = this.properties[5];				// 0=top, 1=center, 2=bottom
		this.wrapbyword = (this.properties[7] === 0);	// 0=word, 1=character
		this.lastwidth = this.width;
		this.lastwrapwidth = this.width;
		this.lastheight = this.height;
		this.line_height_offset = this.properties[8];
		this.facename = "";
		this.fontstyle = "";
		this.ptSize = 0;
		this.textWidth = 0;
		this.textHeight = 0;
		this.parseFont();
		this.mycanvas = null;
		this.myctx = null;
		this.mytex = null;
		this.need_text_redraw = false;
		this.last_render_tick = this.runtime.tickcount;
		if (this.recycled)
			this.rcTex.set(0, 0, 1, 1);
		else
			this.rcTex = new cr.rect(0, 0, 1, 1);
		if (this.runtime.glwrap)
			this.runtime.tickMe(this);
;
	};
	instanceProto.parseFont = function ()
	{
		var arr = this.font.split(" ");
		var i;
		for (i = 0; i < arr.length; i++)
		{
			if (arr[i].substr(arr[i].length - 2, 2) === "pt")
			{
				this.ptSize = parseInt(arr[i].substr(0, arr[i].length - 2));
				this.pxHeight = Math.ceil((this.ptSize / 72.0) * 96.0) + 4;	// assume 96dpi...
				if (i > 0)
					this.fontstyle = arr[i - 1];
				this.facename = arr[i + 1];
				for (i = i + 2; i < arr.length; i++)
					this.facename += " " + arr[i];
				break;
			}
		}
	};
	instanceProto.saveToJSON = function ()
	{
		return {
			"t": this.text,
			"f": this.font,
			"c": this.color,
			"ha": this.halign,
			"va": this.valign,
			"wr": this.wrapbyword,
			"lho": this.line_height_offset,
			"fn": this.facename,
			"fs": this.fontstyle,
			"ps": this.ptSize,
			"pxh": this.pxHeight,
			"tw": this.textWidth,
			"th": this.textHeight,
			"lrt": this.last_render_tick
		};
	};
	instanceProto.loadFromJSON = function (o)
	{
		this.text = o["t"];
		this.font = o["f"];
		this.color = o["c"];
		this.halign = o["ha"];
		this.valign = o["va"];
		this.wrapbyword = o["wr"];
		this.line_height_offset = o["lho"];
		this.facename = o["fn"];
		this.fontstyle = o["fs"];
		this.ptSize = o["ps"];
		this.pxHeight = o["pxh"];
		this.textWidth = o["tw"];
		this.textHeight = o["th"];
		this.last_render_tick = o["lrt"];
		this.text_changed = true;
		this.lastwidth = this.width;
		this.lastwrapwidth = this.width;
		this.lastheight = this.height;
	};
	instanceProto.tick = function ()
	{
		if (this.runtime.glwrap && this.mytex && (this.runtime.tickcount - this.last_render_tick >= 300))
		{
			var layer = this.layer;
            this.update_bbox();
            var bbox = this.bbox;
            if (bbox.right < layer.viewLeft || bbox.bottom < layer.viewTop || bbox.left > layer.viewRight || bbox.top > layer.viewBottom)
			{
				this.runtime.glwrap.deleteTexture(this.mytex);
				this.mytex = null;
				this.myctx = null;
				this.mycanvas = null;
			}
		}
	};
	instanceProto.onDestroy = function ()
	{
		this.myctx = null;
		this.mycanvas = null;
		if (this.runtime.glwrap && this.mytex)
			this.runtime.glwrap.deleteTexture(this.mytex);
		this.mytex = null;
	};
	instanceProto.updateFont = function ()
	{
		this.font = this.fontstyle + " " + this.ptSize.toString() + "pt " + this.facename;
		this.text_changed = true;
		this.runtime.redraw = true;
	};
	instanceProto.draw = function(ctx, glmode)
	{
		ctx.font = this.font;
		ctx.textBaseline = "top";
		ctx.fillStyle = this.color;
		ctx.globalAlpha = glmode ? 1 : this.opacity;
		var myscale = 1;
		if (glmode)
		{
			myscale = Math.abs(this.layer.getScale());
			ctx.save();
			ctx.scale(myscale, myscale);
		}
		if (this.text_changed || this.width !== this.lastwrapwidth)
		{
			this.type.plugin.WordWrap(this.text, this.lines, ctx, this.width, this.wrapbyword);
			this.text_changed = false;
			this.lastwrapwidth = this.width;
		}
		this.update_bbox();
		var penX = glmode ? 0 : this.bquad.tlx;
		var penY = glmode ? 0 : this.bquad.tly;
		if (this.runtime.pixel_rounding)
		{
			penX = (penX + 0.5) | 0;
			penY = (penY + 0.5) | 0;
		}
		if (this.angle !== 0 && !glmode)
		{
			ctx.save();
			ctx.translate(penX, penY);
			ctx.rotate(this.angle);
			penX = 0;
			penY = 0;
		}
		var endY = penY + this.height;
		var line_height = this.pxHeight;
		line_height += this.line_height_offset;
		var drawX;
		var i;
		if (this.valign === 1)		// center
			penY += Math.max(this.height / 2 - (this.lines.length * line_height) / 2, 0);
		else if (this.valign === 2)	// bottom
			penY += Math.max(this.height - (this.lines.length * line_height) - 2, 0);
		for (i = 0; i < this.lines.length; i++)
		{
			drawX = penX;
			if (this.halign === 1)		// center
				drawX = penX + (this.width - this.lines[i].width) / 2;
			else if (this.halign === 2)	// right
				drawX = penX + (this.width - this.lines[i].width);
			ctx.fillText(this.lines[i].text, drawX, penY);
			penY += line_height;
			if (penY >= endY - line_height)
				break;
		}
		if (this.angle !== 0 || glmode)
			ctx.restore();
		this.last_render_tick = this.runtime.tickcount;
	};
	instanceProto.drawGL = function(glw)
	{
		if (this.width < 1 || this.height < 1)
			return;
		var need_redraw = this.text_changed || this.need_text_redraw;
		this.need_text_redraw = false;
		var layer_scale = this.layer.getScale();
		var layer_angle = this.layer.getAngle();
		var rcTex = this.rcTex;
		var floatscaledwidth = layer_scale * this.width;
		var floatscaledheight = layer_scale * this.height;
		var scaledwidth = Math.ceil(floatscaledwidth);
		var scaledheight = Math.ceil(floatscaledheight);
		var absscaledwidth = Math.abs(scaledwidth);
		var absscaledheight = Math.abs(scaledheight);
		var halfw = this.runtime.draw_width / 2;
		var halfh = this.runtime.draw_height / 2;
		if (!this.myctx)
		{
			this.mycanvas = document.createElement("canvas");
			this.mycanvas.width = absscaledwidth;
			this.mycanvas.height = absscaledheight;
			this.lastwidth = absscaledwidth;
			this.lastheight = absscaledheight;
			need_redraw = true;
			this.myctx = this.mycanvas.getContext("2d");
		}
		if (absscaledwidth !== this.lastwidth || absscaledheight !== this.lastheight)
		{
			this.mycanvas.width = absscaledwidth;
			this.mycanvas.height = absscaledheight;
			if (this.mytex)
			{
				glw.deleteTexture(this.mytex);
				this.mytex = null;
			}
			need_redraw = true;
		}
		if (need_redraw)
		{
			this.myctx.clearRect(0, 0, absscaledwidth, absscaledheight);
			this.draw(this.myctx, true);
			if (!this.mytex)
				this.mytex = glw.createEmptyTexture(absscaledwidth, absscaledheight, this.runtime.linearSampling, this.runtime.isMobile);
			glw.videoToTexture(this.mycanvas, this.mytex, this.runtime.isMobile);
		}
		this.lastwidth = absscaledwidth;
		this.lastheight = absscaledheight;
		glw.setTexture(this.mytex);
		glw.setOpacity(this.opacity);
		glw.resetModelView();
		glw.translate(-halfw, -halfh);
		glw.updateModelView();
		var q = this.bquad;
		var tlx = this.layer.layerToCanvas(q.tlx, q.tly, true, true);
		var tly = this.layer.layerToCanvas(q.tlx, q.tly, false, true);
		var trx = this.layer.layerToCanvas(q.trx, q.try_, true, true);
		var try_ = this.layer.layerToCanvas(q.trx, q.try_, false, true);
		var brx = this.layer.layerToCanvas(q.brx, q.bry, true, true);
		var bry = this.layer.layerToCanvas(q.brx, q.bry, false, true);
		var blx = this.layer.layerToCanvas(q.blx, q.bly, true, true);
		var bly = this.layer.layerToCanvas(q.blx, q.bly, false, true);
		if (this.runtime.pixel_rounding || (this.angle === 0 && layer_angle === 0))
		{
			var ox = ((tlx + 0.5) | 0) - tlx;
			var oy = ((tly + 0.5) | 0) - tly
			tlx += ox;
			tly += oy;
			trx += ox;
			try_ += oy;
			brx += ox;
			bry += oy;
			blx += ox;
			bly += oy;
		}
		if (this.angle === 0 && layer_angle === 0)
		{
			trx = tlx + scaledwidth;
			try_ = tly;
			brx = trx;
			bry = tly + scaledheight;
			blx = tlx;
			bly = bry;
			rcTex.right = 1;
			rcTex.bottom = 1;
		}
		else
		{
			rcTex.right = floatscaledwidth / scaledwidth;
			rcTex.bottom = floatscaledheight / scaledheight;
		}
		glw.quadTex(tlx, tly, trx, try_, brx, bry, blx, bly, rcTex);
		glw.resetModelView();
		glw.scale(layer_scale, layer_scale);
		glw.rotateZ(-this.layer.getAngle());
		glw.translate((this.layer.viewLeft + this.layer.viewRight) / -2, (this.layer.viewTop + this.layer.viewBottom) / -2);
		glw.updateModelView();
		this.last_render_tick = this.runtime.tickcount;
	};
	var wordsCache = [];
	pluginProto.TokeniseWords = function (text)
	{
		cr.clearArray(wordsCache);
		var cur_word = "";
		var ch;
		var i = 0;
		while (i < text.length)
		{
			ch = text.charAt(i);
			if (ch === "\n")
			{
				if (cur_word.length)
				{
					wordsCache.push(cur_word);
					cur_word = "";
				}
				wordsCache.push("\n");
				++i;
			}
			else if (ch === " " || ch === "\t" || ch === "-")
			{
				do {
					cur_word += text.charAt(i);
					i++;
				}
				while (i < text.length && (text.charAt(i) === " " || text.charAt(i) === "\t"));
				wordsCache.push(cur_word);
				cur_word = "";
			}
			else if (i < text.length)
			{
				cur_word += ch;
				i++;
			}
		}
		if (cur_word.length)
			wordsCache.push(cur_word);
	};
	var linesCache = [];
	function allocLine()
	{
		if (linesCache.length)
			return linesCache.pop();
		else
			return {};
	};
	function freeLine(l)
	{
		linesCache.push(l);
	};
	function freeAllLines(arr)
	{
		var i, len;
		for (i = 0, len = arr.length; i < len; i++)
		{
			freeLine(arr[i]);
		}
		cr.clearArray(arr);
	};
	pluginProto.WordWrap = function (text, lines, ctx, width, wrapbyword)
	{
		if (!text || !text.length)
		{
			freeAllLines(lines);
			return;
		}
		if (width <= 2.0)
		{
			freeAllLines(lines);
			return;
		}
		if (text.length <= 100 && text.indexOf("\n") === -1)
		{
			var all_width = ctx.measureText(text).width;
			if (all_width <= width)
			{
				freeAllLines(lines);
				lines.push(allocLine());
				lines[0].text = text;
				lines[0].width = all_width;
				return;
			}
		}
		this.WrapText(text, lines, ctx, width, wrapbyword);
	};
	function trimSingleSpaceRight(str)
	{
		if (!str.length || str.charAt(str.length - 1) !== " ")
			return str;
		return str.substring(0, str.length - 1);
	};
	pluginProto.WrapText = function (text, lines, ctx, width, wrapbyword)
	{
		var wordArray;
		if (wrapbyword)
		{
			this.TokeniseWords(text);	// writes to wordsCache
			wordArray = wordsCache;
		}
		else
			wordArray = text;
		var cur_line = "";
		var prev_line;
		var line_width;
		var i;
		var lineIndex = 0;
		var line;
		for (i = 0; i < wordArray.length; i++)
		{
			if (wordArray[i] === "\n")
			{
				if (lineIndex >= lines.length)
					lines.push(allocLine());
				cur_line = trimSingleSpaceRight(cur_line);		// for correct center/right alignment
				line = lines[lineIndex];
				line.text = cur_line;
				line.width = ctx.measureText(cur_line).width;
				lineIndex++;
				cur_line = "";
				continue;
			}
			prev_line = cur_line;
			cur_line += wordArray[i];
			line_width = ctx.measureText(cur_line).width;
			if (line_width >= width)
			{
				if (lineIndex >= lines.length)
					lines.push(allocLine());
				prev_line = trimSingleSpaceRight(prev_line);
				line = lines[lineIndex];
				line.text = prev_line;
				line.width = ctx.measureText(prev_line).width;
				lineIndex++;
				cur_line = wordArray[i];
				if (!wrapbyword && cur_line === " ")
					cur_line = "";
			}
		}
		if (cur_line.length)
		{
			if (lineIndex >= lines.length)
				lines.push(allocLine());
			cur_line = trimSingleSpaceRight(cur_line);
			line = lines[lineIndex];
			line.text = cur_line;
			line.width = ctx.measureText(cur_line).width;
			lineIndex++;
		}
		for (i = lineIndex; i < lines.length; i++)
			freeLine(lines[i]);
		lines.length = lineIndex;
	};
	function Cnds() {};
	Cnds.prototype.CompareText = function(text_to_compare, case_sensitive)
	{
		if (case_sensitive)
			return this.text == text_to_compare;
		else
			return cr.equals_nocase(this.text, text_to_compare);
	};
	pluginProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetText = function(param)
	{
		if (cr.is_number(param) && param < 1e9)
			param = Math.round(param * 1e10) / 1e10;	// round to nearest ten billionth - hides floating point errors
		var text_to_set = param.toString();
		if (this.text !== text_to_set)
		{
			this.text = text_to_set;
			this.text_changed = true;
			this.runtime.redraw = true;
		}
	};
	Acts.prototype.AppendText = function(param)
	{
		if (cr.is_number(param))
			param = Math.round(param * 1e10) / 1e10;	// round to nearest ten billionth - hides floating point errors
		var text_to_append = param.toString();
		if (text_to_append)	// not empty
		{
			this.text += text_to_append;
			this.text_changed = true;
			this.runtime.redraw = true;
		}
	};
	Acts.prototype.SetFontFace = function (face_, style_)
	{
		var newstyle = "";
		switch (style_) {
		case 1: newstyle = "bold"; break;
		case 2: newstyle = "italic"; break;
		case 3: newstyle = "bold italic"; break;
		}
		if (face_ === this.facename && newstyle === this.fontstyle)
			return;		// no change
		this.facename = face_;
		this.fontstyle = newstyle;
		this.updateFont();
	};
	Acts.prototype.SetFontSize = function (size_)
	{
		if (this.ptSize === size_)
			return;
		this.ptSize = size_;
		this.pxHeight = Math.ceil((this.ptSize / 72.0) * 96.0) + 4;	// assume 96dpi...
		this.updateFont();
	};
	Acts.prototype.SetFontColor = function (rgb)
	{
		var newcolor = "rgb(" + cr.GetRValue(rgb).toString() + "," + cr.GetGValue(rgb).toString() + "," + cr.GetBValue(rgb).toString() + ")";
		if (newcolor === this.color)
			return;
		this.color = newcolor;
		this.need_text_redraw = true;
		this.runtime.redraw = true;
	};
	Acts.prototype.SetWebFont = function (familyname_, cssurl_)
	{
		if (this.runtime.isDomFree)
		{
			cr.logexport("[Construct 2] Text plugin: 'Set web font' not supported on this platform - the action has been ignored");
			return;		// DC todo
		}
		var self = this;
		var refreshFunc = (function () {
							self.runtime.redraw = true;
							self.text_changed = true;
						});
		if (requestedWebFonts.hasOwnProperty(cssurl_))
		{
			var newfacename = "'" + familyname_ + "'";
			if (this.facename === newfacename)
				return;	// no change
			this.facename = newfacename;
			this.updateFont();
			for (var i = 1; i < 10; i++)
			{
				setTimeout(refreshFunc, i * 100);
				setTimeout(refreshFunc, i * 1000);
			}
			return;
		}
		var wf = document.createElement("link");
		wf.href = cssurl_;
		wf.rel = "stylesheet";
		wf.type = "text/css";
		wf.onload = refreshFunc;
		document.getElementsByTagName('head')[0].appendChild(wf);
		requestedWebFonts[cssurl_] = true;
		this.facename = "'" + familyname_ + "'";
		this.updateFont();
		for (var i = 1; i < 10; i++)
		{
			setTimeout(refreshFunc, i * 100);
			setTimeout(refreshFunc, i * 1000);
		}
;
	};
	Acts.prototype.SetEffect = function (effect)
	{
		this.blend_mode = effect;
		this.compositeOp = cr.effectToCompositeOp(effect);
		cr.setGLBlend(this, effect, this.runtime.gl);
		this.runtime.redraw = true;
	};
	pluginProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Text = function(ret)
	{
		ret.set_string(this.text);
	};
	Exps.prototype.FaceName = function (ret)
	{
		ret.set_string(this.facename);
	};
	Exps.prototype.FaceSize = function (ret)
	{
		ret.set_int(this.ptSize);
	};
	Exps.prototype.TextWidth = function (ret)
	{
		var w = 0;
		var i, len, x;
		for (i = 0, len = this.lines.length; i < len; i++)
		{
			x = this.lines[i].width;
			if (w < x)
				w = x;
		}
		ret.set_int(w);
	};
	Exps.prototype.TextHeight = function (ret)
	{
		ret.set_int(this.lines.length * (this.pxHeight + this.line_height_offset) - this.line_height_offset);
	};
	pluginProto.exps = new Exps();
}());
;
;
cr.plugins_.Touch = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.Touch.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		this.touches = [];
		this.mouseDown = false;
	};
	var instanceProto = pluginProto.Instance.prototype;
	var dummyoffset = {left: 0, top: 0};
	instanceProto.findTouch = function (id)
	{
		var i, len;
		for (i = 0, len = this.touches.length; i < len; i++)
		{
			if (this.touches[i]["id"] === id)
				return i;
		}
		return -1;
	};
	var appmobi_accx = 0;
	var appmobi_accy = 0;
	var appmobi_accz = 0;
	function AppMobiGetAcceleration(evt)
	{
		appmobi_accx = evt.x;
		appmobi_accy = evt.y;
		appmobi_accz = evt.z;
	};
	var pg_accx = 0;
	var pg_accy = 0;
	var pg_accz = 0;
	function PhoneGapGetAcceleration(evt)
	{
		pg_accx = evt.x;
		pg_accy = evt.y;
		pg_accz = evt.z;
	};
	var theInstance = null;
	var touchinfo_cache = [];
	function AllocTouchInfo(x, y, id, index)
	{
		var ret;
		if (touchinfo_cache.length)
			ret = touchinfo_cache.pop();
		else
			ret = new TouchInfo();
		ret.init(x, y, id, index);
		return ret;
	};
	function ReleaseTouchInfo(ti)
	{
		if (touchinfo_cache.length < 100)
			touchinfo_cache.push(ti);
	};
	var GESTURE_HOLD_THRESHOLD = 15;		// max px motion for hold gesture to register
	var GESTURE_HOLD_TIMEOUT = 500;			// time for hold gesture to register
	var GESTURE_TAP_TIMEOUT = 333;			// time for tap gesture to register
	var GESTURE_DOUBLETAP_THRESHOLD = 25;	// max distance apart for taps to be
	function TouchInfo()
	{
		this.starttime = 0;
		this.time = 0;
		this.lasttime = 0;
		this.startx = 0;
		this.starty = 0;
		this.x = 0;
		this.y = 0;
		this.lastx = 0;
		this.lasty = 0;
		this["id"] = 0;
		this.startindex = 0;
		this.triggeredHold = false;
		this.tooFarForHold = false;
	};
	TouchInfo.prototype.init = function (x, y, id, index)
	{
		var nowtime = cr.performance_now();
		this.time = nowtime;
		this.lasttime = nowtime;
		this.starttime = nowtime;
		this.startx = x;
		this.starty = y;
		this.x = x;
		this.y = y;
		this.lastx = x;
		this.lasty = y;
		this.width = 0;
		this.height = 0;
		this.pressure = 0;
		this["id"] = id;
		this.startindex = index;
		this.triggeredHold = false;
		this.tooFarForHold = false;
	};
	TouchInfo.prototype.update = function (nowtime, x, y, width, height, pressure)
	{
		this.lasttime = this.time;
		this.time = nowtime;
		this.lastx = this.x;
		this.lasty = this.y;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.pressure = pressure;
		if (!this.tooFarForHold && cr.distanceTo(this.startx, this.starty, this.x, this.y) >= GESTURE_HOLD_THRESHOLD)
		{
			this.tooFarForHold = true;
		}
	};
	TouchInfo.prototype.maybeTriggerHold = function (inst, index)
	{
		if (this.triggeredHold)
			return;		// already triggered this gesture
		var nowtime = cr.performance_now();
		if (nowtime - this.starttime >= GESTURE_HOLD_TIMEOUT && !this.tooFarForHold && cr.distanceTo(this.startx, this.starty, this.x, this.y) < GESTURE_HOLD_THRESHOLD)
		{
			this.triggeredHold = true;
			inst.trigger_index = this.startindex;
			inst.trigger_id = this["id"];
			inst.getTouchIndex = index;
			inst.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnHoldGesture, inst);
			inst.curTouchX = this.x;
			inst.curTouchY = this.y;
			inst.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnHoldGestureObject, inst);
			inst.getTouchIndex = 0;
		}
	};
	var lastTapX = -1000;
	var lastTapY = -1000;
	var lastTapTime = -10000;
	TouchInfo.prototype.maybeTriggerTap = function (inst, index)
	{
		if (this.triggeredHold)
			return;
		var nowtime = cr.performance_now();
		if (nowtime - this.starttime <= GESTURE_TAP_TIMEOUT && !this.tooFarForHold && cr.distanceTo(this.startx, this.starty, this.x, this.y) < GESTURE_HOLD_THRESHOLD)
		{
			inst.trigger_index = this.startindex;
			inst.trigger_id = this["id"];
			inst.getTouchIndex = index;
			if ((nowtime - lastTapTime <= GESTURE_TAP_TIMEOUT * 2) && cr.distanceTo(lastTapX, lastTapY, this.x, this.y) < GESTURE_DOUBLETAP_THRESHOLD)
			{
				inst.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnDoubleTapGesture, inst);
				inst.curTouchX = this.x;
				inst.curTouchY = this.y;
				inst.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnDoubleTapGestureObject, inst);
				lastTapX = -1000;
				lastTapY = -1000;
				lastTapTime = -10000;
			}
			else
			{
				inst.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTapGesture, inst);
				inst.curTouchX = this.x;
				inst.curTouchY = this.y;
				inst.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTapGestureObject, inst);
				lastTapX = this.x;
				lastTapY = this.y;
				lastTapTime = nowtime;
			}
			inst.getTouchIndex = 0;
		}
	};
	instanceProto.onCreate = function()
	{
		theInstance = this;
		this.isWindows8 = !!(typeof window["c2isWindows8"] !== "undefined" && window["c2isWindows8"]);
		this.orient_alpha = 0;
		this.orient_beta = 0;
		this.orient_gamma = 0;
		this.acc_g_x = 0;
		this.acc_g_y = 0;
		this.acc_g_z = 0;
		this.acc_x = 0;
		this.acc_y = 0;
		this.acc_z = 0;
		this.curTouchX = 0;
		this.curTouchY = 0;
		this.trigger_index = 0;
		this.trigger_id = 0;
		this.getTouchIndex = 0;
		this.useMouseInput = (this.properties[0] !== 0);
		var elem = (this.runtime.fullscreen_mode > 0) ? document : this.runtime.canvas;
		var elem2 = document;
		if (this.runtime.isDirectCanvas)
			elem2 = elem = window["Canvas"];
		else if (this.runtime.isCocoonJs)
			elem2 = elem = window;
		var self = this;
		if (window.navigator["pointerEnabled"])
		{
			elem.addEventListener("pointerdown",
				function(info) {
					self.onPointerStart(info);
				},
				false
			);
			elem.addEventListener("pointermove",
				function(info) {
					self.onPointerMove(info);
				},
				false
			);
			elem2.addEventListener("pointerup",
				function(info) {
					self.onPointerEnd(info, false);
				},
				false
			);
			elem2.addEventListener("pointercancel",
				function(info) {
					self.onPointerEnd(info, true);
				},
				false
			);
			if (this.runtime.canvas)
			{
				this.runtime.canvas.addEventListener("MSGestureHold", function(e) {
					e.preventDefault();
				}, false);
				document.addEventListener("MSGestureHold", function(e) {
					e.preventDefault();
				}, false);
				this.runtime.canvas.addEventListener("gesturehold", function(e) {
					e.preventDefault();
				}, false);
				document.addEventListener("gesturehold", function(e) {
					e.preventDefault();
				}, false);
			}
		}
		else if (window.navigator["msPointerEnabled"])
		{
			elem.addEventListener("MSPointerDown",
				function(info) {
					self.onPointerStart(info);
				},
				false
			);
			elem.addEventListener("MSPointerMove",
				function(info) {
					self.onPointerMove(info);
				},
				false
			);
			elem2.addEventListener("MSPointerUp",
				function(info) {
					self.onPointerEnd(info, false);
				},
				false
			);
			elem2.addEventListener("MSPointerCancel",
				function(info) {
					self.onPointerEnd(info, true);
				},
				false
			);
			if (this.runtime.canvas)
			{
				this.runtime.canvas.addEventListener("MSGestureHold", function(e) {
					e.preventDefault();
				}, false);
				document.addEventListener("MSGestureHold", function(e) {
					e.preventDefault();
				}, false);
			}
		}
		else
		{
			elem.addEventListener("touchstart",
				function(info) {
					self.onTouchStart(info);
				},
				false
			);
			elem.addEventListener("touchmove",
				function(info) {
					self.onTouchMove(info);
				},
				false
			);
			elem2.addEventListener("touchend",
				function(info) {
					self.onTouchEnd(info, false);
				},
				false
			);
			elem2.addEventListener("touchcancel",
				function(info) {
					self.onTouchEnd(info, true);
				},
				false
			);
		}
		if (this.isWindows8)
		{
			var win8accelerometerFn = function(e) {
					var reading = e["reading"];
					self.acc_x = reading["accelerationX"];
					self.acc_y = reading["accelerationY"];
					self.acc_z = reading["accelerationZ"];
				};
			var win8inclinometerFn = function(e) {
					var reading = e["reading"];
					self.orient_alpha = reading["yawDegrees"];
					self.orient_beta = reading["pitchDegrees"];
					self.orient_gamma = reading["rollDegrees"];
				};
			var accelerometer = Windows["Devices"]["Sensors"]["Accelerometer"]["getDefault"]();
            if (accelerometer)
			{
                accelerometer["reportInterval"] = Math.max(accelerometer["minimumReportInterval"], 16);
				accelerometer.addEventListener("readingchanged", win8accelerometerFn);
            }
			var inclinometer = Windows["Devices"]["Sensors"]["Inclinometer"]["getDefault"]();
			if (inclinometer)
			{
				inclinometer["reportInterval"] = Math.max(inclinometer["minimumReportInterval"], 16);
				inclinometer.addEventListener("readingchanged", win8inclinometerFn);
			}
			document.addEventListener("visibilitychange", function(e) {
				if (document["hidden"] || document["msHidden"])
				{
					if (accelerometer)
						accelerometer.removeEventListener("readingchanged", win8accelerometerFn);
					if (inclinometer)
						inclinometer.removeEventListener("readingchanged", win8inclinometerFn);
				}
				else
				{
					if (accelerometer)
						accelerometer.addEventListener("readingchanged", win8accelerometerFn);
					if (inclinometer)
						inclinometer.addEventListener("readingchanged", win8inclinometerFn);
				}
			}, false);
		}
		else
		{
			window.addEventListener("deviceorientation", function (eventData) {
				self.orient_alpha = eventData["alpha"] || 0;
				self.orient_beta = eventData["beta"] || 0;
				self.orient_gamma = eventData["gamma"] || 0;
			}, false);
			window.addEventListener("devicemotion", function (eventData) {
				if (eventData["accelerationIncludingGravity"])
				{
					self.acc_g_x = eventData["accelerationIncludingGravity"]["x"] || 0;
					self.acc_g_y = eventData["accelerationIncludingGravity"]["y"] || 0;
					self.acc_g_z = eventData["accelerationIncludingGravity"]["z"] || 0;
				}
				if (eventData["acceleration"])
				{
					self.acc_x = eventData["acceleration"]["x"] || 0;
					self.acc_y = eventData["acceleration"]["y"] || 0;
					self.acc_z = eventData["acceleration"]["z"] || 0;
				}
			}, false);
		}
		if (this.useMouseInput && !this.runtime.isDomFree)
		{
			jQuery(document).mousemove(
				function(info) {
					self.onMouseMove(info);
				}
			);
			jQuery(document).mousedown(
				function(info) {
					self.onMouseDown(info);
				}
			);
			jQuery(document).mouseup(
				function(info) {
					self.onMouseUp(info);
				}
			);
		}
		if (!this.runtime.isiOS && this.runtime.isCordova && navigator["accelerometer"] && navigator["accelerometer"]["watchAcceleration"])
		{
			navigator["accelerometer"]["watchAcceleration"](PhoneGapGetAcceleration, null, { "frequency": 40 });
		}
		this.runtime.tick2Me(this);
	};
	instanceProto.onPointerMove = function (info)
	{
		if (info["pointerType"] === info["MSPOINTER_TYPE_MOUSE"] || info["pointerType"] === "mouse")
			return;
		if (info.preventDefault)
			info.preventDefault();
		var i = this.findTouch(info["pointerId"]);
		var nowtime = cr.performance_now();
		if (i >= 0)
		{
			var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
			var t = this.touches[i];
			if (nowtime - t.time < 2)
				return;
			t.update(nowtime, info.pageX - offset.left, info.pageY - offset.top, info.width || 0, info.height || 0, info.pressure || 0);
		}
	};
	instanceProto.onPointerStart = function (info)
	{
		if (info["pointerType"] === info["MSPOINTER_TYPE_MOUSE"] || info["pointerType"] === "mouse")
			return;
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
		var touchx = info.pageX - offset.left;
		var touchy = info.pageY - offset.top;
		var nowtime = cr.performance_now();
		this.trigger_index = this.touches.length;
		this.trigger_id = info["pointerId"];
		this.touches.push(AllocTouchInfo(touchx, touchy, info["pointerId"], this.trigger_index));
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnNthTouchStart, this);
		this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTouchStart, this);
		this.curTouchX = touchx;
		this.curTouchY = touchy;
		this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTouchObject, this);
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.onPointerEnd = function (info, isCancel)
	{
		if (info["pointerType"] === info["MSPOINTER_TYPE_MOUSE"] || info["pointerType"] === "mouse")
			return;
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		var i = this.findTouch(info["pointerId"]);
		this.trigger_index = (i >= 0 ? this.touches[i].startindex : -1);
		this.trigger_id = (i >= 0 ? this.touches[i]["id"] : -1);
		this.runtime.isInUserInputEvent = true;
		this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnNthTouchEnd, this);
		this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTouchEnd, this);
		if (i >= 0)
		{
			if (!isCancel)
				this.touches[i].maybeTriggerTap(this, i);
			ReleaseTouchInfo(this.touches[i]);
			this.touches.splice(i, 1);
		}
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.onTouchMove = function (info)
	{
		if (info.preventDefault)
			info.preventDefault();
		var nowtime = cr.performance_now();
		var i, len, t, u;
		for (i = 0, len = info.changedTouches.length; i < len; i++)
		{
			t = info.changedTouches[i];
			var j = this.findTouch(t["identifier"]);
			if (j >= 0)
			{
				var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
				u = this.touches[j];
				if (nowtime - u.time < 2)
					continue;
				var touchWidth = (t.radiusX || t.webkitRadiusX || t.mozRadiusX || t.msRadiusX || 0) * 2;
				var touchHeight = (t.radiusY || t.webkitRadiusY || t.mozRadiusY || t.msRadiusY || 0) * 2;
				var touchForce = t.force || t.webkitForce || t.mozForce || t.msForce || 0;
				u.update(nowtime, t.pageX - offset.left, t.pageY - offset.top, touchWidth, touchHeight, touchForce);
			}
		}
	};
	instanceProto.onTouchStart = function (info)
	{
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		var offset = this.runtime.isDomFree ? dummyoffset : jQuery(this.runtime.canvas).offset();
		var nowtime = cr.performance_now();
		this.runtime.isInUserInputEvent = true;
		var i, len, t, j;
		for (i = 0, len = info.changedTouches.length; i < len; i++)
		{
			t = info.changedTouches[i];
			j = this.findTouch(t["identifier"]);
			if (j !== -1)
				continue;
			var touchx = t.pageX - offset.left;
			var touchy = t.pageY - offset.top;
			this.trigger_index = this.touches.length;
			this.trigger_id = t["identifier"];
			this.touches.push(AllocTouchInfo(touchx, touchy, t["identifier"], this.trigger_index));
			this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnNthTouchStart, this);
			this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTouchStart, this);
			this.curTouchX = touchx;
			this.curTouchY = touchy;
			this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTouchObject, this);
		}
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.onTouchEnd = function (info, isCancel)
	{
		if (info.preventDefault && cr.isCanvasInputEvent(info))
			info.preventDefault();
		this.runtime.isInUserInputEvent = true;
		var i, len, t, j;
		for (i = 0, len = info.changedTouches.length; i < len; i++)
		{
			t = info.changedTouches[i];
			j = this.findTouch(t["identifier"]);
			if (j >= 0)
			{
				this.trigger_index = this.touches[j].startindex;
				this.trigger_id = this.touches[j]["id"];
				this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnNthTouchEnd, this);
				this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.OnTouchEnd, this);
				if (!isCancel)
					this.touches[j].maybeTriggerTap(this, j);
				ReleaseTouchInfo(this.touches[j]);
				this.touches.splice(j, 1);
			}
		}
		this.runtime.isInUserInputEvent = false;
	};
	instanceProto.getAlpha = function ()
	{
		if (this.runtime.isCordova && this.orient_alpha === 0 && pg_accz !== 0)
			return pg_accz * 90;
		else
			return this.orient_alpha;
	};
	instanceProto.getBeta = function ()
	{
		if (this.runtime.isCordova && this.orient_beta === 0 && pg_accy !== 0)
			return pg_accy * 90;
		else
			return this.orient_beta;
	};
	instanceProto.getGamma = function ()
	{
		if (this.runtime.isCordova && this.orient_gamma === 0 && pg_accx !== 0)
			return pg_accx * 90;
		else
			return this.orient_gamma;
	};
	var noop_func = function(){};
	instanceProto.onMouseDown = function(info)
	{
		var t = { pageX: info.pageX, pageY: info.pageY, "identifier": 0 };
		var fakeinfo = { changedTouches: [t] };
		this.onTouchStart(fakeinfo);
		this.mouseDown = true;
	};
	instanceProto.onMouseMove = function(info)
	{
		if (!this.mouseDown)
			return;
		var t = { pageX: info.pageX, pageY: info.pageY, "identifier": 0 };
		var fakeinfo = { changedTouches: [t] };
		this.onTouchMove(fakeinfo);
	};
	instanceProto.onMouseUp = function(info)
	{
		if (info.preventDefault && this.runtime.had_a_click && !this.runtime.isMobile)
			info.preventDefault();
		this.runtime.had_a_click = true;
		var t = { pageX: info.pageX, pageY: info.pageY, "identifier": 0 };
		var fakeinfo = { changedTouches: [t] };
		this.onTouchEnd(fakeinfo);
		this.mouseDown = false;
	};
	instanceProto.tick2 = function()
	{
		var i, len, t;
		var nowtime = cr.performance_now();
		for (i = 0, len = this.touches.length; i < len; ++i)
		{
			t = this.touches[i];
			if (t.time <= nowtime - 50)
				t.lasttime = nowtime;
			t.maybeTriggerHold(this, i);
		}
	};
	function Cnds() {};
	Cnds.prototype.OnTouchStart = function ()
	{
		return true;
	};
	Cnds.prototype.OnTouchEnd = function ()
	{
		return true;
	};
	Cnds.prototype.IsInTouch = function ()
	{
		return this.touches.length;
	};
	Cnds.prototype.OnTouchObject = function (type)
	{
		if (!type)
			return false;
		return this.runtime.testAndSelectCanvasPointOverlap(type, this.curTouchX, this.curTouchY, false);
	};
	var touching = [];
	Cnds.prototype.IsTouchingObject = function (type)
	{
		if (!type)
			return false;
		var sol = type.getCurrentSol();
		var instances = sol.getObjects();
		var px, py;
		var i, leni, j, lenj;
		for (i = 0, leni = instances.length; i < leni; i++)
		{
			var inst = instances[i];
			inst.update_bbox();
			for (j = 0, lenj = this.touches.length; j < lenj; j++)
			{
				var touch = this.touches[j];
				px = inst.layer.canvasToLayer(touch.x, touch.y, true);
				py = inst.layer.canvasToLayer(touch.x, touch.y, false);
				if (inst.contains_pt(px, py))
				{
					touching.push(inst);
					break;
				}
			}
		}
		if (touching.length)
		{
			sol.select_all = false;
			cr.shallowAssignArray(sol.instances, touching);
			type.applySolToContainer();
			cr.clearArray(touching);
			return true;
		}
		else
			return false;
	};
	Cnds.prototype.CompareTouchSpeed = function (index, cmp, s)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
			return false;
		var t = this.touches[index];
		var dist = cr.distanceTo(t.x, t.y, t.lastx, t.lasty);
		var timediff = (t.time - t.lasttime) / 1000;
		var speed = 0;
		if (timediff > 0)
			speed = dist / timediff;
		return cr.do_cmp(speed, cmp, s);
	};
	Cnds.prototype.OrientationSupported = function ()
	{
		return typeof window["DeviceOrientationEvent"] !== "undefined";
	};
	Cnds.prototype.MotionSupported = function ()
	{
		return typeof window["DeviceMotionEvent"] !== "undefined";
	};
	Cnds.prototype.CompareOrientation = function (orientation_, cmp_, angle_)
	{
		var v = 0;
		if (orientation_ === 0)
			v = this.getAlpha();
		else if (orientation_ === 1)
			v = this.getBeta();
		else
			v = this.getGamma();
		return cr.do_cmp(v, cmp_, angle_);
	};
	Cnds.prototype.CompareAcceleration = function (acceleration_, cmp_, angle_)
	{
		var v = 0;
		if (acceleration_ === 0)
			v = this.acc_g_x;
		else if (acceleration_ === 1)
			v = this.acc_g_y;
		else if (acceleration_ === 2)
			v = this.acc_g_z;
		else if (acceleration_ === 3)
			v = this.acc_x;
		else if (acceleration_ === 4)
			v = this.acc_y;
		else if (acceleration_ === 5)
			v = this.acc_z;
		return cr.do_cmp(v, cmp_, angle_);
	};
	Cnds.prototype.OnNthTouchStart = function (touch_)
	{
		touch_ = Math.floor(touch_);
		return touch_ === this.trigger_index;
	};
	Cnds.prototype.OnNthTouchEnd = function (touch_)
	{
		touch_ = Math.floor(touch_);
		return touch_ === this.trigger_index;
	};
	Cnds.prototype.HasNthTouch = function (touch_)
	{
		touch_ = Math.floor(touch_);
		return this.touches.length >= touch_ + 1;
	};
	Cnds.prototype.OnHoldGesture = function ()
	{
		return true;
	};
	Cnds.prototype.OnTapGesture = function ()
	{
		return true;
	};
	Cnds.prototype.OnDoubleTapGesture = function ()
	{
		return true;
	};
	Cnds.prototype.OnHoldGestureObject = function (type)
	{
		if (!type)
			return false;
		return this.runtime.testAndSelectCanvasPointOverlap(type, this.curTouchX, this.curTouchY, false);
	};
	Cnds.prototype.OnTapGestureObject = function (type)
	{
		if (!type)
			return false;
		return this.runtime.testAndSelectCanvasPointOverlap(type, this.curTouchX, this.curTouchY, false);
	};
	Cnds.prototype.OnDoubleTapGestureObject = function (type)
	{
		if (!type)
			return false;
		return this.runtime.testAndSelectCanvasPointOverlap(type, this.curTouchX, this.curTouchY, false);
	};
	pluginProto.cnds = new Cnds();
	function Exps() {};
	Exps.prototype.TouchCount = function (ret)
	{
		ret.set_int(this.touches.length);
	};
	Exps.prototype.X = function (ret, layerparam)
	{
		var index = this.getTouchIndex;
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		var layer, oldScale, oldZoomRate, oldParallaxX, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxX = layer.parallaxX;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxX = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, true));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxX = oldParallaxX;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, true));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.XAt = function (ret, index, layerparam)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		var layer, oldScale, oldZoomRate, oldParallaxX, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxX = layer.parallaxX;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxX = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, true));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxX = oldParallaxX;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, true));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.XForID = function (ret, id, layerparam)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		var layer, oldScale, oldZoomRate, oldParallaxX, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxX = layer.parallaxX;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxX = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(touch.x, touch.y, true));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxX = oldParallaxX;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(touch.x, touch.y, true));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.Y = function (ret, layerparam)
	{
		var index = this.getTouchIndex;
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		var layer, oldScale, oldZoomRate, oldParallaxY, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxY = layer.parallaxY;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxY = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, false));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxY = oldParallaxY;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, false));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.YAt = function (ret, index, layerparam)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		var layer, oldScale, oldZoomRate, oldParallaxY, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxY = layer.parallaxY;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxY = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, false));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxY = oldParallaxY;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, false));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.YForID = function (ret, id, layerparam)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		var layer, oldScale, oldZoomRate, oldParallaxY, oldAngle;
		if (cr.is_undefined(layerparam))
		{
			layer = this.runtime.getLayerByNumber(0);
			oldScale = layer.scale;
			oldZoomRate = layer.zoomRate;
			oldParallaxY = layer.parallaxY;
			oldAngle = layer.angle;
			layer.scale = 1;
			layer.zoomRate = 1.0;
			layer.parallaxY = 1.0;
			layer.angle = 0;
			ret.set_float(layer.canvasToLayer(touch.x, touch.y, false));
			layer.scale = oldScale;
			layer.zoomRate = oldZoomRate;
			layer.parallaxY = oldParallaxY;
			layer.angle = oldAngle;
		}
		else
		{
			if (cr.is_number(layerparam))
				layer = this.runtime.getLayerByNumber(layerparam);
			else
				layer = this.runtime.getLayerByName(layerparam);
			if (layer)
				ret.set_float(layer.canvasToLayer(touch.x, touch.y, false));
			else
				ret.set_float(0);
		}
	};
	Exps.prototype.AbsoluteX = function (ret)
	{
		if (this.touches.length)
			ret.set_float(this.touches[0].x);
		else
			ret.set_float(0);
	};
	Exps.prototype.AbsoluteXAt = function (ret, index)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		ret.set_float(this.touches[index].x);
	};
	Exps.prototype.AbsoluteXForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		ret.set_float(touch.x);
	};
	Exps.prototype.AbsoluteY = function (ret)
	{
		if (this.touches.length)
			ret.set_float(this.touches[0].y);
		else
			ret.set_float(0);
	};
	Exps.prototype.AbsoluteYAt = function (ret, index)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		ret.set_float(this.touches[index].y);
	};
	Exps.prototype.AbsoluteYForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		ret.set_float(touch.y);
	};
	Exps.prototype.SpeedAt = function (ret, index)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		var t = this.touches[index];
		var dist = cr.distanceTo(t.x, t.y, t.lastx, t.lasty);
		var timediff = (t.time - t.lasttime) / 1000;
		if (timediff === 0)
			ret.set_float(0);
		else
			ret.set_float(dist / timediff);
	};
	Exps.prototype.SpeedForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		var dist = cr.distanceTo(touch.x, touch.y, touch.lastx, touch.lasty);
		var timediff = (touch.time - touch.lasttime) / 1000;
		if (timediff === 0)
			ret.set_float(0);
		else
			ret.set_float(dist / timediff);
	};
	Exps.prototype.AngleAt = function (ret, index)
	{
		index = Math.floor(index);
		if (index < 0 || index >= this.touches.length)
		{
			ret.set_float(0);
			return;
		}
		var t = this.touches[index];
		ret.set_float(cr.to_degrees(cr.angleTo(t.lastx, t.lasty, t.x, t.y)));
	};
	Exps.prototype.AngleForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		ret.set_float(cr.to_degrees(cr.angleTo(touch.lastx, touch.lasty, touch.x, touch.y)));
	};
	Exps.prototype.Alpha = function (ret)
	{
		ret.set_float(this.getAlpha());
	};
	Exps.prototype.Beta = function (ret)
	{
		ret.set_float(this.getBeta());
	};
	Exps.prototype.Gamma = function (ret)
	{
		ret.set_float(this.getGamma());
	};
	Exps.prototype.AccelerationXWithG = function (ret)
	{
		ret.set_float(this.acc_g_x);
	};
	Exps.prototype.AccelerationYWithG = function (ret)
	{
		ret.set_float(this.acc_g_y);
	};
	Exps.prototype.AccelerationZWithG = function (ret)
	{
		ret.set_float(this.acc_g_z);
	};
	Exps.prototype.AccelerationX = function (ret)
	{
		ret.set_float(this.acc_x);
	};
	Exps.prototype.AccelerationY = function (ret)
	{
		ret.set_float(this.acc_y);
	};
	Exps.prototype.AccelerationZ = function (ret)
	{
		ret.set_float(this.acc_z);
	};
	Exps.prototype.TouchIndex = function (ret)
	{
		ret.set_int(this.trigger_index);
	};
	Exps.prototype.TouchID = function (ret)
	{
		ret.set_float(this.trigger_id);
	};
	Exps.prototype.WidthForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		ret.set_float(touch.width);
	};
	Exps.prototype.HeightForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		ret.set_float(touch.height);
	};
	Exps.prototype.PressureForID = function (ret, id)
	{
		var index = this.findTouch(id);
		if (index < 0)
		{
			ret.set_float(0);
			return;
		}
		var touch = this.touches[index];
		ret.set_float(touch.pressure);
	};
	pluginProto.exps = new Exps();
}());
/**
 * flood fill algorithm
 * image_data is an array with pixel information as provided in canvas_context.data
 * (x, y) is starting point and color is the color used to replace old color
 */
function flood_fill(image_data, canvas_width, canvas_height, x, y, _color) {
	if (x<0 || x>canvas_width){		return;}
	if (y<0 || y>canvas_height){	return;}
	var color = $('<div></div>').css('background-color', _color).css('background-color');
    if(color == "transparent")
        color="rgb(0,0,0)";
    color=color.slice(4,-1).split(",");
    var components = 4; //rgba
    var  fillColorR = color[0];
    var  fillColorG = color[1];
    var  fillColorB = color[2];
    var pixel_pos = (y*canvas_width + x) * components;
    var startR = image_data[pixel_pos];
    var startG = image_data[pixel_pos + 1];
    var startB = image_data[pixel_pos + 2];
    if(fillColorR==startR && fillColorG==startG && fillColorB==startB)
        return;  //prevent inf loop.
    function matchStartColor(pixel_pos) {
      return startR == image_data[pixel_pos] &&
             startG == image_data[pixel_pos+1] &&
             startB == image_data[pixel_pos+2];
    }
    function colorPixel(pixel_pos) {
      image_data[pixel_pos] = fillColorR;
      image_data[pixel_pos+1] = fillColorG;
      image_data[pixel_pos+2] = fillColorB;
      image_data[pixel_pos+3] = 255;
    }
    function trace(dir) {
        if(matchStartColor(pixel_pos + dir*components)) {
          if(!sides[dir]) {
            pixelStack.push([x + dir, y]);
            sides[dir]= true;
          }
        }
        else if(sides[dir]) {
          sides[dir]= false;
        }
    }
    var pixelStack = [[x, y]];
    while(pixelStack.length)
    {
      var newPos, x, y, pixel_pos, reachLeft, reachRight;
      newPos = pixelStack.pop();
      x = newPos[0];
      y = newPos[1];
      pixel_pos = (y*canvas_width + x) * components;
      while(y-- >= 0 && matchStartColor(pixel_pos))
      {
        pixel_pos -= canvas_width * components;
      }
      pixel_pos += canvas_width * components;
      ++y;
      var sides = [];
      sides[-1] = false;
      sides[1] = false;
      while(y++ < canvas_height-1 && matchStartColor(pixel_pos)) {
        colorPixel(pixel_pos);
        if(x > 0) {
            trace(-1);
        }
        if(x < canvas_width-1) {
            trace(1);
        }
        pixel_pos += canvas_width * components;
      }
    }
}
;
;
cr.plugins_.c2canvas = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var pluginProto = cr.plugins_.c2canvas.prototype;
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	var typeProto = pluginProto.Type.prototype;
	typeProto.onCreate = function()
	{
		if (this.is_family)
			return;
		this.texture_img = new Image();
		this.texture_img.src = this.texture_file;
		this.texture_img.cr_filesize = this.texture_filesize;
		this.runtime.wait_for_textures.push(this.texture_img);
	};
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	var instanceProto = pluginProto.Instance.prototype;
	var fxNames = [ "lighter",
					"xor",
					"copy",
					"destination-over",
					"source-in",
					"destination-in",
					"source-out",
					"destination-out",
					"source-atop",
					"destination-atop"];
	instanceProto.effectToCompositeOp = function(effect)
	{
		if (effect <= 0 || effect >= 11)
			return "source-over";
		return fxNames[effect - 1];	// not including "none" so offset by 1
	};
	instanceProto.updateBlend = function(effect)
	{
		var gl = this.runtime.gl;
		if (!gl)
			return;
		this.srcBlend = gl.ONE;
		this.destBlend = gl.ONE_MINUS_SRC_ALPHA;
		switch (effect) {
		case 1:		// lighter (additive)
			this.srcBlend = gl.ONE;
			this.destBlend = gl.ONE;
			break;
		case 2:		// xor
			break;	// todo
		case 3:		// copy
			this.srcBlend = gl.ONE;
			this.destBlend = gl.ZERO;
			break;
		case 4:		// destination-over
			this.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this.destBlend = gl.ONE;
			break;
		case 5:		// source-in
			this.srcBlend = gl.DST_ALPHA;
			this.destBlend = gl.ZERO;
			break;
		case 6:		// destination-in
			this.srcBlend = gl.ZERO;
			this.destBlend = gl.SRC_ALPHA;
			break;
		case 7:		// source-out
			this.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this.destBlend = gl.ZERO;
			break;
		case 8:		// destination-out
			this.srcBlend = gl.ZERO;
			this.destBlend = gl.ONE_MINUS_SRC_ALPHA;
			break;
		case 9:		// source-atop
			this.srcBlend = gl.DST_ALPHA;
			this.destBlend = gl.ONE_MINUS_SRC_ALPHA;
			break;
		case 10:	// destination-atop
			this.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this.destBlend = gl.SRC_ALPHA;
			break;
		}
	};
	instanceProto.onCreate = function()
	{
		this.visible = (this.properties[0] === 0);							// 0=visible, 1=invisible
		this.compositeOp = this.effectToCompositeOp(this.properties[1]);
		this.updateBlend(this.properties[1]);
		this.canvas = document.createElement('canvas');
		this.canvas.width=this.width;
		this.canvas.height=this.height;
		this.ctx = this.canvas.getContext('2d');
		this.ctx.drawImage(this.type.texture_img,0,0,this.width,this.height);
		this.tCanvas = document.createElement('canvas');
		this.tCtx = this.tCanvas.getContext('2d');
        this.update_tex = true;
		this.rcTex = new cr.rect(0, 0, 0, 0);
	};
	instanceProto.onDestroy = function ()
	{
	};
	instanceProto.saveToJSON = function ()
	{
		return {
            "canvas_w":this.canvas.width,
            "canvas_h":this.canvas.height,
            "image":this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height).data
		};
	};
	instanceProto.loadFromJSON = function (o)
	{
        var canvasWidth = this.canvas.width = o["canvas_w"];
        var canvasHeight = this.canvas.height = o["canvas_h"];
        var data = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height).data;
        for (var y = 0; y < canvasHeight; ++y) {
            for (var x = 0; x < canvasWidth; ++x) {
                var index = (y * canvasWidth + x)*4;
                for (var c = 0; c < 4; ++c)
                data[index+c] = o["image"][index+c];
            }
        }
	};
	instanceProto.draw_instances = function (instances, ctx)
    {
        for(var x in instances)
        {
            if(instances[x].visible==false && this.runtime.testOverlap(this, instances[x])== false)
                continue;
            ctx.save();
            ctx.scale(this.canvas.width/this.width, this.canvas.height/this.height);
            ctx.rotate(-this.angle);
            ctx.translate(-this.bquad.tlx, -this.bquad.tly);
            ctx.globalCompositeOperation = instances[x].compositeOp;//rojo
            if (instances[x].type.pattern !== undefined && instances[x].type.texture_img !== undefined) {
                instances[x].pattern = ctx.createPattern(instances[x].type.texture_img, "repeat");
            }
            instances[x].draw(ctx);
            ctx.restore();
        }
    };
	instanceProto.draw = function(ctx)
	{
		ctx.save();
		ctx.globalAlpha = this.opacity;
		ctx.globalCompositeOperation = this.compositeOp;
		var myx = this.x;
		var myy = this.y;
		if (this.runtime.pixel_rounding)
		{
			myx = Math.round(myx);
			myy = Math.round(myy);
		}
		ctx.translate(myx, myy);
		ctx.rotate(this.angle);
		ctx.drawImage(this.canvas,
						  0 - (this.hotspotX * this.width),
						  0 - (this.hotspotY * this.height),
						  this.width,
						  this.height);
		ctx.restore();
	};
	instanceProto.drawGL = function(glw)
	{
		glw.setBlend(this.srcBlend, this.destBlend);
        if (this.update_tex)
        {
            if (this.tex)
                glw.deleteTexture(this.tex);
            this.tex=glw.loadTexture(this.canvas, false, this.runtime.linearSampling);
            this.update_tex = false;
        }
		glw.setTexture(this.tex);
		glw.setOpacity(this.opacity);
		var q = this.bquad;
		if (this.runtime.pixel_rounding)
		{
			var ox = Math.round(this.x) - this.x;
			var oy = Math.round(this.y) - this.y;
			glw.quad(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy);
		}
		else
			glw.quad(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly);
	};
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;
	pluginProto.acts = {};
	var acts = pluginProto.acts;
	acts.SetEffect = function (effect)
	{
		this.compositeOp = this.effectToCompositeOp(effect);
		this.runtime.redraw = true;
        this.update_tex = true;
	};
	acts.DrawPoint = function (x,y, color)
	{
		var ctx=this.ctx;
		ctx.fillStyle = color;
		ctx.fillRect(x,y,1,1);
		this.runtime.redraw = true;
        this.update_tex = true;
	};
	acts.ResizeCanvas = function (width, height)
	{
		this.canvas.width=width;
		this.canvas.height=height;
		this.runtime.redraw = true;
        this.update_tex = true;
	};
	acts.PasteObject = function (object)
	{
		var ctx=this.ctx;
		this.update_bbox();
		var sol = object.getCurrentSol();
		var instances;
		if (sol.select_all)
			instances = sol.type.instances;
		else
			instances = sol.instances;
		this.draw_instances(instances, ctx);
		this.runtime.redraw = true;
        this.update_tex = true;
	};
	acts.PasteLayer = function (layer)
	{
		if (!layer || !layer.visible)
			return false;
		var ctx=this.ctx;
		this.update_bbox();
		this.tCanvas.width=this.canvas.width;
		this.tCanvas.height=this.canvas.height;
 		var t=this.tCtx;
		t.clearRect(0,0,this.tCanvas.width, this.tCanvas.height);
		this.draw_instances(layer.instances, t);
		ctx.drawImage(this.tCanvas,0,0,this.width,this.height);
		this.runtime.redraw = true;
        this.update_tex = true;
	};
	acts.DrawBox = function (x, y, width, height, color)
	{
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x,y,width,height);
		this.runtime.redraw = true;
        this.update_tex = true;
	};
	acts.DrawLine = function (x1, y1, x2, y2, color, line_width)
	{
		var ctx = this.ctx;
		ctx.strokeStyle = color;
		ctx.lineWidth = line_width;
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
		this.runtime.redraw = true;
        this.update_tex = true;
	};
	acts.ClearCanvas = function ()
	{
		this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
		this.runtime.redraw = true;
        this.update_tex = true;
	};
	acts.FillColor = function (color)
	{
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
		this.runtime.redraw = true;
        this.update_tex = true;
	};
	acts.fillGradient = function (gradient_style, color1, color2)
	{
		var ctx = this.ctx;
		var w =this.canvas.width;
		var h=this.canvas.height;
		var gradient;
		switch(gradient_style)
		{
		case 0: //horizontal
			gradient = ctx.createLinearGradient(0,0,w,0);
			break;
		case 1: //vertical
			gradient = ctx.createLinearGradient(0,0,0,h);
			break;
		case 2: //diagonal_down_right
			gradient = ctx.createLinearGradient(0,0,w,h);
			break;
		case 3: //diagonal_down_left
			gradient = ctx.createLinearGradient(w,0,0,h);
			break;
		case 4: //radial
			gradient = ctx.createRadialGradient(w/2,h/2,0,w/2,h/2, Math.sqrt(w*w+h*h)/2);
			break;
		}
        try{
            gradient.addColorStop(0, color1);
        }catch(e){
            gradient.addColorStop(0, "black");
        }
        try{
            gradient.addColorStop(1, color2);
        }catch(e){
            gradient.addColorStop(1, "black");
        }
		this.ctx.fillStyle = gradient;
		this.ctx.fillRect(0, 0, w, h);
		this.runtime.redraw = true;
        this.update_tex = true;
	};
	acts.beginPath = function ()
	{
		this.ctx.beginPath();
	};
	acts.drawPath = function (color, line_width)
	{
		var ctx = this.ctx;
		ctx.strokeStyle = color;
		ctx.lineWidth = line_width;
		ctx.stroke();
		this.runtime.redraw = true;
        this.update_tex = true;
	};
	acts.setLineSettings = function (line_cap, line_joint)
	{
		var ctx = this.ctx;
		ctx.lineCap = ["butt","round","square"][line_cap];
		ctx.lineJoin = ["round","bevel","milet"][line_joint];
	};
	acts.fillPath = function (color)
	{
		this.ctx.fillStyle = color;
		this.ctx.fill();
		this.runtime.redraw = true;
        this.update_tex = true;
	};
	acts.moveTo = function (x, y)
	{
		this.ctx.moveTo(x, y);
	};
	acts.lineTo = function (x, y)
	{
		this.ctx.lineTo(x, y);
	};
	acts.arc = function (x, y, radius, start_angle, end_angle, arc_direction)
	{
		this.ctx.arc(x, y, radius, cr.to_radians(start_angle), cr.to_radians(end_angle), arc_direction==1);
	};
	acts.drawCircle = function (x, y, radius, color, line_width)
	{
		var ctx = this.ctx;
		ctx.strokeStyle = color;
		ctx.lineWidth = line_width;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, cr.to_radians(360), true);
		ctx.stroke();
		this.runtime.redraw = true;
        this.update_tex = true;
	};
	acts.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y)
	{
		this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
	};
	acts.quadraticCurveTo = function (cpx, cpy, x, y)
	{
		this.ctx.quadraticCurveTo(cpx, cpy, x, y);
	};
	acts.rectPath = function (x, y, width, height)
	{
		this.ctx.rect(x,y,width,height);
	};
	acts.FloodFill= function (x,y,color)
	{
		var ctx = this.ctx;
		var I = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		flood_fill(I.data, this.canvas.width, this.canvas.height, x, y, color);
		ctx.putImageData(I,0,0);
		this.runtime.redraw = true;
        this.update_tex = true;
	};
	acts.setLineDash = function (dash_width, space_width)
	{
		var dashArr = [dash_width, space_width];
		this.ctx.setLineDash(dashArr);
	};
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	exps.rgbaAt = function (ret, x, y)
	{
		var imageData= this.ctx.getImageData(x,y,1,1);
		var data= imageData.data;
		ret.set_string("rgba(" + data[0] + "," + data[1] + "," + data[2] + "," + data[3]/255 + ")");
	};
    exps.redAt = function (ret, x, y)
	{
		var imageData= this.ctx.getImageData(x,y,1,1);
		var data= imageData.data;
		ret.set_int(data[0]);
	};
    exps.greenAt = function (ret, x, y)
	{
		var imageData= this.ctx.getImageData(x,y,1,1);
		var data= imageData.data;
		ret.set_int(data[1]);
	};
    exps.blueAt = function (ret, x, y)
	{
		var imageData= this.ctx.getImageData(x,y,1,1);
		var data= imageData.data;
		ret.set_int(data[2]);
	};
    exps.alphaAt = function (ret, x, y)
	{
		var imageData= this.ctx.getImageData(x,y,1,1);
		var data= imageData.data;
		ret.set_int(data[3]*100/255);
	};
	exps.imageUrl = function (ret)
	{
		ret.set_string(this.canvas.toDataURL());
	};
    exps.AsJSON = function(ret)
    {
        ret.set_string( JSON.stringify({
			"c2array": true,
			"size": [1, 1, this.canvas.width * this.canvas.height * 4],
			"data": [[this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data]]
		}));
    };
}());
var Box2D = {};
Box2D.Dynamics         = {};
Box2D.Dynamics.Joints  = {};
Box2D.Common           = {};
Box2D.Common.Math      = {};
Box2D.Collision        = {};
Box2D.Collision.Shapes = {};
function c2inherit(derived, base)
{
	for (var i in base.prototype)
	{
		if (base.prototype.hasOwnProperty(i))
			derived.prototype[i] = base.prototype[i];
	}
};
Box2D.Collision.b2Collision = {};
Box2D.Collision.b2Distance = {};
Box2D.Common.b2Settings = {};
Box2D.Common.Math.b2Math = {};
Box2D.Consts = {};
Box2D.Dynamics.Contacts = {};
Box2D.Dynamics.Controllers = {};
/**
 * Creates a callback function
 * @param {!Object} context The context ('this' variable) of the callback function
 * @param {function(...[*])} fn The function to execute with the given context for the returned callback
 * @return {function()} The callback function
 */
Box2D.generateCallback = function(context, fn) {
	return function() {
		fn.apply(context, arguments);
	};
};
/**
 * @type {number}
 * @const
 */
Box2D.Consts.MIN_VALUE_SQUARED = Number.MIN_VALUE * Number.MIN_VALUE;
/**
 * @param {number} friction1
 * @param {number} friction2
 */
Box2D.Common.b2Settings.b2MixFriction = function (friction1, friction2) {
	return Math.sqrt(friction1 * friction2);
};
/**
 * @param {number} restitution1
 * @param {number} restitution2
 */
Box2D.Common.b2Settings.b2MixRestitution = function (restitution1, restitution2) {
	return restitution1 > restitution2 ? restitution1 : restitution2;
};
Box2D.Common.b2Settings.VERSION = "2.1alpha-illandril";
Box2D.Common.b2Settings.USHRT_MAX = 0x0000ffff;
Box2D.Common.b2Settings.b2_maxManifoldPoints = 2;
Box2D.Common.b2Settings.b2_aabbExtension = 0.1;
Box2D.Common.b2Settings.b2_aabbMultiplier = 2.0;
Box2D.Common.b2Settings.b2_polygonRadius = 2.0 * Box2D.Common.b2Settings.b2_linearSlop;
Box2D.Common.b2Settings.b2_linearSlop = 0.005;
Box2D.Common.b2Settings.b2_angularSlop = 2.0 / 180.0 * Math.PI;
Box2D.Common.b2Settings.b2_toiSlop = 8.0 * Box2D.Common.b2Settings.b2_linearSlop;
Box2D.Common.b2Settings.b2_maxTOIContactsPerIsland = 32;
Box2D.Common.b2Settings.b2_maxTOIJointsPerIsland = 32;
Box2D.Common.b2Settings.b2_velocityThreshold = 1.0;
Box2D.Common.b2Settings.b2_maxLinearCorrection = 0.2;
Box2D.Common.b2Settings.b2_maxAngularCorrection = 8.0 / 180.0 * Math.PI;
Box2D.Common.b2Settings.b2_maxTranslation = 2.0;
Box2D.Common.b2Settings.b2_maxTranslationSquared = Box2D.Common.b2Settings.b2_maxTranslation * Box2D.Common.b2Settings.b2_maxTranslation;
Box2D.Common.b2Settings.b2_maxRotation = 0.5 * Math.PI;
Box2D.Common.b2Settings.b2_maxRotationSquared = Box2D.Common.b2Settings.b2_maxRotation * Box2D.Common.b2Settings.b2_maxRotation;
Box2D.Common.b2Settings.b2_contactBaumgarte = 0.2;
Box2D.Common.b2Settings.b2_timeToSleep = 0.5;
Box2D.Common.b2Settings.b2_linearSleepTolerance = 0.01;
Box2D.Common.b2Settings.b2_linearSleepToleranceSquared = Box2D.Common.b2Settings.b2_linearSleepTolerance * Box2D.Common.b2Settings.b2_linearSleepTolerance;
Box2D.Common.b2Settings.b2_angularSleepTolerance = 2.0 / 180.0 * Math.PI;
Box2D.Common.b2Settings.b2_angularSleepToleranceSquared = Box2D.Common.b2Settings.b2_angularSleepTolerance * Box2D.Common.b2Settings.b2_angularSleepTolerance;
Box2D.Common.b2Settings.MIN_VALUE_SQUARED = Number.MIN_VALUE * Number.MIN_VALUE;
/**
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @param {!Box2D.Common.Math.b2Vec2} b
 * @return {number}
 */
Box2D.Common.Math.b2Math.Dot = function (a, b) {
  return a.x * b.x + a.y * b.y;
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @param {!Box2D.Common.Math.b2Vec2} b
 * @return {number}
 */
Box2D.Common.Math.b2Math.CrossVV = function (a, b) {
  return a.x * b.y - a.y * b.x;
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @param {number} s
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.CrossVF = function (a, s) {
  return Box2D.Common.Math.b2Vec2.Get(s * a.y, (-s * a.x));
};
/**
 * @param {number} s
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.CrossFV = function (s, a) {
  return Box2D.Common.Math.b2Vec2.Get((-s * a.y), s * a.x);
};
/**
 * @param {!Box2D.Common.Math.b2Mat22} A
 * @param {!Box2D.Common.Math.b2Vec2} v
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.MulMV = function (A, v) {
  return Box2D.Common.Math.b2Vec2.Get(A.col1.x * v.x + A.col2.x * v.y, A.col1.y * v.x + A.col2.y * v.y);
};
/**
 * @param {!Box2D.Common.Math.b2Mat22} A
 * @param {!Box2D.Common.Math.b2Vec2} v
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.MulTMV = function (A, v) {
  return Box2D.Common.Math.b2Vec2.Get(Box2D.Common.Math.b2Math.Dot(v, A.col1), Box2D.Common.Math.b2Math.Dot(v, A.col2));
};
/**
 * @param {!Box2D.Common.Math.b2Transform} T
 * @param {!Box2D.Common.Math.b2Vec2} v
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.MulX = function (T, v) {
  var a = Box2D.Common.Math.b2Math.MulMV(T.R, v);
  a.x += T.position.x;
  a.y += T.position.y;
  return a;
};
/**
 * @param {!Box2D.Common.Math.b2Transform} T
 * @param {!Box2D.Common.Math.b2Vec2} v
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.MulXT = function (T, v) {
  var a = Box2D.Common.Math.b2Math.SubtractVV(v, T.position);
  var tX = (a.x * T.R.col1.x + a.y * T.R.col1.y);
  a.y = (a.x * T.R.col2.x + a.y * T.R.col2.y);
  a.x = tX;
  return a;
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @param {!Box2D.Common.Math.b2Vec2} b
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.AddVV = function (a, b) {
  return Box2D.Common.Math.b2Vec2.Get(a.x + b.x, a.y + b.y);
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @param {!Box2D.Common.Math.b2Vec2} b
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.SubtractVV = function (a, b) {
  return Box2D.Common.Math.b2Vec2.Get(a.x - b.x, a.y - b.y);
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @param {!Box2D.Common.Math.b2Vec2} b
 * @return {number}
 */
Box2D.Common.Math.b2Math.Distance = function (a, b) {
  var cX = a.x - b.x;
  var cY = a.y - b.y;
  return Math.sqrt(Box2D.Common.Math.b2Math.DistanceSquared(a,b));
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @param {!Box2D.Common.Math.b2Vec2} b
 * @return {number}
 */
Box2D.Common.Math.b2Math.DistanceSquared = function (a, b) {
  var cX = a.x - b.x;
  var cY = a.y - b.y;
  return (cX * cX + cY * cY);
};
/**
 * @param {number} s
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.MulFV = function (s, a) {
  return Box2D.Common.Math.b2Vec2.Get(s * a.x, s * a.y);
};
/**
 * @param {!Box2D.Common.Math.b2Mat22} A
 * @param {!Box2D.Common.Math.b2Mat22} B
 * @return {!Box2D.Common.Math.b2Mat22}
 */
Box2D.Common.Math.b2Math.AddMM = function (A, B) {
  return Box2D.Common.Math.b2Mat22.FromVV(Box2D.Common.Math.b2Math.AddVV(A.col1, B.col1), Box2D.Common.Math.b2Math.AddVV(A.col2, B.col2));
};
/**
 * @param {!Box2D.Common.Math.b2Mat22} A
 * @param {!Box2D.Common.Math.b2Mat22} B
 * @return {!Box2D.Common.Math.b2Mat22}
 */
Box2D.Common.Math.b2Math.MulMM = function (A, B) {
  return Box2D.Common.Math.b2Mat22.FromVV(Box2D.Common.Math.b2Math.MulMV(A, B.col1), Box2D.Common.Math.b2Math.MulMV(A, B.col2));
};
/**
 * @param {!Box2D.Common.Math.b2Mat22} A
 * @param {!Box2D.Common.Math.b2Mat22} B
 * @return {!Box2D.Common.Math.b2Mat22}
 */
Box2D.Common.Math.b2Math.MulTMM = function (A, B) {
  var c1 = Box2D.Common.Math.b2Vec2.Get(Box2D.Common.Math.b2Math.Dot(A.col1, B.col1), Box2D.Common.Math.b2Math.Dot(A.col2, B.col1));
  var c2 = Box2D.Common.Math.b2Vec2.Get(Box2D.Common.Math.b2Math.Dot(A.col1, B.col2), Box2D.Common.Math.b2Math.Dot(A.col2, B.col2));
  return Box2D.Common.Math.b2Mat22.FromVV(c1, c2);
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.AbsV = function (a) {
  return Box2D.Common.Math.b2Vec2.Get(Math.abs(a.x), Math.abs(a.y));
};
/**
 * @param {!Box2D.Common.Math.b2Mat22} A
 * @return {!Box2D.Common.Math.b2Mat22}
 */
Box2D.Common.Math.b2Math.AbsM = function (A) {
  return Box2D.Common.Math.b2Mat22.FromVV(Box2D.Common.Math.b2Math.AbsV(A.col1), Box2D.Common.Math.b2Math.AbsV(A.col2));
};
/**
 * @param {number} a
 * @param {number} low
 * @param {number} high
 * @return {number}
 */
Box2D.Common.Math.b2Math.Clamp = function (a, low, high) {
  return a < low ? low : a > high ? high : a;
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} a
 * @param {!Box2D.Common.Math.b2Vec2} low
 * @param {!Box2D.Common.Math.b2Vec2} high
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Math.ClampV = function (a, low, high) {
	var x = Box2D.Common.Math.b2Math.Clamp(a.x, low.x, high.x);
	var y = Box2D.Common.Math.b2Math.Clamp(a.y, low.y, high.y);
  return Box2D.Common.Math.b2Vec2.Get(x, y);
};
/**
 * @constructor
 */
Box2D.Common.Math.b2Mat22 = function() {
	this.col1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.col2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.SetIdentity();
};
/**
 * @param {number} angle
 * @return {!Box2D.Common.Math.b2Mat22}
 */
Box2D.Common.Math.b2Mat22.FromAngle = function(angle) {
	var mat = new Box2D.Common.Math.b2Mat22();
	mat.Set(angle);
	return mat;
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} c1
 * @param {!Box2D.Common.Math.b2Vec2} c2
 * @return {!Box2D.Common.Math.b2Mat22}
 */
Box2D.Common.Math.b2Mat22.FromVV = function(c1, c2) {
	var mat = new Box2D.Common.Math.b2Mat22();
	mat.SetVV(c1, c2);
	return mat;
};
/**
 * @param {number} angle
 */
Box2D.Common.Math.b2Mat22.prototype.Set = function(angle) {
	var c = Math.cos(angle);
	var s = Math.sin(angle);
	this.col1.Set(c, s);
	this.col2.Set(-s, c);
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} c1
 * @param {!Box2D.Common.Math.b2Vec2} c2
 */
Box2D.Common.Math.b2Mat22.prototype.SetVV = function(c1, c2) {
	this.col1.SetV(c1);
	this.col2.SetV(c2);
};
/**
 * @return {!Box2D.Common.Math.b2Mat22}
 */
Box2D.Common.Math.b2Mat22.prototype.Copy = function() {
	var mat = new Box2D.Common.Math.b2Mat22();
	mat.SetM(this);
	return mat;
};
/**
 * @param {!Box2D.Common.Math.b2Mat22} m
 */
Box2D.Common.Math.b2Mat22.prototype.SetM = function(m) {
	this.col1.SetV(m.col1);
	this.col2.SetV(m.col2);
};
/**
 * @param {!Box2D.Common.Math.b2Mat22} m
 */
Box2D.Common.Math.b2Mat22.prototype.AddM = function(m) {
	this.col1.Add(m.col1);
	this.col2.Add(m.col2);
};
Box2D.Common.Math.b2Mat22.prototype.SetIdentity = function() {
	this.col1.Set(1, 0);
	this.col2.Set(0, 1);
};
Box2D.Common.Math.b2Mat22.prototype.SetZero = function() {
	this.col1.Set(0, 0);
	this.col2.Set(0, 0);
};
/**
 * @return {number}
 */
Box2D.Common.Math.b2Mat22.prototype.GetAngle = function() {
	return Math.atan2(this.col1.y, this.col1.x);
};
/**
 * @param {!Box2D.Common.Math.b2Mat22} out
 * @return {!Box2D.Common.Math.b2Mat22}
 */
Box2D.Common.Math.b2Mat22.prototype.GetInverse = function(out) {
	var det = this.col1.x * this.col2.y - this.col2.x * this.col1.y;
	if (det !== 0) {
		det = 1 / det;
	}
	out.col1.x = det * this.col2.y;
	out.col2.x = -det * this.col2.x;
	out.col1.y = -det * this.col1.y;
	out.col2.y = det * this.col1.x;
	return out;
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} out
 * @param {number} bX
 * @param {number} bY
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Mat22.prototype.Solve = function(out, bX, bY) {
	var det = this.col1.x * this.col2.y - this.col2.x * this.col1.y;
	if (det !== 0) {
		det = 1 / det;
	}
	out.x = det * (this.col2.y * bX - this.col2.x * bY);
	out.y = det * (this.col1.x * bY - this.col1.y * bX);
	return out;
};
Box2D.Common.Math.b2Mat22.prototype.Abs = function() {
	this.col1.Abs();
	this.col2.Abs();
};
/**
 * @param {!Box2D.Common.Math.b2Vec3=} c1
 * @param {!Box2D.Common.Math.b2Vec3=} c2
 * @param {!Box2D.Common.Math.b2Vec3=} c3
 * @constructor
 */
Box2D.Common.Math.b2Mat33 = function(c1, c2, c3) {
	this.col1 = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	this.col2 = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	this.col3 = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	if (c1) {
		this.col1.SetV(c1);
	}
	if (c2) {
		this.col2.SetV(c2);
	}
	if (c3) {
		this.col3.SetV(c3);
	}
};
/**
 * @param {!Box2D.Common.Math.b2Vec3} c1
 * @param {!Box2D.Common.Math.b2Vec3} c2
 * @param {!Box2D.Common.Math.b2Vec3} c3
 */
Box2D.Common.Math.b2Mat33.prototype.SetVVV = function(c1, c2, c3) {
	this.col1.SetV(c1);
	this.col2.SetV(c2);
	this.col3.SetV(c3);
};
/**
 * @return {!Box2D.Common.Math.b2Mat33}
 */
Box2D.Common.Math.b2Mat33.prototype.Copy = function() {
	return new Box2D.Common.Math.b2Mat33(this.col1, this.col2, this.col3);
};
/**
 * @param {!Box2D.Common.Math.b2Mat33} m
 */
Box2D.Common.Math.b2Mat33.prototype.SetM = function(m) {
	this.col1.SetV(m.col1);
	this.col2.SetV(m.col2);
	this.col3.SetV(m.col3);
};
/**
 * @param {!Box2D.Common.Math.b2Mat33} m
 */
Box2D.Common.Math.b2Mat33.prototype.AddM = function(m) {
	this.col1.x += m.col1.x;
	this.col1.y += m.col1.y;
	this.col1.z += m.col1.z;
	this.col2.x += m.col2.x;
	this.col2.y += m.col2.y;
	this.col2.z += m.col2.z;
	this.col3.x += m.col3.x;
	this.col3.y += m.col3.y;
	this.col3.z += m.col3.z;
};
Box2D.Common.Math.b2Mat33.prototype.SetIdentity = function() {
	this.col1.Set(1,0,0);
	this.col2.Set(0,1,0);
	this.col3.Set(0,0,1);
};
Box2D.Common.Math.b2Mat33.prototype.SetZero = function() {
	this.col1.Set(0,0,0);
	this.col2.Set(0,0,0);
	this.col3.Set(0,0,0);
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} out
 * @param {number} bX
 * @param {number} bY
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Mat33.prototype.Solve22 = function(out, bX, bY) {
	var a11 = this.col1.x;
	var a12 = this.col2.x;
	var a21 = this.col1.y;
	var a22 = this.col2.y;
	var det = a11 * a22 - a12 * a21;
	if (det != 0.0) {
		det = 1.0 / det;
	}
	out.x = det * (a22 * bX - a12 * bY);
	out.y = det * (a11 * bY - a21 * bX);
	return out;
};
/**
 * @param {!Box2D.Common.Math.b2Vec3} out
 * @param {number} bX
 * @param {number} bY
 * @param {number} bZ
 * @return {!Box2D.Common.Math.b2Vec3}
 */
Box2D.Common.Math.b2Mat33.prototype.Solve33 = function(out, bX, bY, bZ) {
	var a11 = this.col1.x;
	var a21 = this.col1.y;
	var a31 = this.col1.z;
	var a12 = this.col2.x;
	var a22 = this.col2.y;
	var a32 = this.col2.z;
	var a13 = this.col3.x;
	var a23 = this.col3.y;
	var a33 = this.col3.z;
	var det = a11 * (a22 * a33 - a32 * a23) + a21 * (a32 * a13 - a12 * a33) + a31 * (a12 * a23 - a22 * a13);
	if (det != 0.0) {
		det = 1.0 / det;
	}
	out.x = det * (bX * (a22 * a33 - a32 * a23) + bY * (a32 * a13 - a12 * a33) + bZ * (a12 * a23 - a22 * a13));
	out.y = det * (a11 * (bY * a33 - bZ * a23) + a21 * (bZ * a13 - bX * a33) + a31 * (bX * a23 - bY * a13));
	out.z = det * (a11 * (a22 * bZ - a32 * bY) + a21 * (a32 * bX - a12 * bZ) + a31 * (a12 * bY - a22 * bX));
	return out;
}
/**
 * @constructor
 */
Box2D.Common.Math.b2Sweep = function() {
	this.localCenter = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.c0 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.c = Box2D.Common.Math.b2Vec2.Get(0, 0);
};
Box2D.Common.Math.b2Sweep.prototype.Set = function(other) {
	this.localCenter.SetV(other.localCenter);
	this.c0.SetV(other.c0);
	this.c.SetV(other.c);
	this.a0 = other.a0;
	this.a = other.a;
	this.t0 = other.t0;
};
Box2D.Common.Math.b2Sweep.prototype.Copy = function() {
	var copy = new Box2D.Common.Math.b2Sweep();
	copy.localCenter.SetV(this.localCenter);
	copy.c0.SetV(this.c0);
	copy.c.SetV(this.c);
	copy.a0 = this.a0;
	copy.a = this.a;
	copy.t0 = this.t0;
	return copy;
};
Box2D.Common.Math.b2Sweep.prototype.GetTransform = function(xf, alpha) {
	if (alpha === undefined) alpha = 0;
	xf.position.x = (1.0 - alpha) * this.c0.x + alpha * this.c.x;
	xf.position.y = (1.0 - alpha) * this.c0.y + alpha * this.c.y;
	var angle = (1.0 - alpha) * this.a0 + alpha * this.a;
	xf.R.Set(angle);
	var tMat = xf.R;
	xf.position.x -= (tMat.col1.x * this.localCenter.x + tMat.col2.x * this.localCenter.y);
	xf.position.y -= (tMat.col1.y * this.localCenter.x + tMat.col2.y * this.localCenter.y);
};
Box2D.Common.Math.b2Sweep.prototype.Advance = function(t) {
	if (t === undefined) t = 0;
	if (this.t0 < t && 1.0 - this.t0 > Number.MIN_VALUE) {
		var alpha = (t - this.t0) / (1.0 - this.t0);
		this.c0.x = (1.0 - alpha) * this.c0.x + alpha * this.c.x;
		this.c0.y = (1.0 - alpha) * this.c0.y + alpha * this.c.y;
		this.a0 = (1.0 - alpha) * this.a0 + alpha * this.a;
		this.t0 = t;
	}
};
/**
 * @param {!Box2D.Common.Math.b2Vec2=} pos
 * @param {!Box2D.Common.Math.b2Mat22=} r
 * @constructor
 */
Box2D.Common.Math.b2Transform = function(pos, r) {
	this.position = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.R = new Box2D.Common.Math.b2Mat22();
	if (pos) {
		this.position.SetV(pos);
	}
	if (r) {
		this.R.SetM(r);
	}
};
Box2D.Common.Math.b2Transform.prototype.Initialize = function(pos, r) {
	this.position.SetV(pos);
	this.R.SetM(r);
};
Box2D.Common.Math.b2Transform.prototype.SetIdentity = function() {
	this.position.SetZero();
	this.R.SetIdentity();
};
Box2D.Common.Math.b2Transform.prototype.Set = function(x) {
	this.position.SetV(x.position);
	this.R.SetM(x.R);
};
Box2D.Common.Math.b2Transform.prototype.GetAngle = function() {
	return Math.atan2(this.R.col1.y, this.R.col1.x);
};
/**
 * @private
 * @param {number} x
 * @param {number} y
 * @constructor
 */
Box2D.Common.Math.b2Vec2 = function(x, y) {
	this.x = x;
	this.y = y;
};
/**
 * @private
 * @type {Array.<!Box2D.Common.Math.b2Vec2>}
 */
Box2D.Common.Math.b2Vec2._freeCache = [];
/**
 * @param {number} x
 * @param {number} y
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Vec2.Get = function(x, y) {
	if (Box2D.Common.Math.b2Vec2._freeCache.length > 0) {
		var vec = Box2D.Common.Math.b2Vec2._freeCache.pop();
		vec.Set(x, y);
		return vec;
	}
	return new Box2D.Common.Math.b2Vec2(x, y);
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} vec
 */
Box2D.Common.Math.b2Vec2.Free = function(vec) {
	Box2D.Common.Math.b2Vec2._freeCache.push(vec);
};
Box2D.Common.Math.b2Vec2.prototype.SetZero = function() {
	this.x = 0.0;
	this.y = 0.0;
};
/**
 * @param {number} x
 * @param {number} y
 */
Box2D.Common.Math.b2Vec2.prototype.Set = function(x, y) {
	this.x = x;
	this.y = y;
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} v
 */
Box2D.Common.Math.b2Vec2.prototype.SetV = function(v) {
	this.x = v.x;
	this.y = v.y;
};
/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Vec2.prototype.GetNegative = function() {
	return Box2D.Common.Math.b2Vec2.Get((-this.x), (-this.y));
};
Box2D.Common.Math.b2Vec2.prototype.NegativeSelf = function() {
	this.x = (-this.x);
	this.y = (-this.y);
};
/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Common.Math.b2Vec2.prototype.Copy = function() {
	return Box2D.Common.Math.b2Vec2.Get(this.x, this.y);
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} v
 */
Box2D.Common.Math.b2Vec2.prototype.Add = function(v) {
	this.x += v.x;
	this.y += v.y;
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} v
 */
Box2D.Common.Math.b2Vec2.prototype.Subtract = function(v) {
	this.x -= v.x;
	this.y -= v.y;
};
/**
 * @param {number} a
 */
Box2D.Common.Math.b2Vec2.prototype.Multiply = function(a) {
	this.x *= a;
	this.y *= a;
};
/**
 * @param {Box2D.Common.Math.b2Mat22} A
 */
Box2D.Common.Math.b2Vec2.prototype.MulM = function(A) {
	var tX = this.x;
	this.x = A.col1.x * tX + A.col2.x * this.y;
	this.y = A.col1.y * tX + A.col2.y * this.y;
};
/**
 * @param {Box2D.Common.Math.b2Mat22} A
 */
Box2D.Common.Math.b2Vec2.prototype.MulTM = function(A) {
	var tX = this.x * A.col1.x + this.y * A.col1.y;
	this.y = this.x * A.col2.x + this.y * A.col2.y;
	this.x = tX;
};
/**
 * @param {number} s
 */
Box2D.Common.Math.b2Vec2.prototype.CrossVF = function(s) {
	var tX = this.x;
	this.x = s * this.y;
	this.y = (-s * tX);
};
/**
 * @param {number} s
 */
Box2D.Common.Math.b2Vec2.prototype.CrossFV = function(s) {
	var tX = this.x;
	this.x = (-s * this.y);
	this.y = s * tX;
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} b
 */
Box2D.Common.Math.b2Vec2.prototype.MinV = function(b) {
	this.x = Math.min(this.x, b.x);
	this.y = Math.min(this.y, b.y);
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} b
 */
Box2D.Common.Math.b2Vec2.prototype.MaxV = function(b) {
	this.x = Math.max(this.x, b.x);
	this.y = Math.max(this.y, b.y);
};
Box2D.Common.Math.b2Vec2.prototype.Abs = function() {
	this.x = Math.abs(this.x);
	this.y = Math.abs(this.y);
};
/**
 * @return {number}
 */
Box2D.Common.Math.b2Vec2.prototype.Length = function() {
	return Math.sqrt(this.LengthSquared());
};
/**
 * @return {number}
 */
Box2D.Common.Math.b2Vec2.prototype.LengthSquared = function() {
	return (this.x * this.x + this.y * this.y);
};
/**
 * @return {number}
 */
Box2D.Common.Math.b2Vec2.prototype.Normalize = function() {
	var length = this.Length();
	if (length < Number.MIN_VALUE) {
		return 0.0;
	}
	var invLength = 1.0 / length;
	this.x *= invLength;
	this.y *= invLength;
	return length;
};
/**
 * @return {boolean}
 */
Box2D.Common.Math.b2Vec2.prototype.IsValid = function () {
  return isFinite(this.x) && isFinite(this.y);
};
/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @constructor
 */
Box2D.Common.Math.b2Vec3 = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
};
Box2D.Common.Math.b2Vec3.prototype.SetZero = function() {
	this.x = 0;
	this.y = 0;
	this.z = 0;
};
/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
Box2D.Common.Math.b2Vec3.prototype.Set = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}
/**
 * @param {!Box2D.Common.Math.b2Vec3} v
 */
Box2D.Common.Math.b2Vec3.prototype.SetV = function(v) {
	this.x = v.x;
	this.y = v.y;
	this.z = v.z;
};
/**
 * @return {!Box2D.Common.Math.b2Vec3}
 */
Box2D.Common.Math.b2Vec3.prototype.GetNegative = function() {
	return new Box2D.Common.Math.b2Vec3((-this.x), (-this.y), (-this.z));
};
Box2D.Common.Math.b2Vec3.prototype.NegativeSelf = function() {
	this.x = (-this.x);
	this.y = (-this.y);
	this.z = (-this.z);
};
/**
 * @return {!Box2D.Common.Math.b2Vec3}
 */
Box2D.Common.Math.b2Vec3.prototype.Copy = function() {
	return new Box2D.Common.Math.b2Vec3(this.x, this.y, this.z);
};
/**
 * @param {!Box2D.Common.Math.b2Vec3} v
 */
Box2D.Common.Math.b2Vec3.prototype.Add = function(v) {
	this.x += v.x;
	this.y += v.y;
	this.z += v.z;
};
/**
 * @param {!Box2D.Common.Math.b2Vec3} v
 */
Box2D.Common.Math.b2Vec3.prototype.Subtract = function(v) {
	this.x -= v.x;
	this.y -= v.y;
	this.z -= v.z;
};
/**
 * @param {number} a
 */
Box2D.Common.Math.b2Vec3.prototype.Multiply = function(a) {
	this.x *= a;
	this.y *= a;
	this.z *= a;
};
/**
 * @constructor
 */
Box2D.Collision.Shapes.b2Shape = function() {
	this.m_radius = Box2D.Common.b2Settings.b2_linearSlop;
};
/**
 * @return {string}
 */
Box2D.Collision.Shapes.b2Shape.prototype.GetTypeName = function(){};
/**
 * @return {!Box2D.Collision.Shapes.b2Shape}
 */
Box2D.Collision.Shapes.b2Shape.prototype.Copy = function(){};
/**
 * @param {!Box2D.Collision.Shapes.b2Shape} other
 */
Box2D.Collision.Shapes.b2Shape.prototype.Set = function(other) {
	this.m_radius = other.m_radius;
};
/**
 * @param {!Box2D.Common.Math.b2Transform} xf
 * @param {!Box2D.Common.Math.b2Vec2} p
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2Shape.prototype.TestPoint = function(){};
/**
 * @param {!Box2D.Collision.b2RayCastOutput} output
 * @param {!Box2D.Collision.b2RayCastInput} input
 * @param {!Box2D.Common.Math.b2Transform} transform
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2Shape.prototype.RayCast = function(){};
/**
 * @param {!Box2D.Collision.b2AABB} aabb
 * @param {!Box2D.Common.Math.b2Transform} transform
 */
Box2D.Collision.Shapes.b2Shape.prototype.ComputeAABB = function(){};
/**
 * @param {!Box2D.Collision.Shapes.b2MassData} massData
 * @param {number} density
 */
Box2D.Collision.Shapes.b2Shape.prototype.ComputeMass = function(){};
/**
 * @param {!Box2D.Common.Math.b2Vec2} normal
 * @param {number} offset
 * @param {!Box2D.Common.Math.b2Transform} xf
 * @param {!Box2D.Common.Math.b2Vec2} c
 * @return {number}
 */
Box2D.Collision.Shapes.b2Shape.prototype.ComputeSubmergedArea = function(){};
/**
 * @param {!Box2D.Collision.b2DistanceProxy} proxy
 */
Box2D.Collision.Shapes.b2Shape.prototype.SetDistanceProxy = function(){};
/**
 * @param {!Box2D.Collision.Shapes.b2Shape} shape1
 * @param {!Box2D.Common.Math.b2Transform} transform1
 * @param {!Box2D.Collision.Shapes.b2Shape} shape2
 * @param {!Box2D.Common.Math.b2Transform} transform2
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2Shape.TestOverlap = function(shape1, transform1, shape2, transform2) {
	var input = new Box2D.Collision.b2DistanceInput();
	input.proxyA = new Box2D.Collision.b2DistanceProxy();
	input.proxyA.Set(shape1);
	input.proxyB = new Box2D.Collision.b2DistanceProxy();
	input.proxyB.Set(shape2);
	input.transformA = transform1;
	input.transformB = transform2;
	input.useRadii = true;
	var simplexCache = new Box2D.Collision.b2SimplexCache();
	simplexCache.count = 0;
	var output = new Box2D.Collision.b2DistanceOutput();
	Box2D.Collision.b2Distance.Distance(output, simplexCache, input);
	return output.distance < 10.0 * Number.MIN_VALUE;
};
/**
 * @const
 * @type {number}
 */
Box2D.Collision.Shapes.b2Shape.e_startsInsideCollide = -1;
/**
 * @const
 * @type {number}
 */
Box2D.Collision.Shapes.b2Shape.e_missCollide = 0;
/**
 * @const
 * @type {number}
 */
Box2D.Collision.Shapes.b2Shape.e_hitCollide = 1;
/**
 * @param {number} radius
 * @constructor
 * @extends {Box2D.Collision.Shapes.b2Shape}
 */
Box2D.Collision.Shapes.b2CircleShape = function(radius) {
	Box2D.Collision.Shapes.b2Shape.call(this);
	/** @type {number} */
	this.m_radius = radius;
	/** @type {number} */
	this.m_radiusSquared = radius * radius;
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_p = Box2D.Common.Math.b2Vec2.Get(0, 0);
};
c2inherit(Box2D.Collision.Shapes.b2CircleShape, Box2D.Collision.Shapes.b2Shape);
/**
 * @return {string}
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.GetTypeName = function() {
	return Box2D.Collision.Shapes.b2CircleShape.NAME;
};
/**
 * @return {!Box2D.Collision.Shapes.b2CircleShape}
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.Copy = function() {
	var s = new Box2D.Collision.Shapes.b2CircleShape(this.m_radius);
	s.Set(this);
	return s;
};
/**
 * @param {!Box2D.Collision.Shapes.b2Shape} other
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.Set = function(other) {
	Box2D.Collision.Shapes.b2Shape.prototype.Set.call(this, other);
	if (other instanceof Box2D.Collision.Shapes.b2CircleShape) {
		this.m_p.SetV(other.m_p);
	}
};
/**
 * @param {!Box2D.Common.Math.b2Transform} transform
 * @param {!Box2D.Common.Math.b2Vec2} p
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.TestPoint = function(transform, p) {
	var tMat = transform.R;
	var dX = p.x - (transform.position.x + (transform.R.col1.x * this.m_p.x + transform.R.col2.x * this.m_p.y));
	var dY = p.y - (transform.position.y + (transform.R.col1.y * this.m_p.x + transform.R.col2.y * this.m_p.y));
	return (dX * dX + dY * dY) <= this.m_radiusSquared;
};
/**
 * @param {!Box2D.Collision.b2RayCastOutput} output
 * @param {!Box2D.Collision.b2RayCastInput} input
 * @param {!Box2D.Common.Math.b2Transform} transform
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.RayCast = function(output, input, transform) {
	var tMat = transform.R;
	var positionX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
	var positionY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
	var sX = input.p1.x - positionX;
	var sY = input.p1.y - positionY;
	var b = (sX * sX + sY * sY) - this.m_radiusSquared;
	var rX = input.p2.x - input.p1.x;
	var rY = input.p2.y - input.p1.y;
	var c = (sX * rX + sY * rY);
	var rr = (rX * rX + rY * rY);
	var sigma = c * c - rr * b;
	if (sigma < 0.0 || rr < Number.MIN_VALUE) {
		return false;
	}
	var a = (-(c + Math.sqrt(sigma)));
	if (0.0 <= a && a <= input.maxFraction * rr) {
		a /= rr;
		output.fraction = a;
		output.normal.x = sX + a * rX;
		output.normal.y = sY + a * rY;
		output.normal.Normalize();
		return true;
	}
	return false;
};
/**
 * @param {!Box2D.Collision.b2AABB} aabb
 * @param {!Box2D.Common.Math.b2Transform} transform
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.ComputeAABB = function(aabb, transform) {
	var tMat = transform.R;
	var pX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
	var pY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
	aabb.lowerBound_.Set(pX - this.m_radius, pY - this.m_radius);
	aabb.upperBound_.Set(pX + this.m_radius, pY + this.m_radius);
};
/**
 * @param {!Box2D.Collision.Shapes.b2MassData} massData
 * @param {number} density
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.ComputeMass = function(massData, density) {
	massData.mass = density * Math.PI * this.m_radiusSquared;
	massData.center.SetV(this.m_p);
	massData.I = massData.mass * (0.5 * this.m_radiusSquared + (this.m_p.x * this.m_p.x + this.m_p.y * this.m_p.y));
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} normal
 * @param {number} offset
 * @param {!Box2D.Common.Math.b2Transform} xf
 * @param {!Box2D.Common.Math.b2Vec2} c
 * @return {number}
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.ComputeSubmergedArea = function(normal, offset, xf, c) {
	var p = Box2D.Common.Math.b2Math.MulX(xf, this.m_p);
	var l = (-(Box2D.Common.Math.b2Math.Dot(normal, p) - offset));
	if (l < (-this.m_radius) + Number.MIN_VALUE) {
		return 0;
	}
	if (l > this.m_radius) {
		c.SetV(p);
		return Math.PI * this.m_radiusSquared;
	}
	var l2 = l * l;
	var area = this.m_radiusSquared * (Math.asin(l / this.m_radius) + Math.PI / 2) + l * Math.sqrt(this.m_radiusSquared - l2);
	var com = (-2 / 3 * Math.pow(this.m_radiusSquared - l2, 1.5) / area);
	c.x = p.x + normal.x * com;
	c.y = p.y + normal.y * com;
	return area;
};
/**
 * @param {!Box2D.Collision.b2DistanceProxy} proxy
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.SetDistanceProxy = function(proxy) {
	proxy.m_vertices = [this.m_p];
	proxy.m_count = 1;
	proxy.m_radius = this.m_radius;
};
/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.GetLocalPosition = function() {
	return this.m_p;
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} position
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.SetLocalPosition = function(position) {
	this.m_p.SetV(position);
};
/**
 * @return {number}
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.GetRadius = function() {
	return this.m_radius;
};
/**
 * @param {number} radius
 */
Box2D.Collision.Shapes.b2CircleShape.prototype.SetRadius = function(radius) {
	this.m_radius = radius;
	this.m_radiusSquared = radius * radius;
};
/**
 * @const
 * @type {string}
 */
Box2D.Collision.Shapes.b2CircleShape.NAME = 'b2CircleShape';
/**
 * @constructor
 */
Box2D.Collision.Shapes.b2EdgeChainDef = function() {
	/** @type {number} */
	this.vertexCount = 0;
	/** @type {boolean} */
	this.isALoop = true;
	/** @type {Array.<Box2D.Common.Math.b2Vec2} */
	this.vertices = [];
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} v1
 * @param {!Box2D.Common.Math.b2Vec2} v2
 * @constructor
 * @extends {Box2D.Collision.Shapes.b2Shape}
 */
Box2D.Collision.Shapes.b2EdgeShape = function(v1, v2) {
	Box2D.Collision.Shapes.b2Shape.call(this);
	/** @type {Box2D.Collision.Shapes.b2EdgeShape} */
	this.m_prevEdge = null;
	/** @type {Box2D.Collision.Shapes.b2EdgeShape} */
	this.m_nextEdge = null;
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_v1 = v1;
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_v2 = v2;
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_direction = Box2D.Common.Math.b2Vec2.Get(this.m_v2.x - this.m_v1.x, this.m_v2.y - this.m_v1.y);
	/** @type {number} */
	this.m_length = this.m_direction.Normalize();
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_normal = Box2D.Common.Math.b2Vec2.Get(this.m_direction.y, -this.m_direction.x);
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_coreV1 = Box2D.Common.Math.b2Vec2.Get((-Box2D.Common.b2Settings.b2_toiSlop * (this.m_normal.x - this.m_direction.x)) + this.m_v1.x, (-Box2D.Common.b2Settings.b2_toiSlop * (this.m_normal.y - this.m_direction.y)) + this.m_v1.y);
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_coreV2 = Box2D.Common.Math.b2Vec2.Get((-Box2D.Common.b2Settings.b2_toiSlop * (this.m_normal.x + this.m_direction.x)) + this.m_v2.x, (-Box2D.Common.b2Settings.b2_toiSlop * (this.m_normal.y + this.m_direction.y)) + this.m_v2.y);
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_cornerDir1 = this.m_normal;
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_cornerDir2 = Box2D.Common.Math.b2Vec2.Get(-this.m_normal.x, -this.m_normal.y);
	/** @type {boolean} */
	this.m_cornerConvex1 = false;
	/** @type {boolean} */
	this.m_cornerConvex2 = false;
};
c2inherit(Box2D.Collision.Shapes.b2EdgeShape, Box2D.Collision.Shapes.b2Shape);
/**
 * @return {string}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetTypeName = function() {
	return Box2D.Collision.Shapes.b2EdgeShape.NAME;
};
/**
 * @param {!Box2D.Common.Math.b2Transform} transform
 * @param {!Box2D.Common.Math.b2Vec2} p
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.TestPoint = function(transform, p) {
	return false;
};
/**
 * @param {!Box2D.Collision.b2RayCastOutput} output
 * @param {!Box2D.Collision.b2RayCastInput} input
 * @param {!Box2D.Common.Math.b2Transform} transform
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.RayCast = function(output, input, transform) {
	var rX = input.p2.x - input.p1.x;
	var rY = input.p2.y - input.p1.y;
	var tMat = transform.R;
	var v1X = transform.position.x + (tMat.col1.x * this.m_v1.x + tMat.col2.x * this.m_v1.y);
	var v1Y = transform.position.y + (tMat.col1.y * this.m_v1.x + tMat.col2.y * this.m_v1.y);
	var nX = transform.position.y + (tMat.col1.y * this.m_v2.x + tMat.col2.y * this.m_v2.y) - v1Y;
	var nY = (-(transform.position.x + (tMat.col1.x * this.m_v2.x + tMat.col2.x * this.m_v2.y) - v1X));
	var k_slop = 100.0 * Number.MIN_VALUE;
	var denom = (-(rX * nX + rY * nY));
	if (denom > k_slop) {
		var bX = input.p1.x - v1X;
		var bY = input.p1.y - v1Y;
		var a = (bX * nX + bY * nY);
		if (0.0 <= a && a <= input.maxFraction * denom) {
			var mu2 = (-rX * bY) + rY * bX;
			if ((-k_slop * denom) <= mu2 && mu2 <= denom * (1.0 + k_slop)) {
				a /= denom;
				output.fraction = a;
				var nLen = Math.sqrt(nX * nX + nY * nY);
				output.normal.x = nX / nLen;
				output.normal.y = nY / nLen;
				return true;
			}
		}
	}
	return false;
};
/**
 * @param {!Box2D.Collision.b2AABB} aabb
 * @param {!Box2D.Common.Math.b2Transform} transform
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.ComputeAABB = function(aabb, transform) {
	var tMat = transform.R;
	var v1X = transform.position.x + (tMat.col1.x * this.m_v1.x + tMat.col2.x * this.m_v1.y);
	var v1Y = transform.position.y + (tMat.col1.y * this.m_v1.x + tMat.col2.y * this.m_v1.y);
	var v2X = transform.position.x + (tMat.col1.x * this.m_v2.x + tMat.col2.x * this.m_v2.y);
	var v2Y = transform.position.y + (tMat.col1.y * this.m_v2.x + tMat.col2.y * this.m_v2.y);
	if (v1X < v2X) {
		aabb.lowerBound_.x = v1X;
		aabb.upperBound_.x = v2X;
	} else {
		aabb.lowerBound_.x = v2X;
		aabb.upperBound_.x = v1X;
	}
	if (v1Y < v2Y) {
		aabb.lowerBound_.y = v1Y;
		aabb.upperBound_.y = v2Y;
	} else {
		aabb.lowerBound_.y = v2Y;
		aabb.upperBound_.y = v1Y;
	}
};
/**
 * @param {!Box2D.Collision.Shapes.b2MassData} massData
 * @param {number} density
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.ComputeMass = function(massData, density) {
	massData.mass = 0;
	massData.center.SetV(this.m_v1);
	massData.I = 0;
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} normal
 * @param {number} offset
 * @param {!Box2D.Common.Math.b2Transform} xf
 * @param {!Box2D.Common.Math.b2Vec2} c
 * @return {number}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.ComputeSubmergedArea = function(normal, offset, xf, c) {
	if (offset === undefined) offset = 0;
	var v0 = Box2D.Common.Math.b2Vec2.Get(normal.x * offset, normal.y * offset);
	var v1 = Box2D.Common.Math.b2Math.MulX(xf, this.m_v1);
	var v2 = Box2D.Common.Math.b2Math.MulX(xf, this.m_v2);
	var d1 = Box2D.Common.Math.b2Math.Dot(normal, v1) - offset;
	var d2 = Box2D.Common.Math.b2Math.Dot(normal, v2) - offset;
	if (d1 > 0) {
		if (d2 > 0) {
			return 0;
		} else {
			v1.x = (-d2 / (d1 - d2) * v1.x) + d1 / (d1 - d2) * v2.x;
			v1.y = (-d2 / (d1 - d2) * v1.y) + d1 / (d1 - d2) * v2.y;
		}
	} else {
		if (d2 > 0) {
			v2.x = (-d2 / (d1 - d2) * v1.x) + d1 / (d1 - d2) * v2.x;
			v2.y = (-d2 / (d1 - d2) * v1.y) + d1 / (d1 - d2) * v2.y;
		}
	}
	c.x = (v0.x + v1.x + v2.x) / 3;
	c.y = (v0.y + v1.y + v2.y) / 3;
	return 0.5 * ((v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x));
};
/**
 * @return {number}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetLength = function() {
	return this.m_length;
};
/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetVertex1 = function() {
	return this.m_v1;
};
/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetVertex2 = function() {
	return this.m_v2;
};
/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetCoreVertex1 = function() {
	return this.m_coreV1;
};
/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetCoreVertex2 = function() {
	return this.m_coreV2;
};
/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetNormalVector = function() {
	return this.m_normal;
};
/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetDirectionVector = function() {
	return this.m_direction;
};
/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetCorner1Vector = function() {
	return this.m_cornerDir1;
};
/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetCorner2Vector = function() {
	return this.m_cornerDir2;
};
/**
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.Corner1IsConvex = function() {
	return this.m_cornerConvex1;
};
/**
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.Corner2IsConvex = function() {
	return this.m_cornerConvex2;
};
/**
 * @param {!Box2D.Common.Math.b2Transform} xf
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetFirstVertex = function(xf) {
	var tMat = xf.R;
	return Box2D.Common.Math.b2Vec2.Get(xf.position.x + (tMat.col1.x * this.m_coreV1.x + tMat.col2.x * this.m_coreV1.y), xf.position.y + (tMat.col1.y * this.m_coreV1.x + tMat.col2.y * this.m_coreV1.y));
};
/**
 * @return {Box2D.Collision.Shapes.b2EdgeShape}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetNextEdge = function() {
	return this.m_nextEdge;
};
/**
 * @return {Box2D.Collision.Shapes.b2EdgeShape}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.GetPrevEdge = function() {
	return this.m_prevEdge;
};
/**
 * @param {!Box2D.Common.Math.b2Transform} xf
 * @param {number} dX
 * @param {number} dY
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.Support = function(xf, dX, dY) {
	var tMat = xf.R;
	var v1X = xf.position.x + (tMat.col1.x * this.m_coreV1.x + tMat.col2.x * this.m_coreV1.y);
	var v1Y = xf.position.y + (tMat.col1.y * this.m_coreV1.x + tMat.col2.y * this.m_coreV1.y);
	var v2X = xf.position.x + (tMat.col1.x * this.m_coreV2.x + tMat.col2.x * this.m_coreV2.y);
	var v2Y = xf.position.y + (tMat.col1.y * this.m_coreV2.x + tMat.col2.y * this.m_coreV2.y);
	if ((v1X * dX + v1Y * dY) > (v2X * dX + v2Y * dY)) {
		return Box2D.Common.Math.b2Vec2.Get(v1X, v1Y);
	} else {
		return Box2D.Common.Math.b2Vec2.Get(v2X, v2Y);
	}
};
/**
 * @param {Box2D.Collision.Shapes.b2EdgeShape} edge
 * @param {!Box2D.Common.Math.b2Vec2} core
 * @param {!Box2D.Common.Math.b2Vec2} cornerDir
 * @param {boolean} convex
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.SetPrevEdge = function(edge, core, cornerDir, convex) {
	this.m_prevEdge = edge;
	this.m_coreV1 = core;
	this.m_cornerDir1 = cornerDir;
	this.m_cornerConvex1 = convex;
};
/**
 * @param {Box2D.Collision.Shapes.b2EdgeShape} edge
 * @param {!Box2D.Common.Math.b2Vec2} core
 * @param {!Box2D.Common.Math.b2Vec2} cornerDir
 * @param {boolean} convex
 */
Box2D.Collision.Shapes.b2EdgeShape.prototype.SetNextEdge = function(edge, core, cornerDir, convex) {
	this.m_nextEdge = edge;
	this.m_coreV2 = core;
	this.m_cornerDir2 = cornerDir;
	this.m_cornerConvex2 = convex;
};
/**
 * @const
 * @type {string}
 */
Box2D.Collision.Shapes.b2EdgeShape.NAME = 'b2EdgeShape';
/**
 * @constructor
 */
Box2D.Collision.Shapes.b2MassData = function() {
	/** @type {number} */
	this.mass = 0;
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.center = Box2D.Common.Math.b2Vec2.Get(0, 0);
	/** @type {number} */
	this.I = 0;
};
/**
 * @constructor
 * @extends {Box2D.Collision.Shapes.b2Shape}
 */
Box2D.Collision.Shapes.b2PolygonShape = function() {
	Box2D.Collision.Shapes.b2Shape.call(this);
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.m_centroid = Box2D.Common.Math.b2Vec2.Get(0, 0);
	/** @type {Array.<!Box2D.Common.Math.b2Vec2>} */
	this.m_vertices = [];
	/** @type {Array.<!Box2D.Common.Math.b2Vec2>} */
	this.m_normals = [];
};
c2inherit(Box2D.Collision.Shapes.b2PolygonShape, Box2D.Collision.Shapes.b2Shape);
/**
 * @return {string}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.GetTypeName = function() {
	return Box2D.Collision.Shapes.b2PolygonShape.NAME;
};
/**
 * @return {!Box2D.Collision.Shapes.b2PolygonShape}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.Copy = function() {
	var s = new Box2D.Collision.Shapes.b2PolygonShape();
	s.Set(this);
	return s;
};
/**
 * @param {!Box2D.Collision.Shapes.b2Shape} other
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.Set = function(other) {
	Box2D.Collision.Shapes.b2Shape.prototype.Set.call(this, other);
	if (other instanceof Box2D.Collision.Shapes.b2PolygonShape) {
		this.m_centroid.SetV(other.m_centroid);
		this.m_vertexCount = other.m_vertexCount;
		this.Reserve(this.m_vertexCount);
		for (var i = 0; i < this.m_vertexCount; i++) {
			this.m_vertices[i].SetV(other.m_vertices[i]);
			this.m_normals[i].SetV(other.m_normals[i]);
		}
	}
};
/**
 * @param {Array.<Box2D.Common.Math.b2Vec2>} vertices
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.SetAsArray = function(vertices) {
	this.SetAsVector(vertices);
};
/**
 * @param {Array.<Box2D.Common.Math.b2Vec2>} vertices
 * @return {!Box2D.Collision.Shapes.b2PolygonShape}
 */
Box2D.Collision.Shapes.b2PolygonShape.AsArray = function(vertices) {
	var polygonShape = new Box2D.Collision.Shapes.b2PolygonShape();
	polygonShape.SetAsArray(vertices);
	return polygonShape;
};
/**
 * @param {Array.<!Box2D.Common.Math.b2Vec2>} vertices
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.SetAsVector = function(vertices) {
	var vertexCount = vertices.length;
;
	this.m_vertexCount = vertexCount;
	this.Reserve(vertexCount);
	var i = 0;
	for (i = 0; i < this.m_vertexCount; i++) {
		this.m_vertices[i].SetV(vertices[i]);
	}
	for (i = 0; i < this.m_vertexCount; ++i) {
		var i1 = i;
		var i2 = i + 1 < this.m_vertexCount ? i + 1 : 0;
		var edge = Box2D.Common.Math.b2Math.SubtractVV(this.m_vertices[i2], this.m_vertices[i1]);
;
		this.m_normals[i].SetV(Box2D.Common.Math.b2Math.CrossVF(edge, 1.0));
		this.m_normals[i].Normalize();
	}
	this.m_centroid = Box2D.Collision.Shapes.b2PolygonShape.ComputeCentroid(this.m_vertices, this.m_vertexCount);
};
/**
 * @param {Array.<Box2D.Common.Math.b2Vec2>} vertices
 * @return {!Box2D.Collision.Shapes.b2PolygonShape}
 */
Box2D.Collision.Shapes.b2PolygonShape.AsVector = function(vertices) {
	var polygonShape = new Box2D.Collision.Shapes.b2PolygonShape();
	polygonShape.SetAsVector(vertices);
	return polygonShape;
};
/**
 * @param {number} hx
 * @param {number} hy
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.SetAsBox = function(hx, hy) {
	this.m_vertexCount = 4;
	this.Reserve(4);
	this.m_vertices[0].Set((-hx), (-hy));
	this.m_vertices[1].Set(hx, (-hy));
	this.m_vertices[2].Set(hx, hy);
	this.m_vertices[3].Set((-hx), hy);
	this.m_normals[0].Set(0.0, (-1.0));
	this.m_normals[1].Set(1.0, 0.0);
	this.m_normals[2].Set(0.0, 1.0);
	this.m_normals[3].Set((-1.0), 0.0);
	this.m_centroid.SetZero();
};
/**
 * @param {number} hx
 * @param {number} hy
 * @return {!Box2D.Collision.Shapes.b2PolygonShape}
 */
Box2D.Collision.Shapes.b2PolygonShape.AsBox = function(hx, hy) {
	var polygonShape = new Box2D.Collision.Shapes.b2PolygonShape();
	polygonShape.SetAsBox(hx, hy);
	return polygonShape;
};
/**
 * @param {number} hx
 * @param {number} hy
 * @param {!Box2D.Common.Math.b2Vec2} center
 * @param {number} angle
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.SetAsOrientedBox = function(hx, hy, center, angle) {
	this.m_vertexCount = 4;
	this.Reserve(4);
	this.m_vertices[0].Set((-hx), (-hy));
	this.m_vertices[1].Set(hx, (-hy));
	this.m_vertices[2].Set(hx, hy);
	this.m_vertices[3].Set((-hx), hy);
	this.m_normals[0].Set(0.0, (-1.0));
	this.m_normals[1].Set(1.0, 0.0);
	this.m_normals[2].Set(0.0, 1.0);
	this.m_normals[3].Set((-1.0), 0.0);
	this.m_centroid = center;
	var mat = new Box2D.Common.Math.b2Mat22();
	mat.Set(angle);
	var xf = new Box2D.Common.Math.b2Transform(center, mat);
	for (var i = 0; i < this.m_vertexCount; ++i) {
		this.m_vertices[i] = Box2D.Common.Math.b2Math.MulX(xf, this.m_vertices[i]);
		this.m_normals[i] = Box2D.Common.Math.b2Math.MulMV(xf.R, this.m_normals[i]);
	}
};
/**
 * @param {number} hx
 * @param {number} hy
 * @param {!Box2D.Common.Math.b2Vec2} center
 * @param {number} angle
 * @return {!Box2D.Collision.Shapes.b2PolygonShape}
 */
Box2D.Collision.Shapes.b2PolygonShape.AsOrientedBox = function(hx, hy, center, angle) {
	var polygonShape = new Box2D.Collision.Shapes.b2PolygonShape();
	polygonShape.SetAsOrientedBox(hx, hy, center, angle);
	return polygonShape;
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} v1
 * @param {!Box2D.Common.Math.b2Vec2} v2
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.SetAsEdge = function(v1, v2) {
	this.m_vertexCount = 2;
	this.Reserve(2);
	this.m_vertices[0].SetV(v1);
	this.m_vertices[1].SetV(v2);
	this.m_centroid.x = 0.5 * (v1.x + v2.x);
	this.m_centroid.y = 0.5 * (v1.y + v2.y);
	this.m_normals[0] = Box2D.Common.Math.b2Math.CrossVF(Box2D.Common.Math.b2Math.SubtractVV(v2, v1), 1.0);
	this.m_normals[0].Normalize();
	this.m_normals[1].x = (-this.m_normals[0].x);
	this.m_normals[1].y = (-this.m_normals[0].y);
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} v1
 * @param {!Box2D.Common.Math.b2Vec2} v2
 * @return {!Box2D.Collision.Shapes.b2PolygonShape}
 */
Box2D.Collision.Shapes.b2PolygonShape.AsEdge = function(v1, v2) {
	var polygonShape = new Box2D.Collision.Shapes.b2PolygonShape();
	polygonShape.SetAsEdge(v1, v2);
	return polygonShape;
};
/**
 * @param {!Box2D.Common.Math.b2Transform} xf
 * @param {!Box2D.Common.Math.b2Vec2} p
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.TestPoint = function(xf, p) {
	var tVec;
	var tMat = xf.R;
	var tX = p.x - xf.position.x;
	var tY = p.y - xf.position.y;
	var pLocalX = (tX * tMat.col1.x + tY * tMat.col1.y);
	var pLocalY = (tX * tMat.col2.x + tY * tMat.col2.y);
	for (var i = 0; i < this.m_vertexCount; ++i) {
		tVec = this.m_vertices[i];
		tX = pLocalX - tVec.x;
		tY = pLocalY - tVec.y;
		tVec = this.m_normals[i];
		var dot = (tVec.x * tX + tVec.y * tY);
		if (dot > 0.0) {
			return false;
		}
	}
	return true;
};
/**
 * @param {!Box2D.Collision.b2RayCastOutput} output
 * @param {!Box2D.Collision.b2RayCastInput} input
 * @param {!Box2D.Common.Math.b2Transform} transform
 * @return {boolean}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.RayCast = function(output, input, transform) {
	var lower = 0.0;
	var upper = input.maxFraction;
	var tX = 0;
	var tY = 0;
	var tMat;
	var tVec;
	tX = input.p1.x - transform.position.x;
	tY = input.p1.y - transform.position.y;
	tMat = transform.R;
	var p1X = (tX * tMat.col1.x + tY * tMat.col1.y);
	var p1Y = (tX * tMat.col2.x + tY * tMat.col2.y);
	tX = input.p2.x - transform.position.x;
	tY = input.p2.y - transform.position.y;
	tMat = transform.R;
	var p2X = (tX * tMat.col1.x + tY * tMat.col1.y);
	var p2Y = (tX * tMat.col2.x + tY * tMat.col2.y);
	var dX = p2X - p1X;
	var dY = p2Y - p1Y;
	var index = -1;
	for (var i = 0; i < this.m_vertexCount; ++i) {
		tVec = this.m_vertices[i];
		tX = tVec.x - p1X;
		tY = tVec.y - p1Y;
		tVec = this.m_normals[i];
		var numerator = (tVec.x * tX + tVec.y * tY);
		var denominator = (tVec.x * dX + tVec.y * dY);
		if (denominator == 0.0) {
			if (numerator < 0.0) {
				return false;
			}
		} else {
			if (denominator < 0.0 && numerator < lower * denominator) {
				lower = numerator / denominator;
				index = i;
			} else if (denominator > 0.0 && numerator < upper * denominator) {
				upper = numerator / denominator;
			}
		}
		if (upper < lower - Number.MIN_VALUE) {
			return false;
		}
	}
	if (index >= 0) {
		output.fraction = lower;
		tMat = transform.R;
		tVec = this.m_normals[index];
		output.normal.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		output.normal.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		return true;
	}
	return false;
};
/**
 * @param {!Box2D.Collision.b2AABB} aabb
 * @param {!Box2D.Common.Math.b2Transform} xf
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.ComputeAABB = function(aabb, xf) {
	var tMat = xf.R;
	var tVec = this.m_vertices[0];
	var lowerX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	var lowerY = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	var upperX = lowerX;
	var upperY = lowerY;
	for (var i = 1; i < this.m_vertexCount; ++i) {
		tVec = this.m_vertices[i];
		var vX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		var vY = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		lowerX = lowerX < vX ? lowerX : vX;
		lowerY = lowerY < vY ? lowerY : vY;
		upperX = upperX > vX ? upperX : vX;
		upperY = upperY > vY ? upperY : vY;
	}
	aabb.lowerBound_.x = lowerX - this.m_radius;
	aabb.lowerBound_.y = lowerY - this.m_radius;
	aabb.upperBound_.x = upperX + this.m_radius;
	aabb.upperBound_.y = upperY + this.m_radius;
};
/**
 * @param {!Box2D.Collision.Shapes.b2MassData} massData
 * @param {number} density
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.ComputeMass = function(massData, density) {
	if (this.m_vertexCount == 2) {
		massData.center.x = 0.5 * (this.m_vertices[0].x + this.m_vertices[1].x);
		massData.center.y = 0.5 * (this.m_vertices[0].y + this.m_vertices[1].y);
		massData.mass = 0.0;
		massData.I = 0.0;
		return;
	}
	var centerX = 0.0;
	var centerY = 0.0;
	var area = 0.0;
	var I = 0.0;
	var p1X = 0.0;
	var p1Y = 0.0;
	var k_inv3 = 1.0 / 3.0;
	for (var i = 0; i < this.m_vertexCount; ++i) {
		var p2 = this.m_vertices[i];
		var p3 = i + 1 < this.m_vertexCount ? this.m_vertices[i + 1] : this.m_vertices[0];
		var e1X = p2.x - p1X;
		var e1Y = p2.y - p1Y;
		var e2X = p3.x - p1X;
		var e2Y = p3.y - p1Y;
		var D = e1X * e2Y - e1Y * e2X;
		var triangleArea = 0.5 * D;
		area += triangleArea;
		centerX += triangleArea * k_inv3 * (p1X + p2.x + p3.x);
		centerY += triangleArea * k_inv3 * (p1Y + p2.y + p3.y);
		var px = p1X;
		var py = p1Y;
		var ex1 = e1X;
		var ey1 = e1Y;
		var ex2 = e2X;
		var ey2 = e2Y;
		var intx2 = k_inv3 * (0.25 * (ex1 * ex1 + ex2 * ex1 + ex2 * ex2) + (px * ex1 + px * ex2)) + 0.5 * px * px;
		var inty2 = k_inv3 * (0.25 * (ey1 * ey1 + ey2 * ey1 + ey2 * ey2) + (py * ey1 + py * ey2)) + 0.5 * py * py;
		I += D * (intx2 + inty2);
	}
	massData.mass = density * area;
	centerX *= 1.0 / area;
	centerY *= 1.0 / area;
	massData.center.Set(centerX, centerY);
	massData.I = density * I;
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} normal
 * @param {number} offset
 * @param {!Box2D.Common.Math.b2Transform} xf
 * @param {!Box2D.Common.Math.b2Vec2} c
 * @return {number}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.ComputeSubmergedArea = function(normal, offset, xf, c) {
	var normalL = Box2D.Common.Math.b2Math.MulTMV(xf.R, normal);
	var offsetL = offset - Box2D.Common.Math.b2Math.Dot(normal, xf.position);
	var depths = [];
	var diveCount = 0;
	var intoIndex = -1;
	var outoIndex = -1;
	var lastSubmerged = false;
	var i = 0;
	for (i = 0; i < this.m_vertexCount; ++i) {
		depths[i] = Box2D.Common.Math.b2Math.Dot(normalL, this.m_vertices[i]) - offsetL;
		var isSubmerged = depths[i] < (-Number.MIN_VALUE);
		if (i > 0) {
			if (isSubmerged) {
				if (!lastSubmerged) {
					intoIndex = i - 1;
					diveCount++;
				}
			} else {
				if (lastSubmerged) {
					outoIndex = i - 1;
					diveCount++;
				}
			}
		}
		lastSubmerged = isSubmerged;
	}
	switch (diveCount) {
	case 0:
		if (lastSubmerged) {
			var md = new Box2D.Collision.Shapes.b2MassData();
			this.ComputeMass(md, 1);
			c.SetV(Box2D.Common.Math.b2Math.MulX(xf, md.center));
			return md.mass;
		} else {
			return 0;
		}
		break;
	case 1:
		if (intoIndex == (-1)) {
			intoIndex = this.m_vertexCount - 1;
		} else {
			outoIndex = this.m_vertexCount - 1;
		}
		break;
	}
	var intoIndex2 = ((intoIndex + 1) % this.m_vertexCount);
	var outoIndex2 = ((outoIndex + 1) % this.m_vertexCount);
	var intoLamdda = (0 - depths[intoIndex]) / (depths[intoIndex2] - depths[intoIndex]);
	var outoLamdda = (0 - depths[outoIndex]) / (depths[outoIndex2] - depths[outoIndex]);
	var intoVec = Box2D.Common.Math.b2Vec2.Get(this.m_vertices[intoIndex].x * (1 - intoLamdda) + this.m_vertices[intoIndex2].x * intoLamdda, this.m_vertices[intoIndex].y * (1 - intoLamdda) + this.m_vertices[intoIndex2].y * intoLamdda);
	var outoVec = Box2D.Common.Math.b2Vec2.Get(this.m_vertices[outoIndex].x * (1 - outoLamdda) + this.m_vertices[outoIndex2].x * outoLamdda, this.m_vertices[outoIndex].y * (1 - outoLamdda) + this.m_vertices[outoIndex2].y * outoLamdda);
	var area = 0;
	var center = Box2D.Common.Math.b2Vec2.Get(0, 0);
	var p2 = this.m_vertices[intoIndex2];
	var p3;
	i = intoIndex2;
	while (i != outoIndex2) {
		i = (i + 1) % this.m_vertexCount;
		if (i == outoIndex2) p3 = outoVec;
		else p3 = this.m_vertices[i];
		var triangleArea = 0.5 * ((p2.x - intoVec.x) * (p3.y - intoVec.y) - (p2.y - intoVec.y) * (p3.x - intoVec.x));
		area += triangleArea;
		center.x += triangleArea * (intoVec.x + p2.x + p3.x) / 3;
		center.y += triangleArea * (intoVec.y + p2.y + p3.y) / 3;
		p2 = p3;
	}
	center.Multiply(1 / area);
	c.SetV(Box2D.Common.Math.b2Math.MulX(xf, center));
	return area;
};
/**
 * @param {!Box2D.Collision.b2DistanceProxy} proxy
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.SetDistanceProxy = function(proxy) {
	proxy.m_vertices = this.m_vertices;
	proxy.m_count = this.m_vertexCount;
	proxy.m_radius = this.m_radius;
};
/**
 * @return {number}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.GetVertexCount = function() {
	return this.m_vertexCount;
};
/**
 * @return {Array.<!Box2D.Common.Math.b2Vec2>}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.GetVertices = function() {
	return this.m_vertices;
};
/**
 * @return {Array.<!Box2D.Common.Math.b2Vec2>}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.GetNormals = function() {
	return this.m_normals;
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} d
 * return {number}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.GetSupport = function(d) {
	var bestIndex = 0;
	var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
	for (var i = 1; i < this.m_vertexCount; ++i) {
		var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
		if (value > bestValue) {
			bestIndex = i;
			bestValue = value;
		}
	}
	return bestIndex;
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} d
 * return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.GetSupportVertex = function(d) {
	var bestIndex = 0;
	var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
	for (var i = 1; i < this.m_vertexCount; ++i) {
		var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
		if (value > bestValue) {
			bestIndex = i;
			bestValue = value;
		}
	}
	return this.m_vertices[bestIndex];
};
/**
 * @param {number} count
 */
Box2D.Collision.Shapes.b2PolygonShape.prototype.Reserve = function(count) {
	this.m_vertices = [];
	this.m_normals = [];
	for (var i = this.m_vertices.length; i < count; i++) {
		this.m_vertices[i] = Box2D.Common.Math.b2Vec2.Get(0, 0);
		this.m_normals[i] = Box2D.Common.Math.b2Vec2.Get(0, 0);
	}
};
/**
 * @param {Array.<!Box2D.Common.Math.b2Vec2>} vs
 * @param {number} count
 * return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.Shapes.b2PolygonShape.ComputeCentroid = function(vs, count) {
	var c = Box2D.Common.Math.b2Vec2.Get(0, 0);
	var area = 0.0;
	var p1X = 0.0;
	var p1Y = 0.0;
	var inv3 = 1.0 / 3.0;
	for (var i = 0; i < count; ++i) {
		var p2 = vs[i];
		var p3 = i + 1 < count ? vs[i + 1] : vs[0];
		var e1X = p2.x - p1X;
		var e1Y = p2.y - p1Y;
		var e2X = p3.x - p1X;
		var e2Y = p3.y - p1Y;
		var D = (e1X * e2Y - e1Y * e2X);
		var triangleArea = 0.5 * D;
		area += triangleArea;
		c.x += triangleArea * inv3 * (p1X + p2.x + p3.x);
		c.y += triangleArea * inv3 * (p1Y + p2.y + p3.y);
	}
	c.x *= 1.0 / area;
	c.y *= 1.0 / area;
	return c;
};
/** @type {!Box2D.Common.Math.b2Mat22} */
Box2D.Collision.Shapes.b2PolygonShape.s_mat = new Box2D.Common.Math.b2Mat22();
/**
 * @const
 * @type {string}
 */
Box2D.Collision.Shapes.b2PolygonShape.NAME = 'b2PolygonShape';
/**
 * @constructor
 */
Box2D.Collision.b2ContactID = function() {
	/** @type {number} */
	this._key = 0;
	/** @type {number} */
	this._referenceEdge = 0;
	/** @type {number} */
	this._incidentEdge = 0;
	/** @type {number} */
	this._incidentVertex = 0;
};
/**
 * @return {number}
 */
Box2D.Collision.b2ContactID.prototype.GetKey = function () {
	return this._key;
};
/**
 * @param {number} key
 */
Box2D.Collision.b2ContactID.prototype.SetKey = function (key) {
	this._key = key;
	this._referenceEdge = this._key & 0x000000ff;
	this._incidentEdge = ((this._key & 0x0000ff00) >> 8) & 0x000000ff;
	this._incidentVertex = ((this._key & 0x00ff0000) >> 16) & 0x000000ff;
	this._flip = ((this._key & 0xff000000) >> 24) & 0x000000ff;
};
/**
 * @param {!Box2D.Collision.b2ContactID} id
 */
Box2D.Collision.b2ContactID.prototype.Set = function (id) {
	this.SetKey(id._key);
};
/**
 * @param {number} edge
 */
Box2D.Collision.b2ContactID.prototype.SetReferenceEdge = function(edge) {
	this._referenceEdge = edge;
	this._key = (this._key & 0xffffff00) | (this._referenceEdge & 0x000000ff);
};
/**
 * @param {number} edge
 */
Box2D.Collision.b2ContactID.prototype.SetIncidentEdge = function(edge) {
	this._incidentEdge = edge;
	this._key = (this._key & 0xffff00ff) | ((this._incidentEdge << 8) & 0x0000ff00);
};
/**
 * @param {number} vertex
 */
Box2D.Collision.b2ContactID.prototype.SetIncidentVertex = function(vertex) {
	this._incidentVertex = vertex;
	this._key = (this._key & 0xff00ffff) | ((this._incidentVertex << 16) & 0x00ff0000);
};
/**
 * @param {number} flip
 */
Box2D.Collision.b2ContactID.prototype.SetFlip = function(flip) {
	this._flip = flip;
	this._key = (this._key & 0x00ffffff) | ((this._flip << 24) & 0xff000000);
};
Box2D.Collision.b2ContactID.prototype.Copy = function () {
  var id = new Box2D.Collision.b2ContactID();
  id.Set(this);
  return id;
};
/**
 * @constructor
 */
Box2D.Collision.ClipVertex = function() {
	this.v = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.id = new Box2D.Collision.b2ContactID();
};
Box2D.Collision.ClipVertex.prototype.Set = function(other) {
	this.v.SetV(other.v);
	this.id.Set(other.id);
};
/**
 * @const
 * @type {string}
 */
Box2D.Collision.IBroadPhase = 'Box2D.Collision.IBroadPhase';
/**
 * @private
 * @constructor
 */
Box2D.Collision.b2AABB = function() {
	this.lowerBound_ = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.upperBound_ = Box2D.Common.Math.b2Vec2.Get(0, 0);
};
/**
 * @private
 * @type {Array.<!Box2D.Collision.b2AABB>}
 */
Box2D.Collision.b2AABB._freeCache = [];
/**
 * @return {!Box2D.Collision.b2AABB}
 */
Box2D.Collision.b2AABB.Get = function() {
	if (Box2D.Collision.b2AABB._freeCache.length > 0) {
		var aabb = Box2D.Collision.b2AABB._freeCache.pop();
		aabb.SetZero();
		return aabb;
	}
	return new Box2D.Collision.b2AABB();
};
/**
 * @param {!Box2D.Collision.b2AABB} aabb
 */
Box2D.Collision.b2AABB.Free = function(aabb) {
	Box2D.Collision.b2AABB._freeCache.push(aabb);
};
Box2D.Collision.b2AABB.prototype.SetZero = function() {
	this.lowerBound_.Set(0, 0);
	this.upperBound_.Set(0, 0);
};
/**
 * @return {boolean}
 */
Box2D.Collision.b2AABB.prototype.IsValid = function() {
	var dX = this.upperBound_.x - this.lowerBound_.x;
	if (dX < 0) {
		return false;
	}
	var dY = this.upperBound_.y - this.lowerBound_.y;
	if (dY < 0) {
		return false;
	}
	return this.lowerBound_.IsValid() && this.upperBound_.IsValid();
};
/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.b2AABB.prototype.GetCenter = function() {
	return Box2D.Common.Math.b2Vec2.Get((this.lowerBound_.x + this.upperBound_.x) / 2, (this.lowerBound_.y + this.upperBound_.y) / 2);
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} newCenter
 */
Box2D.Collision.b2AABB.prototype.SetCenter = function(newCenter) {
	var oldCenter = this.GetCenter();
	this.lowerBound_.Subtract(oldCenter);
	this.upperBound_.Subtract(oldCenter);
	this.lowerBound_.Add(newCenter);
	this.upperBound_.Add(newCenter);
	Box2D.Common.Math.b2Vec2.Free(oldCenter);
};
/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Collision.b2AABB.prototype.GetExtents = function() {
	return Box2D.Common.Math.b2Vec2.Get((this.upperBound_.x - this.lowerBound_.x) / 2, (this.upperBound_.y - this.lowerBound_.y) / 2);
};
/**
 * @param {!Box2D.Collision.b2AABB} aabb
 * @return {boolean}
 */
Box2D.Collision.b2AABB.prototype.Contains = function(aabb) {
	var result = true;
	result = result && this.lowerBound_.x <= aabb.lowerBound_.x;
	result = result && this.lowerBound_.y <= aabb.lowerBound_.y;
	result = result && aabb.upperBound_.x <= this.upperBound_.x;
	result = result && aabb.upperBound_.y <= this.upperBound_.y;
	return result;
};
/**
 * @param {!Box2D.Collision.b2RayCastOutput} output
 * @param {!Box2D.Collision.b2RayCastInput} input
 * @return {boolean}
 */
Box2D.Collision.b2AABB.prototype.RayCast = function(output, input) {
	var tmin = (-Number.MAX_VALUE);
	var tmax = Number.MAX_VALUE;
	var dX = input.p2.x - input.p1.x;
	var absDX = Math.abs(dX);
	if (absDX < Number.MIN_VALUE) {
		if (input.p1.x < this.lowerBound_.x || this.upperBound_.x < input.p1.x) {
			return false;
		}
	} else {
		var inv_d = 1.0 / dX;
		var t1 = (this.lowerBound_.x - input.p1.x) * inv_d;
		var t2 = (this.upperBound_.x - input.p1.x) * inv_d;
		var s = (-1.0);
		if (t1 > t2) {
			var t3 = t1;
			t1 = t2;
			t2 = t3;
			s = 1.0;
		}
		if (t1 > tmin) {
			output.normal.x = s;
			output.normal.y = 0;
			tmin = t1;
		}
		tmax = Math.min(tmax, t2);
		if (tmin > tmax) return false;
	}
	var dY = input.p2.y - input.p1.y;
	var absDY = Math.abs(dY);
	if (absDY < Number.MIN_VALUE) {
		if (input.p1.y < this.lowerBound_.y || this.upperBound_.y < input.p1.y) {
			return false;
		}
	} else {
		var inv_d = 1.0 / dY;
		var t1 = (this.lowerBound_.y - input.p1.y) * inv_d;
		var t2 = (this.upperBound_.y - input.p1.y) * inv_d;
		var s = (-1.0);
		if (t1 > t2) {
			var t3 = t1;
			t1 = t2;
			t2 = t3;
			s = 1.0;
		}
		if (t1 > tmin) {
			output.normal.y = s;
			output.normal.x = 0;
			tmin = t1;
		}
		tmax = Math.min(tmax, t2);
		if (tmin > tmax) {
			return false;
		}
	}
	output.fraction = tmin;
	return true;
};
/**
 * @param {!Box2D.Collision.b2AABB} other
 * @return {boolean}
 */
Box2D.Collision.b2AABB.prototype.TestOverlap = function(other) {
	if ( other.lowerBound_.x - this.upperBound_.x > 0 ) { return false; }
	if ( other.lowerBound_.y - this.upperBound_.y > 0 ) { return false; }
	if ( this.lowerBound_.x - other.upperBound_.x > 0 ) { return false; }
	if ( this.lowerBound_.y - other.upperBound_.y > 0 ) { return false; }
	return true;
};
/**
 * @param {!Box2D.Collision.b2AABB} aabb1
 * @param {!Box2D.Collision.b2AABB} aabb2
 * @return {!Box2D.Collision.b2AABB}
 */
Box2D.Collision.b2AABB.Combine = function(aabb1, aabb2) {
	var aabb = Box2D.Collision.b2AABB.Get();
	aabb.Combine(aabb1, aabb2);
	return aabb;
};
/**
 * @param {!Box2D.Collision.b2AABB} aabb1
 * @param {!Box2D.Collision.b2AABB} aabb2
 */
Box2D.Collision.b2AABB.prototype.Combine = function(aabb1, aabb2) {
	this.lowerBound_.x = Math.min(aabb1.lowerBound_.x, aabb2.lowerBound_.x);
	this.lowerBound_.y = Math.min(aabb1.lowerBound_.y, aabb2.lowerBound_.y);
	this.upperBound_.x = Math.max(aabb1.upperBound_.x, aabb2.upperBound_.x);
	this.upperBound_.y = Math.max(aabb1.upperBound_.y, aabb2.upperBound_.y);
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} vOut
 * @param {!Box2D.Common.Math.b2Vec2} vIn
 * @param {!Box2D.Common.Math.b2Vec2} normal
 * @param {number} offset
 */
Box2D.Collision.b2Collision.ClipSegmentToLine = function(vOut, vIn, normal, offset) {
	var numOut = 0;
	var vIn0 = vIn[0].v;
	var vIn1 = vIn[1].v;
	var distance0 = normal.x * vIn0.x + normal.y * vIn0.y - offset;
	var distance1 = normal.x * vIn1.x + normal.y * vIn1.y - offset;
	if (distance0 <= 0.0) {
		vOut[numOut++].Set(vIn[0]);
	}
	if (distance1 <= 0.0) {
		vOut[numOut++].Set(vIn[1]);
	}
	if (distance0 * distance1 < 0.0) {
		var interp = distance0 / (distance0 - distance1);
		var tVec = vOut[numOut].v;
		tVec.x = vIn0.x + interp * (vIn1.x - vIn0.x);
		tVec.y = vIn0.y + interp * (vIn1.y - vIn0.y);
		if (distance0 > 0.0) {
			vOut[numOut].id = vIn[0].id;
		} else {
			vOut[numOut].id = vIn[1].id;
		}
		numOut++;
	}
	return numOut;
};
/**
 * @param {!Box2D.Collision.Shapes.b2PolygonShape} poly1
 * @param {!Box2D.Common.Math.b2Transform} xf1
 * @param {number} edge1
 * @param {!Box2D.Collision.Shapes.b2PolygonShape} poly2
 * @param {!Box2D.Common.Math.b2Transform} xf1
 * @return {number}
 */
Box2D.Collision.b2Collision.EdgeSeparation = function(poly1, xf1, edge1, poly2, xf2) {
	var normal1WorldX = (xf1.R.col1.x * poly1.m_normals[edge1].x + xf1.R.col2.x * poly1.m_normals[edge1].y);
	var normal1WorldY = (xf1.R.col1.y * poly1.m_normals[edge1].x + xf1.R.col2.y * poly1.m_normals[edge1].y);
	var normal1X = (xf2.R.col1.x * normal1WorldX + xf2.R.col1.y * normal1WorldY);
	var normal1Y = (xf2.R.col2.x * normal1WorldX + xf2.R.col2.y * normal1WorldY);
	var index = 0;
	var minDot = Number.MAX_VALUE;
	for (var i = 0; i < poly2.m_vertexCount; i++) {
		var dot = poly2.m_vertices[i].x * normal1X + poly2.m_vertices[i].y * normal1Y;
		if (dot < minDot) {
			minDot = dot;
			index = i;
		}
	}
	var v1X = xf1.position.x + (xf1.R.col1.x * poly1.m_vertices[edge1].x + xf1.R.col2.x * poly1.m_vertices[edge1].y);
	var v1Y = xf1.position.y + (xf1.R.col1.y * poly1.m_vertices[edge1].x + xf1.R.col2.y * poly1.m_vertices[edge1].y);
	var v2X = xf2.position.x + (xf2.R.col1.x * poly2.m_vertices[index].x + xf2.R.col2.x * poly2.m_vertices[index].y);
	var v2Y = xf2.position.y + (xf2.R.col1.y * poly2.m_vertices[index].x + xf2.R.col2.y * poly2.m_vertices[index].y);
	var separation = (v2X - v1X) * normal1WorldX + (v2Y - v1Y) * normal1WorldY;
	return separation;
};
/**
 * @param {!Box2D.Collision.Shapes.b2PolygonShape} poly1
 * @param {!Box2D.Common.Math.b2Transform} xf1
 * @param {!Box2D.Collision.Shapes.b2PolygonShape} poly2
 * @param {!Box2D.Common.Math.b2Transform} xf1
 * @return {{bestEdge: number, separation: number}}
 */
Box2D.Collision.b2Collision.FindMaxSeparation = function(poly1, xf1, poly2, xf2) {
	var dX = xf2.position.x + (xf2.R.col1.x * poly2.m_centroid.x + xf2.R.col2.x * poly2.m_centroid.y);
	var dY = xf2.position.y + (xf2.R.col1.y * poly2.m_centroid.x + xf2.R.col2.y * poly2.m_centroid.y);
	dX -= xf1.position.x + (xf1.R.col1.x * poly1.m_centroid.x + xf1.R.col2.x * poly1.m_centroid.y);
	dY -= xf1.position.y + (xf1.R.col1.y * poly1.m_centroid.x + xf1.R.col2.y * poly1.m_centroid.y);
	var dLocal1X = (dX * xf1.R.col1.x + dY * xf1.R.col1.y);
	var dLocal1Y = (dX * xf1.R.col2.x + dY * xf1.R.col2.y);
	var edge = 0;
	var maxDot = (-Number.MAX_VALUE);
	for (var i = 0; i < poly1.m_vertexCount; ++i) {
		var dot = (poly1.m_normals[i].x * dLocal1X + poly1.m_normals[i].y * dLocal1Y);
		if (dot > maxDot) {
			maxDot = dot;
			edge = i;
		}
	}
	var s = Box2D.Collision.b2Collision.EdgeSeparation(poly1, xf1, edge, poly2, xf2);
	var prevEdge = edge - 1;
	if (prevEdge < 0) {
		prevEdge = poly1.m_vertexCount - 1;
	}
	var sPrev = Box2D.Collision.b2Collision.EdgeSeparation(poly1, xf1, prevEdge, poly2, xf2);
	var nextEdge = edge + 1;
	if (nextEdge >= poly1.m_vertexCount) {
		nextEdge = 0;
	}
	var sNext = Box2D.Collision.b2Collision.EdgeSeparation(poly1, xf1, nextEdge, poly2, xf2);
	var bestEdge = 0;
	var bestSeparation = 0;
	if (sPrev > s && sPrev > sNext) {
		bestEdge = prevEdge;
		bestSeparation = sPrev;
		while (true) {
			edge = bestEdge - 1;
			if (edge < 0) {
				edge = poly1.m_vertexCount - 1;
			}
			s = Box2D.Collision.b2Collision.EdgeSeparation(poly1, xf1, edge, poly2, xf2);
			if (s > bestSeparation) {
				bestEdge = edge;
				bestSeparation = s;
			} else {
				break;
			}
		}
	} else if (sNext > s) {
		bestEdge = nextEdge;
		bestSeparation = sNext;
		while (true) {
			edge = bestEdge + 1;
			if (edge >= poly1.m_vertexCount) {
				edge = 0;
			}
			s = Box2D.Collision.b2Collision.EdgeSeparation(poly1, xf1, edge, poly2, xf2);
			if (s > bestSeparation) {
				bestEdge = edge;
				bestSeparation = s;
			} else {
				break;
			}
		}
	} else {
		bestEdge = edge;
		bestSeparation = s;
	}
	return {bestEdge: bestEdge, separation: bestSeparation};
};
Box2D.Collision.b2Collision.FindIncidentEdge = function(c, poly1, xf1, edge1, poly2, xf2) {
	if (edge1 === undefined) edge1 = 0;
	var normal1X = (xf1.R.col1.x * poly1.m_normals[edge1].x + xf1.R.col2.x * poly1.m_normals[edge1].y);
	var normal1Y = (xf1.R.col1.y * poly1.m_normals[edge1].x + xf1.R.col2.y * poly1.m_normals[edge1].y);
	var tX = (xf2.R.col1.x * normal1X + xf2.R.col1.y * normal1Y);
	normal1Y = (xf2.R.col2.x * normal1X + xf2.R.col2.y * normal1Y);
	normal1X = tX;
	var i1 = 0;
	var minDot = Number.MAX_VALUE;
	for (var i = 0; i < poly2.m_vertexCount; i++) {
		var dot = (normal1X * poly2.m_normals[i].x + normal1Y * poly2.m_normals[i].y);
		if (dot < minDot) {
			minDot = dot;
			i1 = i;
		}
	}
	var i2 = i1 + 1;
	if (i2 >= poly2.m_vertexCount) {
		i2 = 0;
	}
	c[0].v.x = xf2.position.x + (xf2.R.col1.x * poly2.m_vertices[i1].x + xf2.R.col2.x * poly2.m_vertices[i1].y);
	c[0].v.y = xf2.position.y + (xf2.R.col1.y * poly2.m_vertices[i1].x + xf2.R.col2.y * poly2.m_vertices[i1].y);
	c[0].id.SetReferenceEdge(edge1);
	c[0].id.SetIncidentEdge(i1);
	c[0].id.SetIncidentVertex(0);
	c[1].v.x = xf2.position.x + (xf2.R.col1.x * poly2.m_vertices[i2].x + xf2.R.col2.x * poly2.m_vertices[i2].y);
	c[1].v.y = xf2.position.y + (xf2.R.col1.y * poly2.m_vertices[i2].x + xf2.R.col2.y * poly2.m_vertices[i2].y);
	c[1].id.SetReferenceEdge(edge1);
	c[1].id.SetIncidentEdge(i2);
	c[1].id.SetIncidentVertex(1);
};
Box2D.Collision.b2Collision.MakeClipPointVector = function() {
	return [new Box2D.Collision.ClipVertex(), new Box2D.Collision.ClipVertex()];
};
Box2D.Collision.b2Collision.CollidePolygons = function(manifold, polyA, xfA, polyB, xfB) {
	manifold.m_pointCount = 0;
	var totalRadius = polyA.m_radius + polyB.m_radius;
	var separationEdgeA = Box2D.Collision.b2Collision.FindMaxSeparation(polyA, xfA, polyB, xfB);
	var edge1 = separationEdgeA.bestEdge;
	if (separationEdgeA.separation > totalRadius) {
		return;
	}
	var separationEdgeB = Box2D.Collision.b2Collision.FindMaxSeparation(polyB, xfB, polyA, xfA);
	if (separationEdgeB.separation > totalRadius) {
		return;
	}
	var poly1 = polyA;
	var poly2 = polyB;
	var xf1 = xfA;
	var xf2 = xfB;
	var flip = 0;
	manifold.m_type = Box2D.Collision.b2Manifold.e_faceA;
	if (separationEdgeB.separation > 0.98 /* k_relativeTol */ * separationEdgeA.separation + 0.001 /* k_absoluteTol */ ) {
		poly1 = polyB;
		poly2 = polyA;
		xf1 = xfB;
		xf2 = xfA;
		edge1 = separationEdgeB.bestEdge;
		manifold.m_type = Box2D.Collision.b2Manifold.e_faceB;
		flip = 1;
	}
	var incidentEdge = Box2D.Collision.b2Collision.s_incidentEdge;
	Box2D.Collision.b2Collision.FindIncidentEdge(incidentEdge, poly1, xf1, edge1, poly2, xf2);
	var local_v11 = poly1.m_vertices[edge1];
	var local_v12;
	if (edge1 + 1 < poly1.m_vertexCount) {
		local_v12 = poly1.m_vertices[edge1 + 1];
	} else {
		local_v12 = poly1.m_vertices[0];
	}
	Box2D.Collision.b2Collision.s_localTangent.Set(local_v12.x - local_v11.x, local_v12.y - local_v11.y);
	Box2D.Collision.b2Collision.s_localTangent.Normalize();
	Box2D.Collision.b2Collision.s_localNormal.x = Box2D.Collision.b2Collision.s_localTangent.y;
	Box2D.Collision.b2Collision.s_localNormal.y = (-Box2D.Collision.b2Collision.s_localTangent.x);
	Box2D.Collision.b2Collision.s_planePoint.Set(0.5 * (local_v11.x + local_v12.x), 0.5 * (local_v11.y + local_v12.y));
	Box2D.Collision.b2Collision.s_tangent.x = (xf1.R.col1.x * Box2D.Collision.b2Collision.s_localTangent.x + xf1.R.col2.x * Box2D.Collision.b2Collision.s_localTangent.y);
	Box2D.Collision.b2Collision.s_tangent.y = (xf1.R.col1.y * Box2D.Collision.b2Collision.s_localTangent.x + xf1.R.col2.y * Box2D.Collision.b2Collision.s_localTangent.y);
	Box2D.Collision.b2Collision.s_tangent2.x = (-Box2D.Collision.b2Collision.s_tangent.x);
	Box2D.Collision.b2Collision.s_tangent2.y = (-Box2D.Collision.b2Collision.s_tangent.y);
	Box2D.Collision.b2Collision.s_normal.x = Box2D.Collision.b2Collision.s_tangent.y;
	Box2D.Collision.b2Collision.s_normal.y = (-Box2D.Collision.b2Collision.s_tangent.x);
	Box2D.Collision.b2Collision.s_v11.x = xf1.position.x + (xf1.R.col1.x * local_v11.x + xf1.R.col2.x * local_v11.y);
	Box2D.Collision.b2Collision.s_v11.y = xf1.position.y + (xf1.R.col1.y * local_v11.x + xf1.R.col2.y * local_v11.y);
	Box2D.Collision.b2Collision.s_v12.x = xf1.position.x + (xf1.R.col1.x * local_v12.x + xf1.R.col2.x * local_v12.y);
	Box2D.Collision.b2Collision.s_v12.y = xf1.position.y + (xf1.R.col1.y * local_v12.x + xf1.R.col2.y * local_v12.y);
	var sideOffset1 = (-Box2D.Collision.b2Collision.s_tangent.x * Box2D.Collision.b2Collision.s_v11.x) - Box2D.Collision.b2Collision.s_tangent.y * Box2D.Collision.b2Collision.s_v11.y + totalRadius;
	if (Box2D.Collision.b2Collision.ClipSegmentToLine(Box2D.Collision.b2Collision.s_clipPoints1, incidentEdge, Box2D.Collision.b2Collision.s_tangent2, sideOffset1) < 2) {
		return;
	}
	var sideOffset2 = Box2D.Collision.b2Collision.s_tangent.x * Box2D.Collision.b2Collision.s_v12.x + Box2D.Collision.b2Collision.s_tangent.y * Box2D.Collision.b2Collision.s_v12.y + totalRadius;
	if (Box2D.Collision.b2Collision.ClipSegmentToLine(Box2D.Collision.b2Collision.s_clipPoints2, Box2D.Collision.b2Collision.s_clipPoints1, Box2D.Collision.b2Collision.s_tangent, sideOffset2) < 2) {
		return;
	}
	manifold.m_localPlaneNormal.SetV(Box2D.Collision.b2Collision.s_localNormal);
	manifold.m_localPoint.SetV(Box2D.Collision.b2Collision.s_planePoint);
	var frontOffset = Box2D.Collision.b2Collision.s_normal.x * Box2D.Collision.b2Collision.s_v11.x + Box2D.Collision.b2Collision.s_normal.y * Box2D.Collision.b2Collision.s_v11.y;
	var pointCount = 0;
	for (var i = 0; i < Box2D.Common.b2Settings.b2_maxManifoldPoints; ++i) {
		var separation = Box2D.Collision.b2Collision.s_normal.x * Box2D.Collision.b2Collision.s_clipPoints2[i].v.x + Box2D.Collision.b2Collision.s_normal.y * Box2D.Collision.b2Collision.s_clipPoints2[i].v.y - frontOffset;
		if (separation <= totalRadius) {
			var tX = Box2D.Collision.b2Collision.s_clipPoints2[i].v.x - xf2.position.x;
			var tY = Box2D.Collision.b2Collision.s_clipPoints2[i].v.y - xf2.position.y;
			manifold.m_points[pointCount].m_localPoint.x = (tX * xf2.R.col1.x + tY * xf2.R.col1.y);
			manifold.m_points[pointCount].m_localPoint.y = (tX * xf2.R.col2.x + tY * xf2.R.col2.y);
			manifold.m_points[pointCount].m_id.Set(Box2D.Collision.b2Collision.s_clipPoints2[i].id);
			manifold.m_points[pointCount].m_id.SetFlip(flip);
			pointCount++;
		}
	}
	manifold.m_pointCount = pointCount;
};
Box2D.Collision.b2Collision.CollideCircles = function(manifold, circle1, xf1, circle2, xf2) {
	manifold.m_pointCount = 0;
	var p1X = xf1.position.x + (xf1.R.col1.x * circle1.m_p.x + xf1.R.col2.x * circle1.m_p.y);
	var p1Y = xf1.position.y + (xf1.R.col1.y * circle1.m_p.x + xf1.R.col2.y * circle1.m_p.y);
	var p2X = xf2.position.x + (xf2.R.col1.x * circle2.m_p.x + xf2.R.col2.x * circle2.m_p.y);
	var p2Y = xf2.position.y + (xf2.R.col1.y * circle2.m_p.x + xf2.R.col2.y * circle2.m_p.y);
	var dX = p2X - p1X;
	var dY = p2Y - p1Y;
	var distSqr = dX * dX + dY * dY;
	var radius = circle1.m_radius + circle2.m_radius;
	if (distSqr > radius * radius) {
		return;
	}
	manifold.m_type = Box2D.Collision.b2Manifold.e_circles;
	manifold.m_localPoint.SetV(circle1.m_p);
	manifold.m_localPlaneNormal.SetZero();
	manifold.m_pointCount = 1;
	manifold.m_points[0].m_localPoint.SetV(circle2.m_p);
	manifold.m_points[0].m_id.SetKey(0);
};
Box2D.Collision.b2Collision.CollidePolygonAndCircle = function(manifold, polygon, xf1, circle, xf2) {
	manifold.m_pointCount = 0;
	var dX = xf2.position.x + (xf2.R.col1.x * circle.m_p.x + xf2.R.col2.x * circle.m_p.y) - xf1.position.x;
	var dY = xf2.position.y + (xf2.R.col1.y * circle.m_p.x + xf2.R.col2.y * circle.m_p.y) - xf1.position.y;
	var cLocalX = (dX * xf1.R.col1.x + dY * xf1.R.col1.y);
	var cLocalY = (dX * xf1.R.col2.x + dY * xf1.R.col2.y);
	var normalIndex = 0;
	var separation = (-Number.MAX_VALUE);
	var radius = polygon.m_radius + circle.m_radius;
	for (var i = 0; i < polygon.m_vertexCount; ++i) {
		var s = polygon.m_normals[i].x * (cLocalX - polygon.m_vertices[i].x) + polygon.m_normals[i].y * (cLocalY - polygon.m_vertices[i].y);
		if (s > radius) {
			return;
		}
		if (s > separation) {
			separation = s;
			normalIndex = i;
		}
	}
	var vertIndex2 = normalIndex + 1;
	if (vertIndex2 >= polygon.m_vertexCount) {
		vertIndex2 = 0;
	}
	var v1 = polygon.m_vertices[normalIndex];
	var v2 = polygon.m_vertices[vertIndex2];
	if (separation < Number.MIN_VALUE) {
		manifold.m_pointCount = 1;
		manifold.m_type = Box2D.Collision.b2Manifold.e_faceA;
		manifold.m_localPlaneNormal.SetV(polygon.m_normals[normalIndex]);
		manifold.m_localPoint.x = 0.5 * (v1.x + v2.x);
		manifold.m_localPoint.y = 0.5 * (v1.y + v2.y);
		manifold.m_points[0].m_localPoint.SetV(circle.m_p);
		manifold.m_points[0].m_id.SetKey(0);
	} else {
		var u1 = (cLocalX - v1.x) * (v2.x - v1.x) + (cLocalY - v1.y) * (v2.y - v1.y);
		if (u1 <= 0.0) {
			if ((cLocalX - v1.x) * (cLocalX - v1.x) + (cLocalY - v1.y) * (cLocalY - v1.y) > radius * radius) return;
			manifold.m_pointCount = 1;
			manifold.m_type = Box2D.Collision.b2Manifold.e_faceA;
			manifold.m_localPlaneNormal.x = cLocalX - v1.x;
			manifold.m_localPlaneNormal.y = cLocalY - v1.y;
			manifold.m_localPlaneNormal.Normalize();
			manifold.m_localPoint.SetV(v1);
			manifold.m_points[0].m_localPoint.SetV(circle.m_p);
			manifold.m_points[0].m_id.SetKey(0);
		} else {
			var u2 = (cLocalX - v2.x) * (v1.x - v2.x) + (cLocalY - v2.y) * (v1.y - v2.y);
			if (u2 <= 0) {
				if ((cLocalX - v2.x) * (cLocalX - v2.x) + (cLocalY - v2.y) * (cLocalY - v2.y) > radius * radius) return;
				manifold.m_pointCount = 1;
				manifold.m_type = Box2D.Collision.b2Manifold.e_faceA;
				manifold.m_localPlaneNormal.x = cLocalX - v2.x;
				manifold.m_localPlaneNormal.y = cLocalY - v2.y;
				manifold.m_localPlaneNormal.Normalize();
				manifold.m_localPoint.SetV(v2);
				manifold.m_points[0].m_localPoint.SetV(circle.m_p);
				manifold.m_points[0].m_id.SetKey(0);
			} else {
				var faceCenterX = 0.5 * (v1.x + v2.x);
				var faceCenterY = 0.5 * (v1.y + v2.y);
				separation = (cLocalX - faceCenterX) * polygon.m_normals[normalIndex].x + (cLocalY - faceCenterY) * polygon.m_normals[normalIndex].y;
				if (separation > radius) return;
				manifold.m_pointCount = 1;
				manifold.m_type = Box2D.Collision.b2Manifold.e_faceA;
				manifold.m_localPlaneNormal.x = polygon.m_normals[normalIndex].x;
				manifold.m_localPlaneNormal.y = polygon.m_normals[normalIndex].y;
				manifold.m_localPlaneNormal.Normalize();
				manifold.m_localPoint.Set(faceCenterX, faceCenterY);
				manifold.m_points[0].m_localPoint.SetV(circle.m_p);
				manifold.m_points[0].m_id.SetKey(0);
			}
		}
	}
};
Box2D.Collision.b2Collision.TestOverlap = function(a, b) {
	if (b.lowerBound_.x - a.upperBound_.x > 0) {
		return false;
	}
	if (b.lowerBound_.y - a.upperBound_.y > 0) {
		return false;
	}
	if (a.lowerBound_.x - b.upperBound_.x > 0) {
		return false;
	}
	if (a.lowerBound_.y - b.upperBound_.y > 0) {
		return false;
	}
	return true;
};
/**
 * @constructor
 */
Box2D.Collision.b2ContactPoint = function() {
	this.position = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.velocity = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.normal = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.id = new Box2D.Collision.b2ContactID();
};
/**
 * @param {!Box2D.Collision.b2DistanceOutput} output
 * @param {!Box2D.Collision.b2SimplexCache} cache
 * @param {!Box2D.Collision.b2DistanceInput} input
 */
Box2D.Collision.b2Distance.Distance = function(output, cache, input) {
	var s_simplex = new Box2D.Collision.b2Simplex();
	s_simplex.ReadCache(cache, input.proxyA, input.transformA, input.proxyB, input.transformB);
	if (s_simplex.m_count < 1 || s_simplex.m_count > 3) {
;
	}
	var iter = 0;
	while (iter < 20) {
		var save = [];
		for (var i = 0; i < s_simplex.m_count; i++) {
			save[i] = {};
			save[i].indexA = s_simplex.m_vertices[i].indexA;
			save[i].indexB = s_simplex.m_vertices[i].indexB;
		}
		if (s_simplex.m_count == 2) {
			s_simplex.Solve2();
		} else if (s_simplex.m_count == 3) {
			s_simplex.Solve3();
		}
		if (s_simplex.m_count == 3) {
			break;
		}
		var d = s_simplex.GetSearchDirection();
		if (d.LengthSquared() < Box2D.Common.b2Settings.MIN_VALUE_SQUARED) {
			break;
		}
		var negD = d.GetNegative();
		s_simplex.m_vertices[s_simplex.m_count].indexA = input.proxyA.GetSupport(Box2D.Common.Math.b2Math.MulTMV(input.transformA.R, negD));
		s_simplex.m_vertices[s_simplex.m_count].wA = Box2D.Common.Math.b2Math.MulX(input.transformA, input.proxyA.GetVertex(s_simplex.m_vertices[s_simplex.m_count].indexA));
		s_simplex.m_vertices[s_simplex.m_count].indexB = input.proxyB.GetSupport(Box2D.Common.Math.b2Math.MulTMV(input.transformB.R, d));
		s_simplex.m_vertices[s_simplex.m_count].wB = Box2D.Common.Math.b2Math.MulX(input.transformB, input.proxyB.GetVertex(s_simplex.m_vertices[s_simplex.m_count].indexB));
		s_simplex.m_vertices[s_simplex.m_count].w = Box2D.Common.Math.b2Math.SubtractVV(s_simplex.m_vertices[s_simplex.m_count].wB, s_simplex.m_vertices[s_simplex.m_count].wA);
		Box2D.Common.Math.b2Vec2.Free(d);
		Box2D.Common.Math.b2Vec2.Free(negD);
		iter++;
		var duplicate = false;
		for (var i = 0; i < save.length; i++) {
			if (s_simplex.m_vertices[s_simplex.m_count].indexA == save[i].indexA && s_simplex.m_vertices[s_simplex.m_count].indexB == save[i].indexB) {
				duplicate = true;
				break;
			}
		}
		if (duplicate) {
			break;
		}
		s_simplex.m_count++;
	}
	s_simplex.GetWitnessPoints(output.pointA, output.pointB);
	output.distance = Box2D.Common.Math.b2Math.SubtractVV(output.pointA, output.pointB).Length();
	s_simplex.WriteCache(cache);
	if (input.useRadii) {
		var rA = input.proxyA.m_radius;
		var rB = input.proxyB.m_radius;
		if (output.distance > rA + rB && output.distance > Number.MIN_VALUE) {
			output.distance -= rA + rB;
			var normal = Box2D.Common.Math.b2Math.SubtractVV(output.pointB, output.pointA);
			normal.Normalize();
			output.pointA.x += rA * normal.x;
			output.pointA.y += rA * normal.y;
			output.pointB.x -= rB * normal.x;
			output.pointB.y -= rB * normal.y;
			Box2D.Common.Math.b2Vec2.Free(normal);
		} else {
			var p = Box2D.Common.Math.b2Vec2.Get(0, 0);
			p.x = 0.5 * (output.pointA.x + output.pointB.x);
			p.y = 0.5 * (output.pointA.y + output.pointB.y);
			output.pointA.x = output.pointB.x = p.x;
			output.pointA.y = output.pointB.y = p.y;
			output.distance = 0.0;
			Box2D.Common.Math.b2Vec2.Free(p);
		}
	}
};
/**
 * @constructor
 */
Box2D.Collision.b2DistanceInput = function () {};
/**
 * @constructor
 */
Box2D.Collision.b2DistanceOutput = function () {
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.pointA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.pointB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	/** @type {number} */
	this.distance = 0;
};
/**
 * @constructor
 */
Box2D.Collision.b2DistanceProxy = function() {};
Box2D.Collision.b2DistanceProxy.prototype.Set = function (shape) {
	shape.SetDistanceProxy(this);
};
Box2D.Collision.b2DistanceProxy.prototype.GetSupport = function (d) {
	var bestIndex = 0;
	var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
	for (var i = 1; i < this.m_count; i++) {
		var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
		if (value > bestValue) {
			bestIndex = i;
			bestValue = value;
		}
	}
	return bestIndex;
};
Box2D.Collision.b2DistanceProxy.prototype.GetSupportVertex = function (d) {
	return this.m_vertices[this.GetSupport(d)];
};
Box2D.Collision.b2DistanceProxy.prototype.GetVertexCount = function () {
	return this.m_count;
};
Box2D.Collision.b2DistanceProxy.prototype.GetVertex = function (index) {
	if (index === undefined) index = 0;
;
	return this.m_vertices[index];
};
/**
 * @constructor
 */
Box2D.Collision.b2DynamicTree = function() {
	/** @type {Box2D.Collision.b2DynamicTreeNode} */
	this.m_root = null;
	/** @type {number} */
	this.m_path = 0;
	/** @type {number} */
	this.m_insertionCount = 0;
};
/**
 * @param {!Box2D.Collision.b2AABB} aabb
 * @param {Box2D.Dynamics.b2Fixture} fixture
 * @return {!Box2D.Collision.b2DynamicTreeNode}
 */
Box2D.Collision.b2DynamicTree.prototype.CreateProxy = function(aabb, fixture) {
	var node = Box2D.Collision.b2DynamicTreeNode.Get(fixture);
	var extendX = Box2D.Common.b2Settings.b2_aabbExtension;
	var extendY = Box2D.Common.b2Settings.b2_aabbExtension;
	node.aabb.lowerBound_.x = aabb.lowerBound_.x - extendX;
	node.aabb.lowerBound_.y = aabb.lowerBound_.y - extendY;
	node.aabb.upperBound_.x = aabb.upperBound_.x + extendX;
	node.aabb.upperBound_.y = aabb.upperBound_.y + extendY;
	this.InsertLeaf(node);
	return node;
};
/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} proxy
 */
Box2D.Collision.b2DynamicTree.prototype.DestroyProxy = function(proxy) {
	this.RemoveLeaf(proxy);
	proxy.Destroy();
};
/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} proxy
 * @param {!Box2D.Collision.b2AABB} aabb
 * @param {!Box2D.Common.Math.b2Vec2} displacement
 * @return {boolean}
 */
Box2D.Collision.b2DynamicTree.prototype.MoveProxy = function(proxy, aabb, displacement) {
;
	if (proxy.aabb.Contains(aabb)) {
		return false;
	}
	this.RemoveLeaf(proxy);
	var extendX = Box2D.Common.b2Settings.b2_aabbExtension + Box2D.Common.b2Settings.b2_aabbMultiplier * Math.abs(displacement.x);
	var extendY = Box2D.Common.b2Settings.b2_aabbExtension + Box2D.Common.b2Settings.b2_aabbMultiplier * Math.abs(displacement.y);
	proxy.aabb.lowerBound_.x = aabb.lowerBound_.x - extendX;
	proxy.aabb.lowerBound_.y = aabb.lowerBound_.y - extendY;
	proxy.aabb.upperBound_.x = aabb.upperBound_.x + extendX;
	proxy.aabb.upperBound_.y = aabb.upperBound_.y + extendY;
	this.InsertLeaf(proxy);
	return true;
};
/**
 * @param {number} iterations
 */
Box2D.Collision.b2DynamicTree.prototype.Rebalance = function(iterations) {
	if (this.m_root !== null) {
		for (var i = 0; i < iterations; i++) {
			var node = this.m_root;
			var bit = 0;
			while (!node.IsLeaf()) {
				node = (this.m_path >> bit) & 1 ? node.child2 : node.child1;
				bit = (bit + 1) & 31;
			}
			this.m_path++;
			this.RemoveLeaf(node);
			this.InsertLeaf(node);
		}
	}
};
/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} proxy
 * @return {!Box2D.Collision.b2AABB}
 */
Box2D.Collision.b2DynamicTree.prototype.GetFatAABB = function(proxy) {
	return proxy.aabb;
};
/**
 * @param {function(!Box2D.Dynamics.b2Fixture): boolean} callback
 * @param {!Box2D.Collision.b2AABB} aabb
 */
Box2D.Collision.b2DynamicTree.prototype.Query = function(callback, aabb) {
	if (this.m_root !== null) {
		var stack = [];
		stack.push(this.m_root);
		while (stack.length > 0) {
			var node = stack.pop();
			if (node.aabb.TestOverlap(aabb)) {
				if (node.IsLeaf()) {
					if (!callback(node.fixture)) {
						return;
					}
				} else {
					stack.push(node.child1);
					stack.push(node.child2);
				}
			}
		}
	}
};
/**
 * @param {function(!Box2D.Collision.b2RayCastInput, !Box2D.Dynamics.b2Fixture): number} callback
 * @param {!Box2D.Collision.b2RayCastInput} input
 */
Box2D.Collision.b2DynamicTree.prototype.RayCast = function(callback, input) {
	if (this.m_root === null) {
		return;
	}
	var r = Box2D.Common.Math.b2Math.SubtractVV(input.p1, input.p2);
	r.Normalize();
	var v = Box2D.Common.Math.b2Math.CrossFV(1.0, r);
	var abs_v = Box2D.Common.Math.b2Math.AbsV(v);
	var maxFraction = input.maxFraction;
	var tX = input.p1.x + maxFraction * (input.p2.x - input.p1.x);
	var tY = input.p1.y + maxFraction * (input.p2.y - input.p1.y);
	var segmentAABB = Box2D.Collision.b2AABB.Get();
	segmentAABB.lowerBound_.x = Math.min(input.p1.x, tX);
	segmentAABB.lowerBound_.y = Math.min(input.p1.y, tY);
	segmentAABB.upperBound_.x = Math.max(input.p1.x, tX);
	segmentAABB.upperBound_.y = Math.max(input.p1.y, tY);
	var stack = [];
	stack.push(this.m_root);
	while (stack.length > 0) {
		var node = stack.pop();
		if (!node.aabb.TestOverlap(segmentAABB)) {
			continue;
		}
		var c = node.aabb.GetCenter();
		var h = node.aabb.GetExtents();
		var separation = Math.abs(v.x * (input.p1.x - c.x) + v.y * (input.p1.y - c.y)) - abs_v.x * h.x - abs_v.y * h.y;
		if (separation > 0.0) {
			continue;
		}
		if (node.IsLeaf()) {
			var subInput = new Box2D.Collision.b2RayCastInput(input.p1, input.p2, input.maxFraction);
			maxFraction = callback(input, node.fixture);
			if (maxFraction == 0.0) {
				break;
			}
			if (maxFraction > 0.0) {
				tX = input.p1.x + maxFraction * (input.p2.x - input.p1.x);
				tY = input.p1.y + maxFraction * (input.p2.y - input.p1.y);
				segmentAABB.lowerBound_.x = Math.min(input.p1.x, tX);
				segmentAABB.lowerBound_.y = Math.min(input.p1.y, tY);
				segmentAABB.upperBound_.x = Math.max(input.p1.x, tX);
				segmentAABB.upperBound_.y = Math.max(input.p1.y, tY);
			}
		} else {
			stack.push(node.child1);
			stack.push(node.child2);
		}
	}
	Box2D.Collision.b2AABB.Free(segmentAABB);
};
/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} leaf
 */
Box2D.Collision.b2DynamicTree.prototype.InsertLeaf = function(leaf) {
	this.m_insertionCount++;
	if (this.m_root === null) {
		this.m_root = leaf;
		this.m_root.parent = null;
		return;
	}
	var sibling = this.GetBestSibling(leaf);
	var parent = sibling.parent;
	var node2 = Box2D.Collision.b2DynamicTreeNode.Get();
	node2.parent = parent;
	node2.aabb.Combine(leaf.aabb, sibling.aabb);
	if (parent) {
		if (sibling.parent.child1 == sibling) {
			parent.child1 = node2;
		} else {
			parent.child2 = node2;
		}
		node2.child1 = sibling;
		node2.child2 = leaf;
		sibling.parent = node2;
		leaf.parent = node2;
		while (parent) {
			if (parent.aabb.Contains(node2.aabb)) {
				break;
			}
			parent.aabb.Combine(parent.child1.aabb, parent.child2.aabb);
			node2 = parent;
			parent = parent.parent;
		}
	} else {
		node2.child1 = sibling;
		node2.child2 = leaf;
		sibling.parent = node2;
		leaf.parent = node2;
		this.m_root = node2;
	}
};
/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} leaf
 * @return {!Box2D.Collision.b2DynamicTreeNode}
 */
Box2D.Collision.b2DynamicTree.prototype.GetBestSibling = function(leaf) {
	var center = leaf.aabb.GetCenter();
	var sibling = this.m_root;
	while(!sibling.IsLeaf()) {
		var child1 = sibling.child1;
		var child2 = sibling.child2;
		var norm1 = Math.abs((child1.aabb.lowerBound_.x + child1.aabb.upperBound_.x) / 2 - center.x) + Math.abs((child1.aabb.lowerBound_.y + child1.aabb.upperBound_.y) / 2 - center.y);
		var norm2 = Math.abs((child2.aabb.lowerBound_.x + child2.aabb.upperBound_.x) / 2 - center.x) + Math.abs((child2.aabb.lowerBound_.y + child2.aabb.upperBound_.y) / 2 - center.y);
		if (norm1 < norm2) {
			sibling = child1;
		} else {
			sibling = child2;
		}
	}
	Box2D.Common.Math.b2Vec2.Free(center);
	return sibling;
};
/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} leaf
 */
Box2D.Collision.b2DynamicTree.prototype.RemoveLeaf = function(leaf) {
	if (leaf == this.m_root) {
		this.m_root = null;
		return;
	}
	var node2 = leaf.parent;
	var node1 = node2.parent;
	var sibling;
	if (node2.child1 == leaf) {
		sibling = node2.child2;
	} else {
		sibling = node2.child1;
	}
	if (node1) {
		if (node1.child1 == node2) {
			node1.child1 = sibling;
		} else {
			node1.child2 = sibling;
		}
		sibling.parent = node1;
		while (node1) {
			var oldAABB = node1.aabb;
			node1.aabb.Combine(node1.child1.aabb, node1.child2.aabb);
			if (oldAABB.Contains(node1.aabb)) {
				break;
			}
			node1 = node1.parent;
		}
	} else {
		this.m_root = sibling;
		sibling.parent = null;
	}
	node2.Destroy();
};
/**
 * @constructor
 */
Box2D.Collision.b2DynamicTreeBroadPhase = function() {
	/**
	 * @private
	 * @type {!Box2D.Collision.b2DynamicTree}
	 */
	this.m_tree = new Box2D.Collision.b2DynamicTree();
	/**
	 * @private
	 * @type {Array.<!Box2D.Collision.b2DynamicTreeNode>}
	 */
	this.m_moveBuffer = [];
};
/**
 * @param {!Box2D.Collision.b2AABB} aabb
 * @param {Box2D.Dynamics.b2Fixture} fixture
 * @return {!Box2D.Collision.b2DynamicTreeNode}
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.CreateProxy = function(aabb, fixture) {
	var proxy = this.m_tree.CreateProxy(aabb, fixture);
	this.BufferMove(proxy);
	return proxy;
};
/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} proxy
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.DestroyProxy = function(proxy) {
	this.UnBufferMove(proxy);
	this.m_tree.DestroyProxy(proxy);
};
/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} proxy
 * @param {!Box2D.Collision.b2AABB} aabb
 * @param {!Box2D.Common.Math.b2Vec2} displacement
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.MoveProxy = function(proxy, aabb, displacement) {
	var buffer = this.m_tree.MoveProxy(proxy, aabb, displacement);
	if (buffer) {
		this.BufferMove(proxy);
	}
};
/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} proxyA
 * @param {!Box2D.Collision.b2DynamicTreeNode} proxyB
 * @return {boolean}
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.TestOverlap = function(proxyA, proxyB) {
	var aabbA = this.m_tree.GetFatAABB(proxyA);
	var aabbB = this.m_tree.GetFatAABB(proxyB);
	return aabbA.TestOverlap(aabbB);
};
/**
 * @param {!Box2D.Collision.b2DynamicTreeNode} proxy
 * @return {!Box2D.Collision.b2AABB}
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.GetFatAABB = function(proxy) {
	return this.m_tree.GetFatAABB(proxy);
};
/**
 * @return {number}
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.GetProxyCount = function() {
	return this.m_tree.length;
};
/**
 * @param {function(!Box2D.Dynamics.b2Fixture, !Box2D.Dynamics.b2Fixture)} callback
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.UpdatePairs = function(callback) {
	var __this = this;
	var pairs = [];
	while (this.m_moveBuffer.length > 0) {
		var queryProxy = this.m_moveBuffer.pop();
		var QueryCallback = function(fixture) {
			if (fixture != queryProxy.fixture) {
				pairs.push(new Box2D.Collision.b2DynamicTreePair(queryProxy.fixture, fixture));
			}
			return true;
		};
		var fatAABB = this.m_tree.GetFatAABB(queryProxy);
		this.m_tree.Query(QueryCallback, fatAABB);
	}
	var i = 0;
	while(i < pairs.length) {
		var primaryPair = pairs[i];
		callback(primaryPair.fixtureA, primaryPair.fixtureB);
		i++;
		while(i < pairs.length) {
			var pair = pairs[i];
			if (!(pair.fixtureA == primaryPair.fixtureA && pair.fixtureB == primaryPair.fixtureB)
				&& !(pair.fixtureA == primaryPair.fixtureB && pair.fixtureB == primaryPair.fixtureA)) {
				break;
			}
			i++;
		}
	}
};
/**
 * @param {function(!Box2D.Dynamics.b2Fixture): boolean} callback
 * @param {!Box2D.Collision.b2AABB} aabb
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.Query = function(callback, aabb) {
	this.m_tree.Query(callback, aabb);
};
/**
 * @param {function(!Box2D.Collision.b2RayCastInput, !Box2D.Dynamics.b2Fixture): number} callback
 * @param {!Box2D.Collision.b2RayCastInput} input
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.RayCast = function(callback, input) {
	this.m_tree.RayCast(callback, input);
};
/**
 * @param {number} iterations
 */
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.Rebalance = function(iterations) {
	this.m_tree.Rebalance(iterations);
};
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.BufferMove = function(proxy) {
	this.m_moveBuffer.push(proxy);
};
Box2D.Collision.b2DynamicTreeBroadPhase.prototype.UnBufferMove = function(proxy) {
	cr.arrayFindRemove(this.m_moveBuffer, proxy);
};
Box2D.Collision.b2DynamicTreeBroadPhase.__implements = {};
Box2D.Collision.b2DynamicTreeBroadPhase.__implements[Box2D.Collision.IBroadPhase] = true;
/**
 * @private
 * @param {Box2D.Dynamics.b2Fixture=} fixture
 * @constructor
 */
Box2D.Collision.b2DynamicTreeNode = function(fixture) {
	/** @type {!Box2D.Collision.b2AABB} */
	this.aabb = Box2D.Collision.b2AABB.Get();
	/** @type {Box2D.Collision.b2DynamicTreeNode} */
	this.child1 = null;
	/** @type {Box2D.Collision.b2DynamicTreeNode} */
	this.child2 = null;
	/** @type {Box2D.Collision.b2DynamicTreeNode} */
	this.parent = null;
	/** @type {Box2D.Dynamics.b2Fixture} */
	this.fixture = null;
	if (typeof(fixture) != "undefined") {
		this.fixture = fixture;
	}
};
/**
 * @private
 * @type {Array.<!Box2D.Collision.b2DynamicTreeNode>}
 */
Box2D.Collision.b2DynamicTreeNode._freeCache = [];
/**
 * @param {Box2D.Dynamics.b2Fixture=} fixture
 * @return {!Box2D.Collision.b2DynamicTreeNode}
 */
Box2D.Collision.b2DynamicTreeNode.Get = function(fixture) {
	if (Box2D.Collision.b2DynamicTreeNode._freeCache.length > 0) {
		var node = Box2D.Collision.b2DynamicTreeNode._freeCache.pop();
		if (typeof(fixture) != "undefined") {
			node.fixture = fixture;
		}
		node.aabb.SetZero();
		return node;
	}
	return new Box2D.Collision.b2DynamicTreeNode(fixture);
};
Box2D.Collision.b2DynamicTreeNode.prototype.Destroy = function() {
	this.child1 = null;
	this.child2 = null;
	this.parent = null;
	this.fixture = null;
	Box2D.Collision.b2DynamicTreeNode._freeCache.push(this);
};
/**
 * @return boolean
 */
Box2D.Collision.b2DynamicTreeNode.prototype.IsLeaf = function () {
	return this.child1 === null;
};
/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 * @constructor
 */
Box2D.Collision.b2DynamicTreePair = function(fixtureA, fixtureB) {
	/** @type {!Box2D.Dynamics.b2Fixture} */
	this.fixtureA = fixtureA;
	/** @type {!Box2D.Dynamics.b2Fixture} */
	this.fixtureB = fixtureB;
};
/**
 * @constructor
 */
Box2D.Collision.b2Manifold = function() {
	this.m_pointCount = 0;
	this.m_type = 0;
	this.m_points = [];
	for (var i = 0; i < Box2D.Common.b2Settings.b2_maxManifoldPoints; i++) {
		this.m_points[i] = new Box2D.Collision.b2ManifoldPoint();
	}
	this.m_localPlaneNormal = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localPoint = Box2D.Common.Math.b2Vec2.Get(0, 0);
};
Box2D.Collision.b2Manifold.prototype.Reset = function() {
	for (var i = 0; i < Box2D.Common.b2Settings.b2_maxManifoldPoints; i++) {
		this.m_points[i].Reset();
	}
	this.m_localPlaneNormal.SetZero();
	this.m_localPoint.SetZero();
	this.m_type = 0;
	this.m_pointCount = 0;
};
Box2D.Collision.b2Manifold.prototype.Set = function(m) {
	this.m_pointCount = m.m_pointCount;
	for (var i = 0; i < Box2D.Common.b2Settings.b2_maxManifoldPoints; i++) {
		this.m_points[i].Set(m.m_points[i]);
	}
	this.m_localPlaneNormal.SetV(m.m_localPlaneNormal);
	this.m_localPoint.SetV(m.m_localPoint);
	this.m_type = m.m_type;
};
Box2D.Collision.b2Manifold.prototype.Copy = function() {
	var copy = new Box2D.Collision.b2Manifold();
	copy.Set(this);
	return copy;
};
Box2D.Collision.b2Manifold.e_circles = 0x0001;
Box2D.Collision.b2Manifold.e_faceA = 0x0002;
Box2D.Collision.b2Manifold.e_faceB = 0x0004;
/**
 * @constructor
 */
Box2D.Collision.b2ManifoldPoint = function() {
	this.m_localPoint = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_id = new Box2D.Collision.b2ContactID();
	this.Reset();
};
Box2D.Collision.b2ManifoldPoint.prototype.Reset = function() {
	this.m_localPoint.SetZero();
	this.m_normalImpulse = 0.0;
	this.m_tangentImpulse = 0.0;
	this.m_id.SetKey(0);
};
Box2D.Collision.b2ManifoldPoint.prototype.Set = function(m) {
	this.m_localPoint.SetV(m.m_localPoint);
	this.m_normalImpulse = m.m_normalImpulse;
	this.m_tangentImpulse = m.m_tangentImpulse;
	this.m_id.Set(m.m_id);
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} p1
 * @param {!Box2D.Common.Math.b2Vec2} p2
 * @param {number} maxFraction
 * @constructor
 */
Box2D.Collision.b2RayCastInput = function(p1, p2, maxFraction) {
	  this.p1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	  this.p2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	  if (maxFraction === undefined) maxFraction = 1;
	  if (p1) this.p1.SetV(p1);
	  if (p2) this.p2.SetV(p2);
	  this.maxFraction = maxFraction;
};
/**
 * @constructor
 */
Box2D.Collision.b2RayCastOutput = function() {
	this.normal = Box2D.Common.Math.b2Vec2.Get(0, 0);
};
/**
 * @constructor
 */
Box2D.Collision.b2Segment = function() {
	this.p1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.p2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
};
Box2D.Collision.b2Segment.prototype.TestSegment = function(lambda, normal, segment, maxLambda) {
	if (maxLambda === undefined) maxLambda = 0;
	var s = segment.p1;
	var rX = segment.p2.x - s.x;
	var rY = segment.p2.y - s.y;
	var dX = this.p2.x - this.p1.x;
	var dY = this.p2.y - this.p1.y;
	var nX = dY;
	var nY = (-dX);
	var k_slop = 100.0 * Number.MIN_VALUE;
	var denom = (-(rX * nX + rY * nY));
	if (denom > k_slop) {
		var bX = s.x - this.p1.x;
		var bY = s.y - this.p1.y;
		var a = (bX * nX + bY * nY);
		if (0.0 <= a && a <= maxLambda * denom) {
			var mu2 = (-rX * bY) + rY * bX;
			if ((-k_slop * denom) <= mu2 && mu2 <= denom * (1.0 + k_slop)) {
				a /= denom;
				var nLen = Math.sqrt(nX * nX + nY * nY);
				nX /= nLen;
				nY /= nLen;
				lambda[0] = a;
				normal.Set(nX, nY);
				return true;
			}
		}
	}
	return false;
};
Box2D.Collision.b2Segment.prototype.Extend = function(aabb) {
	this.ExtendForward(aabb);
	this.ExtendBackward(aabb);
};
Box2D.Collision.b2Segment.prototype.ExtendForward = function(aabb) {
	var dX = this.p2.x - this.p1.x;
	var dY = this.p2.y - this.p1.y;
	var lambda = Math.min(dX > 0 ? (aabb.upperBound_.x - this.p1.x) / dX : dX < 0 ? (aabb.lowerBound_.x - this.p1.x) / dX : Number.POSITIVE_INFINITY, dY > 0 ? (aabb.upperBound_.y - this.p1.y) / dY : dY < 0 ? (aabb.lowerBound_.y - this.p1.y) / dY : Number.POSITIVE_INFINITY);
	this.p2.x = this.p1.x + dX * lambda;
	this.p2.y = this.p1.y + dY * lambda;
};
Box2D.Collision.b2Segment.prototype.ExtendBackward = function(aabb) {
	var dX = (-this.p2.x) + this.p1.x;
	var dY = (-this.p2.y) + this.p1.y;
	var lambda = Math.min(dX > 0 ? (aabb.upperBound_.x - this.p2.x) / dX : dX < 0 ? (aabb.lowerBound_.x - this.p2.x) / dX : Number.POSITIVE_INFINITY, dY > 0 ? (aabb.upperBound_.y - this.p2.y) / dY : dY < 0 ? (aabb.lowerBound_.y - this.p2.y) / dY : Number.POSITIVE_INFINITY);
	this.p1.x = this.p2.x + dX * lambda;
	this.p1.y = this.p2.y + dY * lambda;
};
/**
 * @constructor
 */
Box2D.Collision.b2SeparationFunction = function() {
	this.m_localPoint = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_axis = Box2D.Common.Math.b2Vec2.Get(0, 0);
};
Box2D.Collision.b2SeparationFunction.prototype.Initialize = function(cache, proxyA, transformA, proxyB, transformB) {
	this.m_proxyA = proxyA;
	this.m_proxyB = proxyB;
	var count = cache.count;
;
	var localPointA;
	var localPointA1;
	var localPointA2;
	var localPointB;
	var localPointB1;
	var localPointB2;
	var pointAX = 0;
	var pointAY = 0;
	var pointBX = 0;
	var pointBY = 0;
	var normalX = 0;
	var normalY = 0;
	var tMat;
	var tVec;
	var s = 0;
	var sgn = 0;
	if (count == 1) {
		this.m_type = Box2D.Collision.b2SeparationFunction.e_points;
		localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
		localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
		tVec = localPointA;
		tMat = transformA.R;
		pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		tVec = localPointB;
		tMat = transformB.R;
		pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		this.m_axis.x = pointBX - pointAX;
		this.m_axis.y = pointBY - pointAY;
		this.m_axis.Normalize();
	} else if (cache.indexB[0] == cache.indexB[1]) {
		this.m_type = Box2D.Collision.b2SeparationFunction.e_faceA;
		localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
		localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);
		localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
		this.m_localPoint.x = 0.5 * (localPointA1.x + localPointA2.x);
		this.m_localPoint.y = 0.5 * (localPointA1.y + localPointA2.y);
		this.m_axis = Box2D.Common.Math.b2Math.CrossVF(Box2D.Common.Math.b2Math.SubtractVV(localPointA2, localPointA1), 1.0);
		this.m_axis.Normalize();
		tVec = this.m_axis;
		tMat = transformA.R;
		normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
		normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
		tVec = this.m_localPoint;
		tMat = transformA.R;
		pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		tVec = localPointB;
		tMat = transformB.R;
		pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		s = (pointBX - pointAX) * normalX + (pointBY - pointAY) * normalY;
		if (s < 0.0) {
			this.m_axis.NegativeSelf();
		}
	} else if (cache.indexA[0] == cache.indexA[0]) {
		this.m_type = Box2D.Collision.b2SeparationFunction.e_faceB;
		localPointB1 = this.m_proxyB.GetVertex(cache.indexB[0]);
		localPointB2 = this.m_proxyB.GetVertex(cache.indexB[1]);
		localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
		this.m_localPoint.x = 0.5 * (localPointB1.x + localPointB2.x);
		this.m_localPoint.y = 0.5 * (localPointB1.y + localPointB2.y);
		this.m_axis = Box2D.Common.Math.b2Math.CrossVF(Box2D.Common.Math.b2Math.SubtractVV(localPointB2, localPointB1), 1.0);
		this.m_axis.Normalize();
		tVec = this.m_axis;
		tMat = transformB.R;
		normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
		normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
		tVec = this.m_localPoint;
		tMat = transformB.R;
		pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		tVec = localPointA;
		tMat = transformA.R;
		pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
		pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
		s = (pointAX - pointBX) * normalX + (pointAY - pointBY) * normalY;
		if (s < 0.0) {
			this.m_axis.NegativeSelf();
		}
	} else {
		localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
		localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);
		localPointB1 = this.m_proxyB.GetVertex(cache.indexB[0]);
		localPointB2 = this.m_proxyB.GetVertex(cache.indexB[1]);
		var dA = Box2D.Common.Math.b2Math.MulMV(transformA.R, Box2D.Common.Math.b2Math.SubtractVV(localPointA2, localPointA1));
		var dB = Box2D.Common.Math.b2Math.MulMV(transformB.R, Box2D.Common.Math.b2Math.SubtractVV(localPointB2, localPointB1));
		var a = dA.x * dA.x + dA.y * dA.y;
		var e = dB.x * dB.x + dB.y * dB.y;
		var r = Box2D.Common.Math.b2Math.SubtractVV(dB, dA);
		var c = dA.x * r.x + dA.y * r.y;
		var f = dB.x * r.x + dB.y * r.y;
		var b = dA.x * dB.x + dA.y * dB.y;
		var denom = a * e - b * b;
		s = 0.0;
		if (denom != 0.0) {
			s = Box2D.Common.Math.b2Math.Clamp((b * f - c * e) / denom, 0.0, 1.0);
		}
		var t = (b * s + f) / e;
		if (t < 0.0) {
			t = 0.0;
			s = Box2D.Common.Math.b2Math.Clamp((b - c) / a, 0.0, 1.0);
		}
		localPointA = Box2D.Common.Math.b2Vec2.Get(0, 0);
		localPointA.x = localPointA1.x + s * (localPointA2.x - localPointA1.x);
		localPointA.y = localPointA1.y + s * (localPointA2.y - localPointA1.y);
		localPointB = Box2D.Common.Math.b2Vec2.Get(0, 0);
		localPointB.x = localPointB1.x + s * (localPointB2.x - localPointB1.x);
		localPointB.y = localPointB1.y + s * (localPointB2.y - localPointB1.y);
		if (s == 0.0 || s == 1.0) {
			this.m_type = Box2D.Collision.b2SeparationFunction.e_faceB;
			this.m_axis = Box2D.Common.Math.b2Math.CrossVF(Box2D.Common.Math.b2Math.SubtractVV(localPointB2, localPointB1), 1.0);
			this.m_axis.Normalize();
			this.m_localPoint = localPointB;
			tVec = this.m_axis;
			tMat = transformB.R;
			normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			tVec = this.m_localPoint;
			tMat = transformB.R;
			pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
			pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
			tVec = localPointA;
			tMat = transformA.R;
			pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
			pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
			sgn = (pointAX - pointBX) * normalX + (pointAY - pointBY) * normalY;
			if (s < 0.0) {
				this.m_axis.NegativeSelf();
			}
		} else {
			this.m_type = Box2D.Collision.b2SeparationFunction.e_faceA;
			this.m_axis = Box2D.Common.Math.b2Math.CrossVF(Box2D.Common.Math.b2Math.SubtractVV(localPointA2, localPointA1), 1.0);
			this.m_localPoint = localPointA;
			tVec = this.m_axis;
			tMat = transformA.R;
			normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			tVec = this.m_localPoint;
			tMat = transformA.R;
			pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
			pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
			tVec = localPointB;
			tMat = transformB.R;
			pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
			pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
			sgn = (pointBX - pointAX) * normalX + (pointBY - pointAY) * normalY;
			if (s < 0.0) {
				this.m_axis.NegativeSelf();
			}
		}
	}
};
Box2D.Collision.b2SeparationFunction.prototype.Evaluate = function(transformA, transformB) {
	var axisA;
	var axisB;
	var localPointA;
	var localPointB;
	var pointA;
	var pointB;
	var seperation = 0;
	var normal;
	switch (this.m_type) {
	case Box2D.Collision.b2SeparationFunction.e_points:
		axisA = Box2D.Common.Math.b2Math.MulTMV(transformA.R, this.m_axis);
		axisB = Box2D.Common.Math.b2Math.MulTMV(transformB.R, this.m_axis.GetNegative());
		localPointA = this.m_proxyA.GetSupportVertex(axisA);
		localPointB = this.m_proxyB.GetSupportVertex(axisB);
		pointA = Box2D.Common.Math.b2Math.MulX(transformA, localPointA);
		pointB = Box2D.Common.Math.b2Math.MulX(transformB, localPointB);
		seperation = (pointB.x - pointA.x) * this.m_axis.x + (pointB.y - pointA.y) * this.m_axis.y;
		break;
	case Box2D.Collision.b2SeparationFunction.e_faceA:
		normal = Box2D.Common.Math.b2Math.MulMV(transformA.R, this.m_axis);
		pointA = Box2D.Common.Math.b2Math.MulX(transformA, this.m_localPoint);
		axisB = Box2D.Common.Math.b2Math.MulTMV(transformB.R, normal.GetNegative());
		localPointB = this.m_proxyB.GetSupportVertex(axisB);
		pointB = Box2D.Common.Math.b2Math.MulX(transformB, localPointB);
		seperation = (pointB.x - pointA.x) * normal.x + (pointB.y - pointA.y) * normal.y;
		break;
	case Box2D.Collision.b2SeparationFunction.e_faceB:
		normal = Box2D.Common.Math.b2Math.MulMV(transformB.R, this.m_axis);
		pointB = Box2D.Common.Math.b2Math.MulX(transformB, this.m_localPoint);
		axisA = Box2D.Common.Math.b2Math.MulTMV(transformA.R, normal.GetNegative());
		localPointA = this.m_proxyA.GetSupportVertex(axisA);
		pointA = Box2D.Common.Math.b2Math.MulX(transformA, localPointA);
		seperation = (pointA.x - pointB.x) * normal.x + (pointA.y - pointB.y) * normal.y;
		break;
	default:
;
		break;
	}
	return seperation;
};
Box2D.Collision.b2SeparationFunction.e_points = 0x01;
Box2D.Collision.b2SeparationFunction.e_faceA = 0x02;
Box2D.Collision.b2SeparationFunction.e_faceB = 0x04;
/**
 * @constructor
 */
Box2D.Collision.b2Simplex = function() {
	this.m_v1 = new Box2D.Collision.b2SimplexVertex();
	this.m_v2 = new Box2D.Collision.b2SimplexVertex();
	this.m_v3 = new Box2D.Collision.b2SimplexVertex();
	this.m_vertices = [this.m_v1, this.m_v2, this.m_v3];
};
Box2D.Collision.b2Simplex.prototype.ReadCache = function(cache, proxyA, transformA, proxyB, transformB) {
;
	var wALocal;
	var wBLocal;
	this.m_count = cache.count;
	var vertices = this.m_vertices;
	for (var i = 0; i < this.m_count; i++) {
		var v = vertices[i];
		v.indexA = cache.indexA[i];
		v.indexB = cache.indexB[i];
		wALocal = proxyA.GetVertex(v.indexA);
		wBLocal = proxyB.GetVertex(v.indexB);
		v.wA = Box2D.Common.Math.b2Math.MulX(transformA, wALocal);
		v.wB = Box2D.Common.Math.b2Math.MulX(transformB, wBLocal);
		v.w = Box2D.Common.Math.b2Math.SubtractVV(v.wB, v.wA);
		v.a = 0;
	}
	if (this.m_count > 1) {
		var metric1 = cache.metric;
		var metric2 = this.GetMetric();
		if (metric2 < .5 * metric1 || 2.0 * metric1 < metric2 || metric2 < Number.MIN_VALUE) {
			this.m_count = 0;
		}
	}
	if (this.m_count == 0) {
		v = vertices[0];
		v.indexA = 0;
		v.indexB = 0;
		wALocal = proxyA.GetVertex(0);
		wBLocal = proxyB.GetVertex(0);
		v.wA = Box2D.Common.Math.b2Math.MulX(transformA, wALocal);
		v.wB = Box2D.Common.Math.b2Math.MulX(transformB, wBLocal);
		v.w = Box2D.Common.Math.b2Math.SubtractVV(v.wB, v.wA);
		this.m_count = 1;
	}
};
Box2D.Collision.b2Simplex.prototype.WriteCache = function(cache) {
	cache.metric = this.GetMetric();
	cache.count = this.m_count;
	var vertices = this.m_vertices;
	for (var i = 0; i < this.m_count; i++) {
		cache.indexA[i] = vertices[i].indexA;
		cache.indexB[i] = vertices[i].indexB;
	}
};
Box2D.Collision.b2Simplex.prototype.GetSearchDirection = function() {
	if (this.m_count == 1) {
		return this.m_v1.w.GetNegative();
	} else if (this.m_count == 2) {
			var e12 = Box2D.Common.Math.b2Math.SubtractVV(this.m_v2.w, this.m_v1.w);
			var sgn = Box2D.Common.Math.b2Math.CrossVV(e12, this.m_v1.w.GetNegative());
			if (sgn > 0.0) {
				return Box2D.Common.Math.b2Math.CrossFV(1.0, e12);
			}
			else {
				return Box2D.Common.Math.b2Math.CrossVF(e12, 1.0);
			}
	} else {
;
		return Box2D.Common.Math.b2Vec2.Get(0, 0);
	}
};
Box2D.Collision.b2Simplex.prototype.GetClosestPoint = function() {
	if (this.m_count == 1) {
		return this.m_v1.w;
	} else if (this.m_count == 2) {
		return Box2D.Common.Math.b2Vec2.Get(this.m_v1.a * this.m_v1.w.x + this.m_v2.a * this.m_v2.w.x, this.m_v1.a * this.m_v1.w.y + this.m_v2.a * this.m_v2.w.y);
	} else {
;
		return Box2D.Common.Math.b2Vec2.Get(0, 0);
	}
};
Box2D.Collision.b2Simplex.prototype.GetWitnessPoints = function(pA, pB) {
	if (this.m_count == 1) {
		pA.SetV(this.m_v1.wA);
		pB.SetV(this.m_v1.wB);
	} else if (this.m_count == 2) {
		pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x;
		pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y;
		pB.x = this.m_v1.a * this.m_v1.wB.x + this.m_v2.a * this.m_v2.wB.x;
		pB.y = this.m_v1.a * this.m_v1.wB.y + this.m_v2.a * this.m_v2.wB.y;
	} else if (this.m_count == 3) {
		pB.x = pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x + this.m_v3.a * this.m_v3.wA.x;
		pB.y = pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y + this.m_v3.a * this.m_v3.wA.y;
	} else {
;
	}
};
Box2D.Collision.b2Simplex.prototype.GetMetric = function() {
	if (this.m_count == 1) {
		return 0.0;
	} else if (this.m_count == 2) {
		return Box2D.Common.Math.b2Math.SubtractVV(this.m_v1.w, this.m_v2.w).Length();
	} else if (this.m_count == 3) {
		return Box2D.Common.Math.b2Math.CrossVV(Box2D.Common.Math.b2Math.SubtractVV(this.m_v2.w, this.m_v1.w), Box2D.Common.Math.b2Math.SubtractVV(this.m_v3.w, this.m_v1.w));
	} else {
;
		return 0.0;
	}
};
Box2D.Collision.b2Simplex.prototype.Solve2 = function() {
	var w1 = this.m_v1.w;
	var w2 = this.m_v2.w;
	var e12 = Box2D.Common.Math.b2Math.SubtractVV(w2, w1);
	var d12_2 = (-(w1.x * e12.x + w1.y * e12.y));
	if (d12_2 <= 0.0) {
		this.m_v1.a = 1.0;
		this.m_count = 1;
		return;
	}
	var d12_1 = (w2.x * e12.x + w2.y * e12.y);
	if (d12_1 <= 0.0) {
		this.m_v2.a = 1.0;
		this.m_count = 1;
		this.m_v1.Set(this.m_v2);
		return;
	}
	var inv_d12 = 1.0 / (d12_1 + d12_2);
	this.m_v1.a = d12_1 * inv_d12;
	this.m_v2.a = d12_2 * inv_d12;
	this.m_count = 2;
};
Box2D.Collision.b2Simplex.prototype.Solve3 = function() {
	var w1 = this.m_v1.w;
	var w2 = this.m_v2.w;
	var w3 = this.m_v3.w;
	var e12 = Box2D.Common.Math.b2Math.SubtractVV(w2, w1);
	var w1e12 = Box2D.Common.Math.b2Math.Dot(w1, e12);
	var w2e12 = Box2D.Common.Math.b2Math.Dot(w2, e12);
	var d12_1 = w2e12;
	var d12_2 = (-w1e12);
	var e13 = Box2D.Common.Math.b2Math.SubtractVV(w3, w1);
	var w1e13 = Box2D.Common.Math.b2Math.Dot(w1, e13);
	var w3e13 = Box2D.Common.Math.b2Math.Dot(w3, e13);
	var d13_1 = w3e13;
	var d13_2 = (-w1e13);
	var e23 = Box2D.Common.Math.b2Math.SubtractVV(w3, w2);
	var w2e23 = Box2D.Common.Math.b2Math.Dot(w2, e23);
	var w3e23 = Box2D.Common.Math.b2Math.Dot(w3, e23);
	var d23_1 = w3e23;
	var d23_2 = (-w2e23);
	var n123 = Box2D.Common.Math.b2Math.CrossVV(e12, e13);
	var d123_1 = n123 * Box2D.Common.Math.b2Math.CrossVV(w2, w3);
	var d123_2 = n123 * Box2D.Common.Math.b2Math.CrossVV(w3, w1);
	var d123_3 = n123 * Box2D.Common.Math.b2Math.CrossVV(w1, w2);
	if (d12_2 <= 0.0 && d13_2 <= 0.0) {
		this.m_v1.a = 1.0;
		this.m_count = 1;
		return;
	}
	if (d12_1 > 0.0 && d12_2 > 0.0 && d123_3 <= 0.0) {
		var inv_d12 = 1.0 / (d12_1 + d12_2);
		this.m_v1.a = d12_1 * inv_d12;
		this.m_v2.a = d12_2 * inv_d12;
		this.m_count = 2;
		return;
	}
	if (d13_1 > 0.0 && d13_2 > 0.0 && d123_2 <= 0.0) {
		var inv_d13 = 1.0 / (d13_1 + d13_2);
		this.m_v1.a = d13_1 * inv_d13;
		this.m_v3.a = d13_2 * inv_d13;
		this.m_count = 2;
		this.m_v2.Set(this.m_v3);
		return;
	}
	if (d12_1 <= 0.0 && d23_2 <= 0.0) {
		this.m_v2.a = 1.0;
		this.m_count = 1;
		this.m_v1.Set(this.m_v2);
		return;
	}
	if (d13_1 <= 0.0 && d23_1 <= 0.0) {
		this.m_v3.a = 1.0;
		this.m_count = 1;
		this.m_v1.Set(this.m_v3);
		return;
	}
	if (d23_1 > 0.0 && d23_2 > 0.0 && d123_1 <= 0.0) {
		var inv_d23 = 1.0 / (d23_1 + d23_2);
		this.m_v2.a = d23_1 * inv_d23;
		this.m_v3.a = d23_2 * inv_d23;
		this.m_count = 2;
		this.m_v1.Set(this.m_v3);
		return;
	}
	var inv_d123 = 1.0 / (d123_1 + d123_2 + d123_3);
	this.m_v1.a = d123_1 * inv_d123;
	this.m_v2.a = d123_2 * inv_d123;
	this.m_v3.a = d123_3 * inv_d123;
	this.m_count = 3;
};
/**
 * @constructor
 */
Box2D.Collision.b2SimplexCache = function() {
	this.indexA = [0, 0, 0];
	this.indexB = [0, 0, 0];
};
/**
 * @constructor
 */
Box2D.Collision.b2SimplexVertex = function() {};
Box2D.Collision.b2SimplexVertex.prototype.Set = function(other) {
	this.wA.SetV(other.wA);
	this.wB.SetV(other.wB);
	this.w.SetV(other.w);
	this.a = other.a;
	this.indexA = other.indexA;
	this.indexB = other.indexB;
};
/**
 * @constructor
 */
Box2D.Collision.b2TOIInput = function() {
	this.proxyA = new Box2D.Collision.b2DistanceProxy();
	this.proxyB = new Box2D.Collision.b2DistanceProxy();
	this.sweepA = new Box2D.Common.Math.b2Sweep();
	this.sweepB = new Box2D.Common.Math.b2Sweep();
};
Box2D.Collision.b2TimeOfImpact = {};
Box2D.Collision.b2TimeOfImpact.TimeOfImpact = function(input) {
	Box2D.Collision.b2TimeOfImpact.b2_toiCalls++;
	var proxyA = input.proxyA;
	var proxyB = input.proxyB;
	var sweepA = input.sweepA;
	var sweepB = input.sweepB;
;
;
	var radius = proxyA.m_radius + proxyB.m_radius;
	var tolerance = input.tolerance;
	var alpha = 0.0;
	var k_maxIterations = 1000;
	var iter = 0;
	var target = 0.0;
	Box2D.Collision.b2TimeOfImpact.s_cache.count = 0;
	Box2D.Collision.b2TimeOfImpact.s_distanceInput.useRadii = false;
	for (;;) {
		sweepA.GetTransform(Box2D.Collision.b2TimeOfImpact.s_xfA, alpha);
		sweepB.GetTransform(Box2D.Collision.b2TimeOfImpact.s_xfB, alpha);
		Box2D.Collision.b2TimeOfImpact.s_distanceInput.proxyA = proxyA;
		Box2D.Collision.b2TimeOfImpact.s_distanceInput.proxyB = proxyB;
		Box2D.Collision.b2TimeOfImpact.s_distanceInput.transformA = Box2D.Collision.b2TimeOfImpact.s_xfA;
		Box2D.Collision.b2TimeOfImpact.s_distanceInput.transformB = Box2D.Collision.b2TimeOfImpact.s_xfB;
		Box2D.Collision.b2Distance.Distance(Box2D.Collision.b2TimeOfImpact.s_distanceOutput, Box2D.Collision.b2TimeOfImpact.s_cache, Box2D.Collision.b2TimeOfImpact.s_distanceInput);
		if (Box2D.Collision.b2TimeOfImpact.s_distanceOutput.distance <= 0.0) {
			alpha = 1.0;
			break;
		}
		Box2D.Collision.b2TimeOfImpact.s_fcn.Initialize(Box2D.Collision.b2TimeOfImpact.s_cache, proxyA, Box2D.Collision.b2TimeOfImpact.s_xfA, proxyB, Box2D.Collision.b2TimeOfImpact.s_xfB);
		var separation = Box2D.Collision.b2TimeOfImpact.s_fcn.Evaluate(Box2D.Collision.b2TimeOfImpact.s_xfA, Box2D.Collision.b2TimeOfImpact.s_xfB);
		if (separation <= 0.0) {
			alpha = 1.0;
			break;
		}
		if (iter == 0) {
			if (separation > radius) {
				target = Math.max(radius - tolerance, 0.75 * radius);
			} else {
				target = Math.max(separation - tolerance, 0.02 * radius);
			}
		}
		if (separation - target < 0.5 * tolerance) {
			if (iter == 0) {
				alpha = 1.0;
				break;
			}
			break;
		}
		var newAlpha = alpha; {
			var x1 = alpha;
			var x2 = 1.0;
			var f1 = separation;
			sweepA.GetTransform(Box2D.Collision.b2TimeOfImpact.s_xfA, x2);
			sweepB.GetTransform(Box2D.Collision.b2TimeOfImpact.s_xfB, x2);
			var f2 = Box2D.Collision.b2TimeOfImpact.s_fcn.Evaluate(Box2D.Collision.b2TimeOfImpact.s_xfA, Box2D.Collision.b2TimeOfImpact.s_xfB);
			if (f2 >= target) {
				alpha = 1.0;
				break;
			}
			var rootIterCount = 0;
			for (;;) {
				var x = 0;
				if (rootIterCount & 1) {
					x = x1 + (target - f1) * (x2 - x1) / (f2 - f1);
				} else {
					x = 0.5 * (x1 + x2);
				}
				sweepA.GetTransform(Box2D.Collision.b2TimeOfImpact.s_xfA, x);
				sweepB.GetTransform(Box2D.Collision.b2TimeOfImpact.s_xfB, x);
				var f = Box2D.Collision.b2TimeOfImpact.s_fcn.Evaluate(Box2D.Collision.b2TimeOfImpact.s_xfA, Box2D.Collision.b2TimeOfImpact.s_xfB);
				if (Math.abs(f - target) < 0.025 * tolerance) {
					newAlpha = x;
					break;
				}
				if (f > target) {
					x1 = x;
					f1 = f;
				} else {
					x2 = x;
					f2 = f;
				}
				rootIterCount++;
				Box2D.Collision.b2TimeOfImpact.b2_toiRootIters++;
				if (rootIterCount == 50) {
					break;
				}
			}
			Box2D.Collision.b2TimeOfImpact.b2_toiMaxRootIters = Math.max(Box2D.Collision.b2TimeOfImpact.b2_toiMaxRootIters, rootIterCount);
		}
		if (newAlpha < (1.0 + 100.0 * Number.MIN_VALUE) * alpha) {
			break;
		}
		alpha = newAlpha;
		iter++;
		Box2D.Collision.b2TimeOfImpact.b2_toiIters++;
		if (iter == k_maxIterations) {
			break;
		}
	}
	Box2D.Collision.b2TimeOfImpact.b2_toiMaxIters = Math.max(Box2D.Collision.b2TimeOfImpact.b2_toiMaxIters, iter);
	return alpha;
};
/**
 * @constructor
 */
Box2D.Collision.b2WorldManifold = function() {
	/** @type  {!Box2D.Common.Math.b2Vec2} */
	this.m_normal = Box2D.Common.Math.b2Vec2.Get(0, 0);
	/** @type {Array.<!Box2D.Common.Math.b2Vec2>} */
	this.m_points = [];
	/** @type {number} */
	this.m_pointCount = 0;
	for (var i = 0; i < Box2D.Common.b2Settings.b2_maxManifoldPoints; i++) {
		this.m_points[i] = Box2D.Common.Math.b2Vec2.Get(0, 0);
	}
};
/**
 * @param {!Box2D.Collision.b2Manifold} manifold
 * @param {!Box2D.Common.Math.b2Transform} xfA
 * @param {number} radiusA
 * @param {!Box2D.Common.Math.b2Transform} xfB
 * @param {number} radiusB
 */
Box2D.Collision.b2WorldManifold.prototype.Initialize = function(manifold, xfA, radiusA, xfB, radiusB) {
	if (manifold.m_pointCount == 0) {
		return;
	}
	var i = 0;
	var tVec;
	var tMat;
	var normalX = 0;
	var normalY = 0;
	var planePointX = 0;
	var planePointY = 0;
	var clipPointX = 0;
	var clipPointY = 0;
	switch (manifold.m_type) {
		case Box2D.Collision.b2Manifold.e_circles:
			tMat = xfA.R;
			tVec = manifold.m_localPoint;
			var pointAX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			var pointAY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			tMat = xfB.R;
			tVec = manifold.m_points[0].m_localPoint;
			var pointBX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			var pointBY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			var dX = pointBX - pointAX;
			var dY = pointBY - pointAY;
			var d2 = dX * dX + dY * dY;
			if (d2 > Box2D.Common.b2Settings.MIN_VALUE_SQUARED) {
				var d = Math.sqrt(d2);
				this.m_normal.x = dX / d;
				this.m_normal.y = dY / d;
			} else {
				this.m_normal.x = 1;
				this.m_normal.y = 0;
			}
			var cAX = pointAX + radiusA * this.m_normal.x;
			var cAY = pointAY + radiusA * this.m_normal.y;
			var cBX = pointBX - radiusB * this.m_normal.x;
			var cBY = pointBY - radiusB * this.m_normal.y;
			this.m_points[0].x = 0.5 * (cAX + cBX);
			this.m_points[0].y = 0.5 * (cAY + cBY);
			break;
		case Box2D.Collision.b2Manifold.e_faceA:
			tMat = xfA.R;
			tVec = manifold.m_localPlaneNormal;
			normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			tMat = xfA.R;
			tVec = manifold.m_localPoint;
			planePointX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			planePointY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			this.m_normal.x = normalX;
			this.m_normal.y = normalY;
			for (i = 0; i < manifold.m_pointCount; i++) {
				tMat = xfB.R;
				tVec = manifold.m_points[i].m_localPoint;
				clipPointX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
				clipPointY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
				this.m_points[i].x = clipPointX + 0.5 * (radiusA - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusB) * normalX;
				this.m_points[i].y = clipPointY + 0.5 * (radiusA - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusB) * normalY;
			}
			break;
		case Box2D.Collision.b2Manifold.e_faceB:
			tMat = xfB.R;
			tVec = manifold.m_localPlaneNormal;
			normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			tMat = xfB.R;
			tVec = manifold.m_localPoint;
			planePointX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
			planePointY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
			this.m_normal.x = (-normalX);
			this.m_normal.y = (-normalY);
			for (i = 0; i < manifold.m_pointCount; i++) {
				tMat = xfA.R;
				tVec = manifold.m_points[i].m_localPoint;
				clipPointX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
				clipPointY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
				this.m_points[i].x = clipPointX + 0.5 * (radiusB - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusA) * normalX;
				this.m_points[i].y = clipPointY + 0.5 * (radiusB - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusA) * normalY;
			}
			break;
	}
};
/**
 * @param {!Box2D.Dynamics.b2BodyDef} bd
 * @param {!Box2D.Dynamics.b2World} world
 * @constructor
 */
Box2D.Dynamics.b2Body = function(bd, world) {
	/**
	 * @const
	 * @private
	 * @type {string}
	 */
	this.ID = "Body" + Box2D.Dynamics.b2Body.NEXT_ID++;
	/**
	 * @private
	 * @type {!Box2D.Common.Math.b2Transform}
	 */
	this.m_xf = new Box2D.Common.Math.b2Transform();
	this.m_xf.position.SetV(bd.position);
	this.m_xf.R.Set(bd.angle);
	/**
	 * @private
	 * @type {!Box2D.Common.Math.b2Sweep}
	 */
	this.m_sweep = new Box2D.Common.Math.b2Sweep();
	this.m_sweep.localCenter.SetZero();
	this.m_sweep.t0 = 1.0;
	this.m_sweep.a0 = this.m_sweep.a = bd.angle;
	this.m_sweep.c.x = (this.m_xf.R.col1.x * this.m_sweep.localCenter.x + this.m_xf.R.col2.x * this.m_sweep.localCenter.y);
	this.m_sweep.c.y = (this.m_xf.R.col1.y * this.m_sweep.localCenter.x + this.m_xf.R.col2.y * this.m_sweep.localCenter.y);
	this.m_sweep.c.x += this.m_xf.position.x;
	this.m_sweep.c.y += this.m_xf.position.y;
	this.m_sweep.c0.SetV(this.m_sweep.c);
	/**
	  * @private
	  * @type {!Box2D.Common.Math.b2Vec2}
	  */
	this.m_linearVelocity = bd.linearVelocity.Copy();
	/**
	  * @private
	  * @type {!Box2D.Common.Math.b2Vec2}
	  */
	this.m_force = Box2D.Common.Math.b2Vec2.Get(0, 0);
	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_bullet = bd.bullet;
	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_fixedRotation = bd.fixedRotation;
	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_allowSleep = bd.allowSleep;
	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_awake = bd.awake;
	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_active = bd.active;
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2World}
	 */
	this.m_world = world;
	/**
	 * @private
	 * @type {Box2D.Dynamics.Joints.b2Joint}
	 */
	this.m_jointList = null;
	/**
	 * @private
	 * @type {!Box2D.Dynamics.Contacts.b2ContactList}
	 */
	 this.contactList = new Box2D.Dynamics.Contacts.b2ContactList();
	/**
	 * @private
	 * @type {!Box2D.Dynamics.Controllers.b2ControllerList}
	 */
	this.controllerList = new Box2D.Dynamics.Controllers.b2ControllerList();
	/**
	 * @private
	 * @type {number}
	 */
	this.m_controllerCount = 0;
	/**
	 * @private
	 * @type {number}
	 */
	this.m_angularVelocity = bd.angularVelocity;
	/**
	 * @private
	 * @type {number}
	 */
	this.m_linearDamping = bd.linearDamping;
	/**
	 * @private
	 * @type {number}
	 */
	this.m_angularDamping = bd.angularDamping;
	/**
	 * @private
	 * @type {number}
	 */
	this.m_torque = 0;
	/**
	 * @private
	 * @type {number}
	 */
	this.m_sleepTime = 0;
	/**
	 * @private
	 * @type {number}
	 */
	this.m_type = bd.type;
	/**
	 * @private
	 * @type {number}
	 */
	this.m_mass = this.m_type == Box2D.Dynamics.b2BodyDef.b2_dynamicBody ? 1 : 0;
	/**
	 * @private
	 * @type {number}
	 */
	this.m_invMass = this.m_type == Box2D.Dynamics.b2BodyDef.b2_dynamicBody ? 1 : 0;
	/**
	 * @private
	 * @type {number}
	 */
	this.m_I = 0;
	/**
	 * @private
	 * @type {number}
	 */
	this.m_invI = 0;
	/**
	 * @private
	 * @type {number}
	 */
	this.m_inertiaScale = bd.inertiaScale;
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2FixtureList}
	 */
	this.fixtureList = new Box2D.Dynamics.b2FixtureList();
	/**
	 * @private
	 * @type {Array.<!Box2D.Dynamics.b2BodyList>}
	 */
	 this.m_lists = [];
};
/**
 * @param {!Box2D.Dynamics.b2FixtureDef} def
 */
Box2D.Dynamics.b2Body.prototype.CreateFixture = function(def) {
;
	var fixture = new Box2D.Dynamics.b2Fixture(this, this.m_xf, def);
	if (this.m_active) {
		var broadPhase = this.m_world.m_contactManager.m_broadPhase;
		fixture.CreateProxy(broadPhase, this.m_xf);
	}
	this.fixtureList.AddFixture(fixture);
	fixture.m_body = this;
	if (fixture.m_density > 0.0) {
		this.ResetMassData();
	}
	this.m_world.m_newFixture = true;
	return fixture;
};
Box2D.Dynamics.b2Body.prototype.CreateFixture2 = function(shape, density) {
	if (density === undefined) density = 0.0;
	var def = new Box2D.Dynamics.b2FixtureDef();
	def.shape = shape;
	def.density = density;
	return this.CreateFixture(def);
};
Box2D.Dynamics.b2Body.prototype.Destroy = function() {
	Box2D.Common.Math.b2Vec2.Free(this.m_linearVelocity);
	Box2D.Common.Math.b2Vec2.Free(this.m_force);
};
Box2D.Dynamics.b2Body.prototype.DestroyFixture = function(fixture) {
;
	this.fixtureList.RemoveFixture(fixture);
	for (var contactNode = this.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
		if (fixture == contactNode.contact.m_fixtureA || fixture == contactNode.contact.m_fixtureB) {
			this.m_world.m_contactManager.Destroy(contactNode.contact);
		}
	}
	if (this.m_active) {
		var broadPhase = this.m_world.m_contactManager.m_broadPhase;
		fixture.DestroyProxy(broadPhase);
	}
	fixture.Destroy();
	fixture.m_body = null;
	this.ResetMassData();
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} position
 * @param {number} angle
 */
Box2D.Dynamics.b2Body.prototype.SetPositionAndAngle = function(position, angle) {
;
	this.m_xf.R.Set(angle);
	this.m_xf.position.SetV(position);
	var tMat = this.m_xf.R;
	var tVec = this.m_sweep.localCenter;
	this.m_sweep.c.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	this.m_sweep.c.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	this.m_sweep.c.x += this.m_xf.position.x;
	this.m_sweep.c.y += this.m_xf.position.y;
	this.m_sweep.c0.SetV(this.m_sweep.c);
	this.m_sweep.a0 = this.m_sweep.a = angle;
	var broadPhase = this.m_world.m_contactManager.m_broadPhase;
	for (var node = this.fixtureList.GetFirstNode(); node; node = node.GetNextNode()) {
		node.fixture.Synchronize(broadPhase, this.m_xf, this.m_xf);
	}
	this.m_world.m_contactManager.FindNewContacts();
};
/**
 * @param {!Box2D.Common.Math.b2Transform} xf
 */
Box2D.Dynamics.b2Body.prototype.SetTransform = function(xf) {
	this.SetPositionAndAngle(xf.position, xf.GetAngle());
};
/**
 * @return {!Box2D.Common.Math.b2Transform}
 */
Box2D.Dynamics.b2Body.prototype.GetTransform = function() {
	return this.m_xf;
};
/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Dynamics.b2Body.prototype.GetPosition = function() {
	return this.m_xf.position;
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} position
 */
Box2D.Dynamics.b2Body.prototype.SetPosition = function(position) {
	this.SetPositionAndAngle(position, this.GetAngle());
};
/**
 * @return {number}
 */
Box2D.Dynamics.b2Body.prototype.GetAngle = function() {
	return this.m_sweep.a;
};
/**
 * @param {number} angle
 */
Box2D.Dynamics.b2Body.prototype.SetAngle = function(angle) {
	this.SetPositionAndAngle(this.GetPosition(), angle);
};
Box2D.Dynamics.b2Body.prototype.GetWorldCenter = function() {
	return this.m_sweep.c;
};
Box2D.Dynamics.b2Body.prototype.GetLocalCenter = function() {
	return this.m_sweep.localCenter;
};
Box2D.Dynamics.b2Body.prototype.SetLinearVelocity = function(v) {
	if (this.m_type == Box2D.Dynamics.b2BodyDef.b2_staticBody) {
		return;
	}
	this.m_linearVelocity.SetV(v);
};
Box2D.Dynamics.b2Body.prototype.GetLinearVelocity = function() {
	return this.m_linearVelocity;
};
Box2D.Dynamics.b2Body.prototype.SetAngularVelocity = function(omega) {
	if (omega === undefined) omega = 0;
	if (this.m_type == Box2D.Dynamics.b2BodyDef.b2_staticBody) {
		return;
	}
	this.m_angularVelocity = omega;
};
Box2D.Dynamics.b2Body.prototype.GetAngularVelocity = function() {
	return this.m_angularVelocity;
};
Box2D.Dynamics.b2Body.prototype.GetDefinition = function() {
	var bd = new Box2D.Dynamics.b2BodyDef();
	bd.type = this.GetType();
	bd.allowSleep = this.m_allowSleep;
	bd.angle = this.GetAngle();
	bd.angularDamping = this.m_angularDamping;
	bd.angularVelocity = this.m_angularVelocity;
	bd.fixedRotation = this.m_fixedRotation;
	bd.bullet = this.m_bullet;
	bd.active = this.m_active;
	bd.awake = this.m_awake;
	bd.linearDamping = this.m_linearDamping;
	bd.linearVelocity.SetV(this.GetLinearVelocity());
	bd.position = this.GetPosition();
	return bd;
};
Box2D.Dynamics.b2Body.prototype.ApplyForce = function(force, point) {
	if (this.m_type != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
		return;
	}
	this.SetAwake(true);
	this.m_force.x += force.x;
	this.m_force.y += force.y;
	this.m_torque += ((point.x - this.m_sweep.c.x) * force.y - (point.y - this.m_sweep.c.y) * force.x);
};
Box2D.Dynamics.b2Body.prototype.ApplyTorque = function(torque) {
	if (torque === undefined) torque = 0;
	if (this.m_type != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
		return;
	}
	this.SetAwake(true);
	this.m_torque += torque;
};
Box2D.Dynamics.b2Body.prototype.ApplyImpulse = function(impulse, point) {
	if (this.m_type != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
		return;
	}
	this.SetAwake(true);
	this.m_linearVelocity.x += this.m_invMass * impulse.x;
	this.m_linearVelocity.y += this.m_invMass * impulse.y;
	this.m_angularVelocity += this.m_invI * ((point.x - this.m_sweep.c.x) * impulse.y - (point.y - this.m_sweep.c.y) * impulse.x);
};
Box2D.Dynamics.b2Body.prototype.Split = function(callback) {
	var linearVelocity = this.GetLinearVelocity().Copy();
	var angularVelocity = this.GetAngularVelocity();
	var center = this.GetWorldCenter();
	var body1 = this;
	var body2 = this.m_world.CreateBody(this.GetDefinition());
	var prev;
	for (var node = body1.fixtureList.GetFirstNode(); node; node = node.GetNextNode()) {
		var f = node.fixture;
		if (callback(f)) {
			body1.fixtureList.RemoveFixture(f);
			body2.fixtureList.AddFixture(f);
		}
	}
	body1.ResetMassData();
	body2.ResetMassData();
	var center1 = body1.GetWorldCenter();
	var center2 = body2.GetWorldCenter();
	var velocity1 = Box2D.Common.Math.b2Math.AddVV(linearVelocity, Box2D.Common.Math.b2Math.CrossFV(angularVelocity, Box2D.Common.Math.b2Math.SubtractVV(center1, center)));
	var velocity2 = Box2D.Common.Math.b2Math.AddVV(linearVelocity, Box2D.Common.Math.b2Math.CrossFV(angularVelocity, Box2D.Common.Math.b2Math.SubtractVV(center2, center)));
	body1.SetLinearVelocity(velocity1);
	body2.SetLinearVelocity(velocity2);
	body1.SetAngularVelocity(angularVelocity);
	body2.SetAngularVelocity(angularVelocity);
	body1.SynchronizeFixtures();
	body2.SynchronizeFixtures();
	return body2;
};
Box2D.Dynamics.b2Body.prototype.Merge = function(other) {
	for (var node = other.fixtureList.GetFirstNode(); node; node = node.GetNextNode()) {
		this.fixtureList.AddFixture(node.fixture);
		other.fixtureList.RemoveFixture(node.fixture);
	}
	other.ResetMassData();
	this.ResetMassData();
	this.SynchronizeFixtures();
};
Box2D.Dynamics.b2Body.prototype.GetMass = function() {
	return this.m_mass;
};
Box2D.Dynamics.b2Body.prototype.GetInertia = function() {
	return this.m_I;
};
/**
 * @param {Box2D.Collision.Shapes.b2MassData=} massData
 * @return {!Box2D.Collision.Shapes.b2MassData}
 */
Box2D.Dynamics.b2Body.prototype.GetMassData = function(massData) {
	if (!massData) {
		massData = new Box2D.Collision.Shapes.b2MassData();
	}
	massData.mass = this.m_mass;
	massData.I = this.m_I;
	massData.center.SetV(this.m_sweep.localCenter);
	return massData;
};
/**
 * @param {!Box2D.Collision.Shapes.b2MassData} massData
 */
Box2D.Dynamics.b2Body.prototype.SetMassData = function(massData) {
;
	if (this.m_type != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
		return;
	}
	this.m_invMass = 0.0;
	this.m_I = 0.0;
	this.m_invI = 0.0;
	this.m_mass = massData.mass;
	if (this.m_mass <= 0.0) {
		this.m_mass = 1.0;
	}
	this.m_invMass = 1.0 / this.m_mass;
	if (massData.I > 0.0 && !this.m_fixedRotation) {
		this.m_I = massData.I - this.m_mass * (massData.center.x * massData.center.x + massData.center.y * massData.center.y);
		this.m_invI = 1.0 / this.m_I;
	}
	var oldCenter = this.m_sweep.c.Copy();
	this.m_sweep.localCenter.SetV(massData.center);
	this.m_sweep.c0.SetV(Box2D.Common.Math.b2Math.MulX(this.m_xf, this.m_sweep.localCenter));
	this.m_sweep.c.SetV(this.m_sweep.c0);
	this.m_linearVelocity.x += this.m_angularVelocity * (-(this.m_sweep.c.y - oldCenter.y));
	this.m_linearVelocity.y += this.m_angularVelocity * (+(this.m_sweep.c.x - oldCenter.x));
};
Box2D.Dynamics.b2Body.prototype.ResetMassData = function() {
	this.m_mass = 0.0;
	this.m_invMass = 0.0;
	this.m_I = 0.0;
	this.m_invI = 0.0;
	this.m_sweep.localCenter.SetZero();
	if (this.m_type == Box2D.Dynamics.b2BodyDef.b2_staticBody || this.m_type == Box2D.Dynamics.b2BodyDef.b2_kinematicBody) {
		return;
	}
	var center = Box2D.Common.Math.b2Vec2.Get(0, 0);
	for (var node = this.fixtureList.GetFirstNode(); node; node = node.GetNextNode()) {
		var f = node.fixture;
		if (f.m_density == 0.0) {
			continue;
		}
		var massData = f.GetMassData();
		this.m_mass += massData.mass;
		center.x += massData.center.x * massData.mass;
		center.y += massData.center.y * massData.mass;
		this.m_I += massData.I;
	}
	if (this.m_mass > 0.0) {
		this.m_invMass = 1.0 / this.m_mass;
		center.x *= this.m_invMass;
		center.y *= this.m_invMass;
	} else {
		this.m_mass = 1.0;
		this.m_invMass = 1.0;
	}
	if (this.m_I > 0.0 && !this.m_fixedRotation) {
		this.m_I -= this.m_mass * (center.x * center.x + center.y * center.y);
		this.m_I *= this.m_inertiaScale;
;
		this.m_invI = 1.0 / this.m_I;
	} else {
		this.m_I = 0.0;
		this.m_invI = 0.0;
	}
	var oldCenter = this.m_sweep.c.Copy();
	this.m_sweep.localCenter.SetV(center);
	this.m_sweep.c0.SetV(Box2D.Common.Math.b2Math.MulX(this.m_xf, this.m_sweep.localCenter));
	this.m_sweep.c.SetV(this.m_sweep.c0);
	this.m_linearVelocity.x += this.m_angularVelocity * (-(this.m_sweep.c.y - oldCenter.y));
	this.m_linearVelocity.y += this.m_angularVelocity * (+(this.m_sweep.c.x - oldCenter.x));
	Box2D.Common.Math.b2Vec2.Free(center);
	Box2D.Common.Math.b2Vec2.Free(oldCenter);
};
Box2D.Dynamics.b2Body.prototype.GetWorldPoint = function(localPoint) {
	var A = this.m_xf.R;
	var u = Box2D.Common.Math.b2Vec2.Get(A.col1.x * localPoint.x + A.col2.x * localPoint.y, A.col1.y * localPoint.x + A.col2.y * localPoint.y);
	u.x += this.m_xf.position.x;
	u.y += this.m_xf.position.y;
	return u;
};
Box2D.Dynamics.b2Body.prototype.GetWorldVector = function(localVector) {
	return Box2D.Common.Math.b2Math.MulMV(this.m_xf.R, localVector);
};
Box2D.Dynamics.b2Body.prototype.GetLocalPoint = function(worldPoint) {
	return Box2D.Common.Math.b2Math.MulXT(this.m_xf, worldPoint);
};
Box2D.Dynamics.b2Body.prototype.GetLocalVector = function(worldVector) {
	return Box2D.Common.Math.b2Math.MulTMV(this.m_xf.R, worldVector);
};
Box2D.Dynamics.b2Body.prototype.GetLinearVelocityFromWorldPoint = function(worldPoint) {
	return Box2D.Common.Math.b2Vec2.Get(this.m_linearVelocity.x - this.m_angularVelocity * (worldPoint.y - this.m_sweep.c.y), this.m_linearVelocity.y + this.m_angularVelocity * (worldPoint.x - this.m_sweep.c.x));
};
Box2D.Dynamics.b2Body.prototype.GetLinearVelocityFromLocalPoint = function(localPoint) {
	var A = this.m_xf.R;
	var worldPoint = Box2D.Common.Math.b2Vec2.Get(A.col1.x * localPoint.x + A.col2.x * localPoint.y, A.col1.y * localPoint.x + A.col2.y * localPoint.y);
	worldPoint.x += this.m_xf.position.x;
	worldPoint.y += this.m_xf.position.y;
	var velocity = Box2D.Common.Math.b2Vec2.Get(this.m_linearVelocity.x - this.m_angularVelocity * (worldPoint.y - this.m_sweep.c.y), this.m_linearVelocity.y + this.m_angularVelocity * (worldPoint.x - this.m_sweep.c.x));
	Box2D.Common.Math.b2Vec2.Free(worldPoint);
	return velocity;
};
/**
 * @return {number}
 */
Box2D.Dynamics.b2Body.prototype.GetLinearDamping = function() {
	return this.m_linearDamping;
};
/**
 * @param {number} linearDamping
 */
Box2D.Dynamics.b2Body.prototype.SetLinearDamping = function(linearDamping) {
	this.m_linearDamping = linearDamping;
};
/**
 * @return {number}
 */
Box2D.Dynamics.b2Body.prototype.GetAngularDamping = function() {
	return this.m_angularDamping;
};
/**
 * @param {number} angularDamping
 */
Box2D.Dynamics.b2Body.prototype.SetAngularDamping = function(angularDamping) {
	this.m_angularDamping = angularDamping;
};
/**
 * @param {number} type
 */
Box2D.Dynamics.b2Body.prototype.SetType = function(type) {
	if (this.m_type == type) {
		return;
	}
	this.m_type = type;
	this.ResetMassData();
	if (this.m_type == Box2D.Dynamics.b2BodyDef.b2_staticBody) {
		this.m_linearVelocity.SetZero();
		this.m_angularVelocity = 0.0;
	}
	this.SetAwake(true);
	this.m_force.SetZero();
	this.m_torque = 0.0;
	for (var contactNode = this.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
		contactNode.contact.FlagForFiltering();
	}
	for (var i = 0; i < this.m_lists.length; i++) {
		this.m_lists[i].UpdateBody(this);
	}
};
/**
 * @return {number}
 */
Box2D.Dynamics.b2Body.prototype.GetType = function() {
	return this.m_type;
};
/**
 * @param {boolean} flag
 */
Box2D.Dynamics.b2Body.prototype.SetBullet = function(flag) {
	this.m_bullet = flag;
};
/**
 * @return {boolean}
 */
Box2D.Dynamics.b2Body.prototype.IsBullet = function() {
	return this.m_bullet;
};
/**
 * @param {boolean} flag
 */
Box2D.Dynamics.b2Body.prototype.SetSleepingAllowed = function(flag) {
	this.m_allowSleep = flag;
	if (!flag) {
		this.SetAwake(true);
	}
};
/**
 * @param {boolean} flag
 */
Box2D.Dynamics.b2Body.prototype.SetAwake = function(flag) {
	if (this.m_awake != flag) {
		this.m_awake = flag;
		this.m_sleepTime = 0;
		if (!flag) {
			this.m_linearVelocity.SetZero();
			this.m_angularVelocity = 0.0;
			this.m_force.SetZero();
			this.m_torque = 0.0;
		}
		for (var i = 0; i < this.m_lists.length; i++) {
			this.m_lists[i].UpdateBody(this);
		}
	}
};
/**
 * @return {boolean}
 */
Box2D.Dynamics.b2Body.prototype.IsAwake = function() {
	return this.m_awake;
};
/**
 * @param {boolean} fixed
 */
Box2D.Dynamics.b2Body.prototype.SetFixedRotation = function(fixed) {
	this.m_fixedRotation = fixed;
	this.ResetMassData();
};
/**
 * @return {boolean}
 */
Box2D.Dynamics.b2Body.prototype.IsFixedRotation = function() {
	return this.m_fixedRotation;
};
/**
 * @param {boolean} flag
 */
Box2D.Dynamics.b2Body.prototype.SetActive = function(flag) {
	if (flag == this.m_active) {
		return;
	}
	if (flag) {
		this.m_active = true;
		var broadPhase = this.m_world.m_contactManager.m_broadPhase;
		for (var node = this.fixtureList.GetFirstNode(); node; node = node.GetNextNode()) {
			node.fixture.CreateProxy(broadPhase, this.m_xf);
		}
	} else {
		this.m_active = false;
		var broadPhase = this.m_world.m_contactManager.m_broadPhase;
		for (var node = this.fixtureList.GetFirstNode(); node; node = node.GetNextNode()) {
			node.fixture.DestroyProxy(broadPhase);
		}
		for (var contactNode = this.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
			this.m_world.m_contactManager.Destroy(contactNode.contact);
		}
	}
	for (var i = 0; i < this.m_lists.length; i++) {
		this.m_lists[i].UpdateBody(this);
	}
};
/**
 * @return {boolean}
 */
Box2D.Dynamics.b2Body.prototype.IsActive = function() {
	return this.m_active;
};
/**
 * @return {boolean}
 */
Box2D.Dynamics.b2Body.prototype.IsSleepingAllowed = function() {
	return this.m_allowSleep;
};
Box2D.Dynamics.b2Body.prototype.GetFixtureList = function() {
	return this.fixtureList;
};
Box2D.Dynamics.b2Body.prototype.GetJointList = function() {
	return this.m_jointList;
};
Box2D.Dynamics.b2Body.prototype.GetControllerList = function() {
	return this.controllerList;
};
/**
 * @param {!Box2D.Dynamics.Controllers.b2Controller} controller
 */
Box2D.Dynamics.b2Body.prototype.AddController = function(controller) {
	this.controllerList.AddController(controller);
};
/**
 * @param {!Box2D.Dynamics.Controllers.b2Controller} controller
 */
Box2D.Dynamics.b2Body.prototype.RemoveController = function(controller) {
	this.controllerList.RemoveController(controller);
};
Box2D.Dynamics.b2Body.prototype.GetContactList = function() {
	return this.contactList;
};
Box2D.Dynamics.b2Body.prototype.GetWorld = function() {
	return this.m_world;
};
Box2D.Dynamics.b2Body.prototype.SynchronizeFixtures = function() {
	var xf1 = Box2D.Dynamics.b2Body.s_xf1;
	xf1.R.Set(this.m_sweep.a0);
	var tMat = xf1.R;
	var tVec = this.m_sweep.localCenter;
	xf1.position.x = this.m_sweep.c0.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	xf1.position.y = this.m_sweep.c0.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	var f;
	var broadPhase = this.m_world.m_contactManager.m_broadPhase;
	for (var node = this.fixtureList.GetFirstNode(); node; node = node.GetNextNode()) {
		node.fixture.Synchronize(broadPhase, xf1, this.m_xf);
	}
};
Box2D.Dynamics.b2Body.prototype.SynchronizeTransform = function() {
	this.m_xf.R.Set(this.m_sweep.a);
	var tMat = this.m_xf.R;
	var tVec = this.m_sweep.localCenter;
	this.m_xf.position.x = this.m_sweep.c.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	this.m_xf.position.y = this.m_sweep.c.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
};
Box2D.Dynamics.b2Body.prototype.ShouldCollide = function(other) {
	if (this.m_type != Box2D.Dynamics.b2BodyDef.b2_dynamicBody && other.m_type != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
		return false;
	}
	for (var jn = this.m_jointList; jn; jn = jn.next) {
		if (jn.other == other) if (jn.joint.m_collideConnected == false) {
			return false;
		}
	}
	return true;
};
/**
 * @param {number} t
 */
Box2D.Dynamics.b2Body.prototype.Advance = function(t) {
	this.m_sweep.Advance(t);
	this.m_sweep.c.SetV(this.m_sweep.c0);
	this.m_sweep.a = this.m_sweep.a0;
	this.SynchronizeTransform();
};
/**
 * @type {number}
 * @private
 */
Box2D.Dynamics.b2Body.NEXT_ID = 0;
/**
 * @constructor
 */
Box2D.Dynamics.b2BodyDef = function() {
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.position = Box2D.Common.Math.b2Vec2.Get(0, 0);
	/** @type {!Box2D.Common.Math.b2Vec2} */
	this.linearVelocity = Box2D.Common.Math.b2Vec2.Get(0, 0);
	/** @type {number} */
	this.angle = 0.0;
	/** @type {number} */
	this.angularVelocity = 0.0;
	/** @type {number} */
	this.linearDamping = 0.0;
	/** @type {number} */
	this.angularDamping = 0.0;
	/** @type {boolean} */
	this.allowSleep = true;
	/** @type {boolean} */
	this.awake = true;
	/** @type {boolean} */
	this.fixedRotation = false;
	/** @type {boolean} */
	this.bullet = false;
	/** @type {number} */
	this.type = Box2D.Dynamics.b2BodyDef.b2_staticBody;
	/** @type {boolean} */
	this.active = true;
	/** @type {number} */
	this.inertiaScale = 1.0;
};
/**
 * @const
 * @type {number}
 */
Box2D.Dynamics.b2BodyDef.b2_staticBody = 0;
/**
 * @const
 * @type {number}
 */
Box2D.Dynamics.b2BodyDef.b2_kinematicBody = 1;
/**
 * @const
 * @type {number}
 */
Box2D.Dynamics.b2BodyDef.b2_dynamicBody = 2;
/**
 * @constructor
 */
Box2D.Dynamics.b2BodyList = function() {
	/**
	 * @private
	 * @type {Array.<Box2D.Dynamics.b2BodyListNode>}
	 */
	this.bodyFirstNodes = [];
	for(var i = 0; i <= Box2D.Dynamics.b2BodyList.TYPES.allBodies; i++) {
		this.bodyFirstNodes[i] = null;
	}
	/**
	 * @private
	 * @type {Array.<Box2D.Dynamics.b2BodyListNode>}
	 */
	this.bodyLastNodes = [];
	for(var i = 0; i <= Box2D.Dynamics.b2BodyList.TYPES.allBodies; i++) {
		this.bodyLastNodes[i] = null;
	}
	/**
	 * @private
	 * @type {Object.<Array.<Box2D.Dynamics.b2BodyListNode>>}
	 */
	this.bodyNodeLookup = {};
	/**
	 * @private
	 * @type {number}
	 */
	this.bodyCount = 0;
};
/**
 * @param {number} type
 * @return {Box2D.Dynamics.b2BodyListNode}
 */
Box2D.Dynamics.b2BodyList.prototype.GetFirstNode = function(type) {
	return this.bodyFirstNodes[type];
};
/**
 * @param {!Box2D.Dynamics.b2Body} body
 */
Box2D.Dynamics.b2BodyList.prototype.AddBody = function(body) {
	var bodyID = body.ID;
	if (this.bodyNodeLookup[bodyID] == null) {
		this.CreateNode(body, bodyID, Box2D.Dynamics.b2BodyList.TYPES.allBodies);
		this.UpdateBody(body);
		body.m_lists.push(this);
		this.bodyCount++;
	}
};
/**
 * @param {!Box2D.Dynamics.b2Body} body
 */
Box2D.Dynamics.b2BodyList.prototype.UpdateBody = function(body) {
	var type = body.GetType();
	var bodyID = body.ID;
	var awake = body.IsAwake();
	var active = body.IsActive();
	if (type == Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
		this.CreateNode(body, bodyID, Box2D.Dynamics.b2BodyList.TYPES.dynamicBodies);
	} else {
		this.RemoveNode(bodyID, Box2D.Dynamics.b2BodyList.TYPES.dynamicBodies);
	}
	if (type != Box2D.Dynamics.b2BodyDef.b2_staticBody) {
		this.CreateNode(body, bodyID, Box2D.Dynamics.b2BodyList.TYPES.nonStaticBodies);
	} else {
		this.RemoveNode(bodyID, Box2D.Dynamics.b2BodyList.TYPES.nonStaticBodies);
	}
	if (type != Box2D.Dynamics.b2BodyDef.b2_staticBody && active && awake) {
		this.CreateNode(body, bodyID, Box2D.Dynamics.b2BodyList.TYPES.nonStaticActiveAwakeBodies);
	} else {
		this.RemoveNode(bodyID, Box2D.Dynamics.b2BodyList.TYPES.nonStaticActiveAwakeBodies);
	}
	if (awake) {
		this.CreateNode(body, bodyID, Box2D.Dynamics.b2BodyList.TYPES.awakeBodies);
	} else {
		this.RemoveNode(bodyID, Box2D.Dynamics.b2BodyList.TYPES.awakeBodies);
	}
	if (active) {
		this.CreateNode(body, bodyID, Box2D.Dynamics.b2BodyList.TYPES.activeBodies);
	} else {
		this.RemoveNode(bodyID, Box2D.Dynamics.b2BodyList.TYPES.activeBodies);
	}
};
/**
 * @param {!Box2D.Dynamics.b2Body} body
 */
Box2D.Dynamics.b2BodyList.prototype.RemoveBody = function(body) {
	var bodyID = body.ID;
	if (this.bodyNodeLookup[bodyID] != null) {
		cr.arrayFindRemove(body.m_lists, this);
		for(var i = 0; i <= Box2D.Dynamics.b2BodyList.TYPES.allBodies; i++) {
			this.RemoveNode(bodyID, i);
		}
		delete this.bodyNodeLookup[bodyID];
		this.bodyCount--;
	}
};
/**
 * @param {string} bodyID
 * @param {number} type
 */
Box2D.Dynamics.b2BodyList.prototype.RemoveNode = function(bodyID, type) {
	var nodeList = this.bodyNodeLookup[bodyID];
	if (nodeList == null) {
		return;
	}
	var node = nodeList[type];
	if (node == null) {
		return;
	}
	nodeList[type] = null;
	var prevNode = node.GetPreviousNode();
	var nextNode = node.GetNextNode();
	if (prevNode == null) {
		this.bodyFirstNodes[type] = nextNode;
	} else {
		prevNode.SetNextNode(nextNode);
	}
	if (nextNode == null) {
		this.bodyLastNodes[type] = prevNode;
	} else {
		nextNode.SetPreviousNode(prevNode);
	}
};
/**
 * @param {!Box2D.Dynamics.b2Body} body
 * @param {string} bodyID
 * @param {number} type
 */
Box2D.Dynamics.b2BodyList.prototype.CreateNode = function(body, bodyID, type) {
	var nodeList = this.bodyNodeLookup[bodyID];
	if (nodeList == null) {
		nodeList = [];
		for(var i = 0; i <= Box2D.Dynamics.b2BodyList.TYPES.allBodies; i++) {
			nodeList[i] = null;
		}
		this.bodyNodeLookup[bodyID] = nodeList;
	}
	if (nodeList[type] == null) {
		nodeList[type] = new Box2D.Dynamics.b2BodyListNode(body);
		var prevNode = this.bodyLastNodes[type];
		if (prevNode != null) {
			prevNode.SetNextNode(nodeList[type]);
		} else {
			this.bodyFirstNodes[type] = nodeList[type];
		}
		nodeList[type].SetPreviousNode(prevNode);
		this.bodyLastNodes[type] = nodeList[type];
	}
};
/**
 * @return {number}
 */
Box2D.Dynamics.b2BodyList.prototype.GetBodyCount = function() {
	return this.bodyCount;
};
/**
 * @enum {number}
 */
Box2D.Dynamics.b2BodyList.TYPES = {
	dynamicBodies: 0,
	nonStaticBodies: 1,
	activeBodies: 2,
	nonStaticActiveAwakeBodies: 3,
	awakeBodies: 4,
	allBodies: 5 // Assumed to be last by above code
};
/**
 * @param {!Box2D.Dynamics.b2Body} body
 * @constructor
 */
Box2D.Dynamics.b2BodyListNode = function(body) {
	/**
	 * @const
	 * @type {!Box2D.Dynamics.b2Body}
	 */
	this.body = body;
	/**
	 * @private
	 * @type {Box2D.Dynamics.b2BodyListNode}
	 */
	this.next = null;
	/**
	 * @private
	 * @type {Box2D.Dynamics.b2BodyListNode}
	 */
	this.previous = null;
};
/**
 * @param {Box2D.Dynamics.b2BodyListNode} node
 */
Box2D.Dynamics.b2BodyListNode.prototype.SetNextNode = function(node) {
	this.next = node;
};
/**
 * @param {Box2D.Dynamics.b2BodyListNode} node
 */
Box2D.Dynamics.b2BodyListNode.prototype.SetPreviousNode = function(node) {
	this.previous = node;
};
/**
 * @return {Box2D.Dynamics.b2Body}
 */
Box2D.Dynamics.b2BodyListNode.prototype.GetBody = function() {
	return this.body;
};
/**
 * @return {Box2D.Dynamics.b2BodyListNode}
 */
Box2D.Dynamics.b2BodyListNode.prototype.GetNextNode = function() {
	return this.next;
};
/**
 * @return {Box2D.Dynamics.b2BodyListNode}
 */
Box2D.Dynamics.b2BodyListNode.prototype.GetPreviousNode = function() {
	return this.previous;
};
/**
 * @constructor
 */
Box2D.Dynamics.b2ContactFilter = function() {};
/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 * @return {boolean}
 */
Box2D.Dynamics.b2ContactFilter.prototype.ShouldCollide = function(fixtureA, fixtureB) {
	var filter1 = fixtureA.GetFilterData();
	var filter2 = fixtureB.GetFilterData();
	if (filter1.groupIndex == filter2.groupIndex && filter1.groupIndex != 0) {
		return filter1.groupIndex > 0;
	}
	return (filter1.maskBits & filter2.categoryBits) != 0 && (filter1.categoryBits & filter2.maskBits) != 0;
};
/** @type {!Box2D.Dynamics.b2ContactFilter} */
Box2D.Dynamics.b2ContactFilter.b2_defaultFilter = new Box2D.Dynamics.b2ContactFilter();
/**
 * @constructor
 */
Box2D.Dynamics.b2ContactImpulse = function () {
	this.normalImpulses = [];
	this.tangentImpulses = [];
};
/**
 * @constructor
 */
Box2D.Dynamics.b2ContactListener = function () {};
Box2D.Dynamics.b2ContactListener.prototype.BeginContact = function (contact) {};
Box2D.Dynamics.b2ContactListener.prototype.EndContact = function (contact) {};
Box2D.Dynamics.b2ContactListener.prototype.PreSolve = function (contact, oldManifold) {};
Box2D.Dynamics.b2ContactListener.prototype.PostSolve = function (contact, impulse) {};
/**
 * @param {!Box2D.Dynamics.b2World} world
 * @constructor
 */
Box2D.Dynamics.b2ContactManager = function(world) {
	/**
	 * @private
	 * @const
	 * @type {!Box2D.Dynamics.b2World}
	 */
	this.m_world = world;
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2ContactFilter}
	 */
	this.m_contactFilter = Box2D.Dynamics.b2ContactFilter.b2_defaultFilter;
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2ContactListener}
	 */
	this.m_contactListener = Box2D.Dynamics.b2ContactListener.b2_defaultListener;
	/**
	 * @private
	 * @const
	 * @type {!Box2D.Dynamics.Contacts.b2ContactFactory}
	 */
	this.m_contactFactory = new Box2D.Dynamics.Contacts.b2ContactFactory();
	/**
	 * @private
	 * @type {!Box2D.Collision.b2DynamicTreeBroadPhase}
	 */
	this.m_broadPhase = new Box2D.Collision.b2DynamicTreeBroadPhase();
};
/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 */
Box2D.Dynamics.b2ContactManager.prototype.AddPair = function (fixtureA, fixtureB) {
  var bodyA = fixtureA.GetBody();
  var bodyB = fixtureB.GetBody();
  if (bodyA == bodyB) {
	  return;
  }
  if (!bodyB.ShouldCollide(bodyA)) {
	 return;
  }
  if (!this.m_contactFilter.ShouldCollide(fixtureA, fixtureB)) {
	 return;
  }
  for (var contactNode = bodyB.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
	var fA = contactNode.contact.m_fixtureA;
	if (fA == fixtureA) {
		var fB = contactNode.contact.m_fixtureB;
		if (fB == fixtureB) {
			return;
		}
	} else if (fA == fixtureB) {
		var fB = contactNode.contact.m_fixtureB;
		if (fB == fixtureA) {
			return;
		}
	}
  }
  var c = this.m_contactFactory.Create(fixtureA, fixtureB);
};
Box2D.Dynamics.b2ContactManager.prototype.FindNewContacts = function () {
	var self = this;
	/** @type {function(!Box2D.Dynamics.b2Fixture, !Box2D.Dynamics.b2Fixture)} */
	var addPairCallback = function(fixtureA, fixtureB) {
		self.AddPair(fixtureA, fixtureB)
	};
	this.m_broadPhase.UpdatePairs(addPairCallback);
};
Box2D.Dynamics.b2ContactManager.prototype.Destroy = function (c) {
	var fixtureA = c.m_fixtureA;
	var fixtureB = c.m_fixtureB;
	var bodyA = fixtureA.GetBody();
	var bodyB = fixtureB.GetBody();
	if (c.touching) {
		this.m_contactListener.EndContact(c);
	}
	if (c.m_manifold.m_pointCount > 0) {
		c.m_fixtureA.GetBody().SetAwake(true);
		c.m_fixtureB.GetBody().SetAwake(true);
	}
	c.RemoveFromLists();
	this.m_contactFactory.Destroy(c);
};
Box2D.Dynamics.b2ContactManager.prototype.Collide = function() {
	for (var contactNode = this.m_world.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
		var c = contactNode.contact;
		var fixtureA = c.m_fixtureA;
		var fixtureB = c.m_fixtureB;
		var bodyA = fixtureA.GetBody();
		var bodyB = fixtureB.GetBody();
		if (bodyA.IsAwake() == false && bodyB.IsAwake() == false) {
			continue;
		}
		if (c.IsFiltering()) {
			if (bodyB.ShouldCollide(bodyA) == false) {
				this.Destroy(c);
				continue;
			}
			if (this.m_contactFilter.ShouldCollide(fixtureA, fixtureB) == false) {
				this.Destroy(c);
				continue;
			}
			c.ClearFiltering();
		}
		var proxyA = fixtureA.m_proxy;
		var proxyB = fixtureB.m_proxy;
		var overlap = this.m_broadPhase.TestOverlap(proxyA, proxyB);
		if (overlap == false) {
			this.Destroy(c);
			continue;
		}
		c.Update(this.m_contactListener);
	}
};
/**
 * @constructor
 */
Box2D.Dynamics.b2DestructionListener = function () {};
Box2D.Dynamics.b2DestructionListener.prototype.SayGoodbyeJoint = function (joint) {};
Box2D.Dynamics.b2DestructionListener.prototype.SayGoodbyeFixture = function (fixture) {};
/**
 * @constructor
 */
Box2D.Dynamics.b2FilterData = function () {
  this.categoryBits = 0x0001;
  this.maskBits = 0xFFFF;
  this.groupIndex = 0;
};
/**
 * @return {!Box2D.Dynamics.b2FilterData}
 */
Box2D.Dynamics.b2FilterData.prototype.Copy = function () {
  var copy = new Box2D.Dynamics.b2FilterData();
  copy.categoryBits = this.categoryBits;
  copy.maskBits = this.maskBits;
  copy.groupIndex = this.groupIndex;
  return copy;
};
/**
 * @param {!Box2D.Dynamics.b2Body} body
 * @param {!Box2D.Common.Math.b2Transform} xf
 * @param {!Box2D.Dynamics.b2FixtureDef} def
 * @constructor
 */
Box2D.Dynamics.b2Fixture = function(body, xf, def) {
	/**
	 * @const
	 * @private
	 * @type {string}
	 */
	this.ID = "Fixture" + Box2D.Dynamics.b2Fixture.NEXT_ID++;
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2FilterData}
	 */
	this.m_filter = def.filter.Copy();
	/**
	 * @private
	 * @type {!Box2D.Collision.b2AABB}
	 */
	this.m_aabb = Box2D.Collision.b2AABB.Get();
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2Body}
	 */
	this.m_body = body;
	/**
	 * @private
	 * @type {!Box2D.Collision.Shapes.b2Shape}
	 */
	this.m_shape = def.shape.Copy();
	/**
	 * @private
	 * @type {number}
	 */
	this.m_density = def.density;
	/**
	 * @private
	 * @type {number}
	 */
	this.m_friction = def.friction;
	/**
	 * @private
	 * @type {number}
	 */
	this.m_restitution = def.restitution;
	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_isSensor = def.isSensor;
};
/**
 * @return {!Box2D.Collision.Shapes.b2Shape}
 */
Box2D.Dynamics.b2Fixture.prototype.GetShape = function() {
	return this.m_shape;
};
/**
 * @param {boolean} sensor
 */
Box2D.Dynamics.b2Fixture.prototype.SetSensor = function(sensor) {
	if (this.m_isSensor == sensor) {
		return;
	}
	this.m_isSensor = sensor;
	if (this.m_body == null) {
		return;
	}
	for (var contactNode = this.m_body.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
		var fixtureA = contactNode.contact.m_fixtureA;
		var fixtureB = contactNode.contact.m_fixtureB;
		if (fixtureA == this || fixtureB == this) {
			contactNode.contact.SetSensor(fixtureA.sensor || fixtureB.sensor);
		}
	}
};
/**
 * @return {boolean}
 */
Box2D.Dynamics.b2Fixture.prototype.IsSensor = function() {
	return this.m_isSensor;
};
/**
 * @param {!Box2D.Dynamics.b2FilterData} filter
 */
Box2D.Dynamics.b2Fixture.prototype.SetFilterData = function(filter) {
	this.m_filter = filter.Copy();
	if (this.m_body == null) {
		return;
	}
	for (var contactNode = this.m_body.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
		if (contactNode.contact.m_fixtureA == this || contactNode.contact.m_fixtureB == this) {
			contactNode.contact.FlagForFiltering();
		}
	}
};
/**
 * @return {!Box2D.Dynamics.b2FilterData}
 */
Box2D.Dynamics.b2Fixture.prototype.GetFilterData = function() {
	return this.m_filter.Copy();
};
/**
 * @return {Box2D.Dynamics.b2Body}
 */
Box2D.Dynamics.b2Fixture.prototype.GetBody = function() {
	return this.m_body;
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} p
 * @return {boolean}
 */
Box2D.Dynamics.b2Fixture.prototype.TestPoint = function(p) {
	return this.m_shape.TestPoint(this.m_body.GetTransform(), p);
};
/**
 * @param {!Box2D.Collision.b2RayCastOutput} output
 * @param {!Box2D.Collision.b2RayCastInput} input
 * @return {boolean}
 */
Box2D.Dynamics.b2Fixture.prototype.RayCast = function(output, input) {
	return this.m_shape.RayCast(output, input, this.m_body.GetTransform());
};
/**
 * @param {Box2D.Collision.Shapes.b2MassData=} massData
 * @return {!Box2D.Collision.Shapes.b2MassData}
 */
Box2D.Dynamics.b2Fixture.prototype.GetMassData = function(massData) {
	if (!massData) {
		massData = new Box2D.Collision.Shapes.b2MassData();
	}
	this.m_shape.ComputeMass(massData, this.m_density);
	return massData;
};
/**
 * @param {number} density
 */
Box2D.Dynamics.b2Fixture.prototype.SetDensity = function(density) {
	this.m_density = density;
};
/**
 * @return {number}
 */
Box2D.Dynamics.b2Fixture.prototype.GetDensity = function() {
	return this.m_density;
};
/**
 * @return {number}
 */
Box2D.Dynamics.b2Fixture.prototype.GetFriction = function() {
	return this.m_friction;
};
/**
 * @param {number} friction
 */
Box2D.Dynamics.b2Fixture.prototype.SetFriction = function(friction) {
	this.m_friction = friction;
};
/**
 * @return {number}
 */
Box2D.Dynamics.b2Fixture.prototype.GetRestitution = function() {
	return this.m_restitution;
};
/**
 * @param {number} restitution
 */
Box2D.Dynamics.b2Fixture.prototype.SetRestitution = function(restitution) {
	this.m_restitution = restitution;
};
/**
 * @return {!Box2D.Collision.b2AABB}
 */
Box2D.Dynamics.b2Fixture.prototype.GetAABB = function() {
	return this.m_aabb;
};
Box2D.Dynamics.b2Fixture.prototype.Destroy = function() {
	Box2D.Collision.b2AABB.Free(this.m_aabb);
};
/**
 * @param {!Box2D.Collision.b2DynamicTreeBroadPhase} broadPhase
 * @param {!Box2D.Common.Math.b2Transform} xf
 */
Box2D.Dynamics.b2Fixture.prototype.CreateProxy = function(broadPhase, xf) {
	this.m_shape.ComputeAABB(this.m_aabb, xf);
	this.m_proxy = broadPhase.CreateProxy(this.m_aabb, this);
};
/**
 * @param {!Box2D.Collision.b2DynamicTreeBroadPhase} broadPhase
 */
Box2D.Dynamics.b2Fixture.prototype.DestroyProxy = function(broadPhase) {
	if (this.m_proxy == null) {
		return;
	}
	broadPhase.DestroyProxy(this.m_proxy);
	this.m_proxy = null;
};
/**
 * @param {!Box2D.Collision.b2DynamicTreeBroadPhase} broadPhase
 * @param {!Box2D.Common.Math.b2Transform} transform1
 * @param {!Box2D.Common.Math.b2Transform} transform2
 */
Box2D.Dynamics.b2Fixture.prototype.Synchronize = function(broadPhase, transform1, transform2) {
	if (!this.m_proxy) return;
	var aabb1 = Box2D.Collision.b2AABB.Get();
	var aabb2 = Box2D.Collision.b2AABB.Get();
	this.m_shape.ComputeAABB(aabb1, transform1);
	this.m_shape.ComputeAABB(aabb2, transform2);
	this.m_aabb.Combine(aabb1, aabb2);
	Box2D.Collision.b2AABB.Free(aabb1);
	Box2D.Collision.b2AABB.Free(aabb2);
	var displacement = Box2D.Common.Math.b2Math.SubtractVV(transform2.position, transform1.position);
	broadPhase.MoveProxy(this.m_proxy, this.m_aabb, displacement);
	Box2D.Common.Math.b2Vec2.Free(displacement);
};
/**
 * @type {number}
 * @private
 */
Box2D.Dynamics.b2Fixture.NEXT_ID = 0;
/**
 * @constructor
 */
Box2D.Dynamics.b2FixtureDef = function () {
	/**
	 * @type {!Box2D.Dynamics.b2FilterData}
	 */
	this.filter = new Box2D.Dynamics.b2FilterData();
	this.filter.categoryBits = 0x0001;
	this.filter.maskBits = 0xFFFF;
	this.filter.groupIndex = 0;
	/**
	 * @type {Box2D.Collision.Shapes.b2Shape}
	 */
	this.shape = null;
	/**
	 * @type {number}
	 */
	this.friction = 0.2;
	/**
	 * @type {number}
	 */
	this.restitution = 0.0;
	/**
	 * @type {number}
	 */
	this.density = 0.0;
	/**
	 * @type {boolean}
	 */
	this.isSensor = false;
};
/**
 * @constructor
 */
Box2D.Dynamics.b2FixtureList = function() {
	/**
	 * @private
	 * @type {Box2D.Dynamics.b2FixtureListNode}
	 */
	this.fixtureFirstNode = null;
	/**
	 * @private
	 * @type {Box2D.Dynamics.b2FixtureListNode}
	 */
	this.fixtureLastNode = null;
	/**
	 * @private
	 * @type {Object.<Box2D.Dynamics.b2FixtureListNode>}
	 */
	this.fixtureNodeLookup = {};
	/**
	 * @private
	 * @type {number}
	 */
	this.fixtureCount = 0;
};
/**
 * @return {Box2D.Dynamics.b2FixtureListNode}
 */
Box2D.Dynamics.b2FixtureList.prototype.GetFirstNode = function() {
	return this.fixtureFirstNode;
};
/**
 * @param {!Box2D.Dynamics.b2Fixture} fixture
 */
Box2D.Dynamics.b2FixtureList.prototype.AddFixture = function(fixture) {
	var fixtureID = fixture.ID;
	if (this.fixtureNodeLookup[fixtureID] == null) {
		var node = new Box2D.Dynamics.b2FixtureListNode(fixture);
		var prevNode = this.fixtureLastNode;
		if (prevNode != null) {
			prevNode.SetNextNode(node);
		} else {
			this.fixtureFirstNode = node;
		}
		node.SetPreviousNode(prevNode);
		this.fixtureLastNode = node;
		this.fixtureNodeLookup[fixtureID] = node;
		this.fixtureCount++;
	}
};
/**
 * @param {!Box2D.Dynamics.b2Fixture} fixture
 */
Box2D.Dynamics.b2FixtureList.prototype.RemoveFixture = function(fixture) {
	var fixtureID = fixture.ID;
	var node = this.fixtureNodeLookup[fixtureID];
	if (node == null) {
		return;
	}
	var prevNode = node.GetPreviousNode();
	var nextNode = node.GetNextNode();
	if (prevNode == null) {
		this.fixtureFirstNode = nextNode;
	} else {
		prevNode.SetNextNode(nextNode);
	}
	if (nextNode == null) {
		this.fixtureLastNode = prevNode;
	} else {
		nextNode.SetPreviousNode(prevNode);
	}
	delete this.fixtureNodeLookup[fixtureID];
	this.fixtureCount--;
};
/**
 * @return {number}
 */
Box2D.Dynamics.b2FixtureList.prototype.GetFixtureCount = function() {
	return this.fixtureCount;
};
/**
 * @param {!Box2D.Dynamics.b2Fixture} fixture
 * @constructor
 */
Box2D.Dynamics.b2FixtureListNode = function(fixture) {
	/**
	 * @const
	 * @type {!Box2D.Dynamics.b2Fixture}
	 */
	this.fixture = fixture;
	/**
	 * @private
	 * @type {Box2D.Dynamics.b2FixtureListNode}
	 */
	this.next = null;
	/**
	 * @private
	 * @type {Box2D.Dynamics.b2FixtureListNode}
	 */
	this.previous = null;
};
/**
 * @param {Box2D.Dynamics.b2FixtureListNode} node
 */
Box2D.Dynamics.b2FixtureListNode.prototype.SetNextNode = function(node) {
	this.next = node;
};
/**
 * @param {Box2D.Dynamics.b2FixtureListNode} node
 */
Box2D.Dynamics.b2FixtureListNode.prototype.SetPreviousNode = function(node) {
	this.previous = node;
};
/**
 * @return {Box2D.Dynamics.b2FixtureListNode}
 */
Box2D.Dynamics.b2FixtureListNode.prototype.GetNextNode = function() {
	return this.next;
};
/**
 * @return {Box2D.Dynamics.b2FixtureListNode}
 */
Box2D.Dynamics.b2FixtureListNode.prototype.GetPreviousNode = function() {
	return this.previous;
};
/**
 * @param {!Box2D.Dynamics.b2ContactListener} listener
 * @param {!Box2D.Dynamics.Contacts.b2ContactSolver} contactSolver
 * @constructor
 */
Box2D.Dynamics.b2Island = function(listener, contactSolver) {
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2ContactListener}
	 */
	this.m_listener = listener;
	/**
	 * @private
	 * @type {!Box2D.Dynamics.Contacts.b2ContactSolver}
	 */
	this.m_contactSolver = contactSolver;
	/**
	 * @private
	 * @type {Array.<!Box2D.Dynamics.b2Body>}
	 */
	this.m_bodies = [];
	/**
	 * @private
	 * @type {Array.<!Box2D.Dynamics.b2Body>}
	 */
	this.m_dynamicBodies = [];
	/**
	 * @private
	 * @type {Array.<!Box2D.Dynamics.b2Body>}
	 */
	this.m_nonStaticBodies = [];
	/**
	 * @private
	 * @type {Array.<!Box2D.Dynamics.Contacts.b2Contact>}
	 */
	this.m_contacts = [];
	/**
	 * @private
	 * @type {Array.<!Box2D.Dynamics.Joints.b2Joint>}
	 */
	this.m_joints = [];
};
Box2D.Dynamics.b2Island.prototype.Clear = function() {
	this.m_bodies = [];
	this.m_dynamicBodies = [];
	this.m_nonStaticBodies = [];
	this.m_contacts = [];
	this.m_joints = [];
};
/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 * @param {!Box2D.Common.Math.b2Vec2} gravity
 * @param {boolean} allowSleep
 */
Box2D.Dynamics.b2Island.prototype.Solve = function(step, gravity, allowSleep) {
	this._InitializeVelocities(step, gravity);
	this.m_contactSolver.Initialize(step, this.m_contacts, this.m_contacts.length);
	this._SolveVelocityConstraints(step);
	this._SolveBodies(step);
	this._SolvePositionConstraints(step);
	this.Report(this.m_contactSolver.m_constraints);
	if (allowSleep) {
		this._SleepIfTired(step);
	}
};
/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 * @param {!Box2D.Common.Math.b2Vec2} gravity
 * @private
 */
Box2D.Dynamics.b2Island.prototype._InitializeVelocities = function(step, gravity) {
	for (var i = 0; i < this.m_dynamicBodies.length; i++) {
		var b = this.m_dynamicBodies[i];
		b.m_linearVelocity.x += step.dt * (gravity.x + b.m_invMass * b.m_force.x);
		b.m_linearVelocity.y += step.dt * (gravity.y + b.m_invMass * b.m_force.y);
		b.m_angularVelocity += step.dt * b.m_invI * b.m_torque;
		b.m_linearVelocity.Multiply(Box2D.Common.Math.b2Math.Clamp(1.0 - step.dt * b.m_linearDamping, 0.0, 1.0));
		b.m_angularVelocity *= Box2D.Common.Math.b2Math.Clamp(1.0 - step.dt * b.m_angularDamping, 0.0, 1.0);
	}
};
/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 * @private
 */
Box2D.Dynamics.b2Island.prototype._SolveVelocityConstraints = function(step) {
	this.m_contactSolver.InitVelocityConstraints(step);
	for (var jointInitIdx = 0; jointInitIdx < this.m_joints.length; jointInitIdx++) {
		this.m_joints[jointInitIdx].InitVelocityConstraints(step);
	}
	for (var velocityIterationCnt = 0; velocityIterationCnt < step.velocityIterations; velocityIterationCnt++) {
		for (var jointSolveIdx = 0; jointSolveIdx < this.m_joints.length; jointSolveIdx++) {
			this.m_joints[jointSolveIdx].SolveVelocityConstraints(step);
		}
		this.m_contactSolver.SolveVelocityConstraints();
	}
	for (var jointFinalizeIdx = 0; jointFinalizeIdx < this.m_joints.length; jointFinalizeIdx++) {
		this.m_joints[jointFinalizeIdx].FinalizeVelocityConstraints();
	}
	this.m_contactSolver.FinalizeVelocityConstraints();
};
/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 * @private
 */
Box2D.Dynamics.b2Island.prototype._SolveBodies = function(step) {
	for (var i = 0; i < this.m_nonStaticBodies.length; ++i) {
		var b = this.m_nonStaticBodies[i];
		var translationX = step.dt * b.m_linearVelocity.x;
		var translationY = step.dt * b.m_linearVelocity.y;
		if ((translationX * translationX + translationY * translationY) > Box2D.Common.b2Settings.b2_maxTranslationSquared) {
			b.m_linearVelocity.Normalize();
			b.m_linearVelocity.x *= Box2D.Common.b2Settings.b2_maxTranslation * step.inv_dt;
			b.m_linearVelocity.y *= Box2D.Common.b2Settings.b2_maxTranslation * step.inv_dt;
		}
		var rotation = step.dt * b.m_angularVelocity;
		if (rotation * rotation > Box2D.Common.b2Settings.b2_maxRotationSquared) {
			if (b.m_angularVelocity < 0.0) {
				b.m_angularVelocity = -Box2D.Common.b2Settings.b2_maxRotation * step.inv_dt;
			} else {
				b.m_angularVelocity = Box2D.Common.b2Settings.b2_maxRotation * step.inv_dt;
			}
		}
		b.m_sweep.c0.SetV(b.m_sweep.c);
		b.m_sweep.a0 = b.m_sweep.a;
		b.m_sweep.c.x += step.dt * b.m_linearVelocity.x;
		b.m_sweep.c.y += step.dt * b.m_linearVelocity.y;
		b.m_sweep.a += step.dt * b.m_angularVelocity;
		b.SynchronizeTransform();
	}
};
/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 * @private
 */
Box2D.Dynamics.b2Island.prototype._SolvePositionConstraints = function(step) {
	for (var i = 0; i < step.positionIterations; i++) {
		var contactsOkay = this.m_contactSolver.SolvePositionConstraints(Box2D.Common.b2Settings.b2_contactBaumgarte);
		var jointsOkay = true;
		for (var j = 0; j < this.m_joints.length; j++) {
			var jointOkay = this.m_joints[j].SolvePositionConstraints(Box2D.Common.b2Settings.b2_contactBaumgarte);
			jointsOkay = jointsOkay && jointOkay;
		}
		if (contactsOkay && jointsOkay) {
			break;
		}
	}
};
/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 * @private
 */
Box2D.Dynamics.b2Island.prototype._SleepIfTired = function(step) {
	var minSleepTime = Number.MAX_VALUE;
	for (var nonstaticBodyIdx = 0; nonstaticBodyIdx < this.m_nonStaticBodies.length; nonstaticBodyIdx++) {
		var b = this.m_nonStaticBodies[nonstaticBodyIdx];
		if (!b.m_allowSleep || Math.abs(b.m_angularVelocity) > Box2D.Common.b2Settings.b2_angularSleepTolerance || Box2D.Common.Math.b2Math.Dot(b.m_linearVelocity, b.m_linearVelocity) > Box2D.Common.b2Settings.b2_linearSleepToleranceSquared) {
			b.m_sleepTime = 0.0;
			minSleepTime = 0.0;
		} else {
			b.m_sleepTime += step.dt;
			minSleepTime = Math.min(minSleepTime, b.m_sleepTime);
		}
	}
	if (minSleepTime >= Box2D.Common.b2Settings.b2_timeToSleep) {
		for (var bodyIdx = 0; bodyIdx < this.m_bodies.length; bodyIdx++) {
			this.m_bodies[bodyIdx].SetAwake(false);
		}
	}
};
/**
 * @param {!Box2D.Dynamics.b2TimeStep} subStep
 */
Box2D.Dynamics.b2Island.prototype.SolveTOI = function(subStep) {
	var i = 0;
	var j = 0;
	this.m_contactSolver.Initialize(subStep, this.m_contacts, this.m_contacts.length);
	var contactSolver = this.m_contactSolver;
	for (i = 0; i < this.m_joints.length; ++i) {
		this.m_joints[i].InitVelocityConstraints(subStep);
	}
	for (i = 0; i < subStep.velocityIterations; ++i) {
		contactSolver.SolveVelocityConstraints();
		for (j = 0; j < this.m_joints.length; ++j) {
			this.m_joints[j].SolveVelocityConstraints(subStep);
		}
	}
	for (i = 0; i < this.m_nonStaticBodies.length; ++i) {
		var b = this.m_nonStaticBodies[i];
		var translationX = subStep.dt * b.m_linearVelocity.x;
		var translationY = subStep.dt * b.m_linearVelocity.y;
		if ((translationX * translationX + translationY * translationY) > Box2D.Common.b2Settings.b2_maxTranslationSquared) {
			b.m_linearVelocity.Normalize();
			b.m_linearVelocity.x *= Box2D.Common.b2Settings.b2_maxTranslation * subStep.inv_dt;
			b.m_linearVelocity.y *= Box2D.Common.b2Settings.b2_maxTranslation * subStep.inv_dt;
		}
		var rotation = subStep.dt * b.m_angularVelocity;
		if (rotation * rotation > Box2D.Common.b2Settings.b2_maxRotationSquared) {
			if (b.m_angularVelocity < 0.0) {
				b.m_angularVelocity = (-Box2D.Common.b2Settings.b2_maxRotation * subStep.inv_dt);
			} else {
				b.m_angularVelocity = Box2D.Common.b2Settings.b2_maxRotation * subStep.inv_dt;
			}
		}
		b.m_sweep.c0.SetV(b.m_sweep.c);
		b.m_sweep.a0 = b.m_sweep.a;
		b.m_sweep.c.x += subStep.dt * b.m_linearVelocity.x;
		b.m_sweep.c.y += subStep.dt * b.m_linearVelocity.y;
		b.m_sweep.a += subStep.dt * b.m_angularVelocity;
		b.SynchronizeTransform();
	}
	var k_toiBaumgarte = 0.75;
	for (i = 0; i < subStep.positionIterations; ++i) {
		var contactsOkay = contactSolver.SolvePositionConstraints(k_toiBaumgarte);
		var jointsOkay = true;
		for (j = 0; j < this.m_joints.length; ++j) {
			var jointOkay = this.m_joints[j].SolvePositionConstraints(Box2D.Common.b2Settings.b2_contactBaumgarte);
			jointsOkay = jointsOkay && jointOkay;
		}
		if (contactsOkay && jointsOkay) {
			break;
		}
	}
	this.Report(contactSolver.m_constraints);
};
/**
 * @param {Array.<!Box2D.Dynamics.Contacts.b2ContactConstraint>} constraints
 */
Box2D.Dynamics.b2Island.prototype.Report = function(constraints) {
	if (this.m_listener == null) {
		return;
	}
	for (var i = 0; i < this.m_contacts.length; ++i) {
		var c = this.m_contacts[i];
		var cc = constraints[i];
		var impulse = new Box2D.Dynamics.b2ContactImpulse();
		for (var j = 0; j < cc.pointCount; ++j) {
			impulse.normalImpulses[j] = cc.points[j].normalImpulse;
			impulse.tangentImpulses[j] = cc.points[j].tangentImpulse;
		}
		this.m_listener.PostSolve(c, impulse);
	}
};
/**
 * @param {!Box2D.Dynamics.b2Body} body
 */
Box2D.Dynamics.b2Island.prototype.AddBody = function(body) {
	this.m_bodies.push(body);
	if (body.GetType() != Box2D.Dynamics.b2BodyDef.b2_staticBody) {
		this.m_nonStaticBodies.push(body);
		if (body.GetType() == Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
			this.m_dynamicBodies.push(body);
		}
	}
};
/**
 * @param {!Box2D.Dynamics.Contacts.b2Contact} contact
 */
Box2D.Dynamics.b2Island.prototype.AddContact = function(contact) {
	this.m_contacts.push(contact);
};
/**
 * @param {!Box2D.Dynamics.Joints.b2Joint} joint
 */
Box2D.Dynamics.b2Island.prototype.AddJoint = function(joint) {
	this.m_joints.push(joint);
};
/**
 * @param {number} dt
 * @param {number} dtRatio
 * @param {number} positionIterations
 * @param {number} velocityIterations
 * @param {boolean} warmStarting
 * @constructor
 */
Box2D.Dynamics.b2TimeStep = function(dt, dtRatio, positionIterations, velocityIterations, warmStarting) {
	/**
	 * @const
	 * @type {number}
	 */
	this.dt = dt;
	var invDT = 0;
	if (dt > 0) {
		invDT = 1 / dt;
	}
	/**
	 * @const
	 * @type {number}
	 */
	this.inv_dt = invDT;
	/**
	 * @const
	 * @type {number}
	 */
	this.dtRatio = dtRatio;
	/**
	 * @const
	 * @type {number}
	 */
	this.positionIterations = positionIterations;
	/**
	 * @const
	 * @type {number}
	 */
	this.velocityIterations = velocityIterations;
	/**
	 * @const
	 * @type {boolean}
	 */
	this.warmStarting = warmStarting;
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} gravity
 * @param {boolean} doSleep
 * @constructor
 */
Box2D.Dynamics.b2World = function(gravity, doSleep) {
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2ContactManager}
	 */
	this.m_contactManager = new Box2D.Dynamics.b2ContactManager(this);
	/**
	 * @private
	 * @type {!Box2D.Dynamics.Contacts.b2ContactSolver}
	 */
	this.m_contactSolver = new Box2D.Dynamics.Contacts.b2ContactSolver();
	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_isLocked = false;
	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_newFixture = false;
	/**
	 * @private
	 * @type {Box2D.Dynamics.b2DestructionListener}
	 */
	this.m_destructionListener = null;
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2BodyList}
	 */
	this.bodyList = new Box2D.Dynamics.b2BodyList();
	/**
	 * @private
	 * @type {!Box2D.Dynamics.Contacts.b2ContactList}
	 */
	 this.contactList = new Box2D.Dynamics.Contacts.b2ContactList();
	/**
	 * @private
	 * @type {Box2D.Dynamics.Joints.b2Joint}
	 */
	this.m_jointList = null;
	/**
	 * @private
	 * @type {!Box2D.Dynamics.Controllers.b2ControllerList}
	 */
	this.controllerList = new Box2D.Dynamics.Controllers.b2ControllerList();
	/**
	 * @private
	 * @type {number}
	 */
	this.m_jointCount = 0;
	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_warmStarting = true;
	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_continuousPhysics = true;
	/**
	 * @private
	 * @type {boolean}
	 */
	this.m_allowSleep = doSleep;
	/**
	 * @private
	 * @type {!Box2D.Common.Math.b2Vec2}
	 */
	this.m_gravity = gravity;
	/**
	 * @private
	 * @type {number}
	 */
	this.m_inv_dt0 = 0.0;
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2Body}
	 */
	this.m_groundBody = this.CreateBody(new Box2D.Dynamics.b2BodyDef());
};
/**
 * @const
 * @type {number}
 */
Box2D.Dynamics.b2World.MAX_TOI = 1.0 - 100.0 * Number.MIN_VALUE;
/**
 * @param {!Box2D.Dynamics.b2DestructionListener} listener
 */
Box2D.Dynamics.b2World.prototype.SetDestructionListener = function(listener) {
	this.m_destructionListener = listener;
};
/**
 * @param {!Box2D.Dynamics.b2ContactFilter} filter
 */
Box2D.Dynamics.b2World.prototype.SetContactFilter = function(filter) {
	this.m_contactManager.m_contactFilter = filter;
};
/**
 * @param {!Box2D.Dynamics.b2ContactListener} listener
 */
Box2D.Dynamics.b2World.prototype.SetContactListener = function(listener) {
	this.m_contactManager.m_contactListener = listener;
};
/**
 * @param {!Box2D.Collision.b2DynamicTreeBroadPhase} broadPhase
 */
Box2D.Dynamics.b2World.prototype.SetBroadPhase = function(broadPhase) {
	var oldBroadPhase = this.m_contactManager.m_broadPhase;
	this.m_contactManager.m_broadPhase = broadPhase;
	for (var node = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.allBodies); node; node = node.GetNextNode()) {
		for (var fixtureNode = node.body.GetFixtureList().GetFirstNode(); fixtureNode; fixtureNode = fixtureNode.GetNextNode()) {
			var f = fixtureNode.fixture;
			f.m_proxy = broadPhase.CreateProxy(oldBroadPhase.GetFatAABB(f.m_proxy), f);
		}
	}
};
/**
 * @return {number}
 */
Box2D.Dynamics.b2World.prototype.GetProxyCount = function() {
	return this.m_contactManager.m_broadPhase.GetProxyCount();
};
/**
 * @param {!Box2D.Dynamics.b2BodyDef} def
 * @return {!Box2D.Dynamics.b2Body}
 */
Box2D.Dynamics.b2World.prototype.CreateBody = function(def) {
;
	var b = new Box2D.Dynamics.b2Body(def, this);
	this.bodyList.AddBody(b);
	return b;
};
/**
 * @param {!Box2D.Dynamics.b2Body} b
 */
Box2D.Dynamics.b2World.prototype.DestroyBody = function(b) {
;
	var jn = b.m_jointList;
	while (jn) {
		var jn0 = jn;
		jn = jn.next;
		if (this.m_destructionListener) {
			this.m_destructionListener.SayGoodbyeJoint(jn0.joint);
		}
		this.DestroyJoint(jn0.joint);
	}
	for (var node = b.GetControllerList().GetFirstNode(); node; node = node.GetNextNode()) {
		node.controller.RemoveBody(b);
	}
	for (var contactNode = b.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
		this.m_contactManager.Destroy(contactNode.contact);
	}
	for (var fixtureNode = b.GetFixtureList().GetFirstNode(); fixtureNode; fixtureNode = fixtureNode.GetNextNode()) {
		if (this.m_destructionListener) {
			this.m_destructionListener.SayGoodbyeFixture(fixtureNode.fixture);
		}
		b.DestroyFixture(fixtureNode.fixture);
	}
	b.Destroy();
	this.bodyList.RemoveBody(b);
};
/**
 * @param {!Box2D.Dynamics.Joints.b2JointDef} def
 * @return {!Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.b2World.prototype.CreateJoint = function(def) {
	var j = Box2D.Dynamics.Joints.b2Joint.Create(def);
	j.m_prev = null;
	j.m_next = this.m_jointList;
	if (this.m_jointList) {
		this.m_jointList.m_prev = j;
	}
	this.m_jointList = j;
	this.m_jointCount++;
	j.m_edgeA.joint = j;
	j.m_edgeA.other = j.m_bodyB;
	j.m_edgeA.prev = null;
	j.m_edgeA.next = j.m_bodyA.m_jointList;
	if (j.m_bodyA.m_jointList) {
		j.m_bodyA.m_jointList.prev = j.m_edgeA;
	}
	j.m_bodyA.m_jointList = j.m_edgeA;
	j.m_edgeB.joint = j;
	j.m_edgeB.other = j.m_bodyA;
	j.m_edgeB.prev = null;
	j.m_edgeB.next = j.m_bodyB.m_jointList;
	if (j.m_bodyB.m_jointList) {
		j.m_bodyB.m_jointList.prev = j.m_edgeB;
	}
	j.m_bodyB.m_jointList = j.m_edgeB;
	var bodyA = def.bodyA;
	var bodyB = def.bodyB;
	if (!def.collideConnected) {
		for (var contactNode = bodyB.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
			if (contactNode.contact.GetOther(bodyB) == bodyA) {
				contactNode.contact.FlagForFiltering();
			}
		}
	}
	return j;
};
/**
 * @param {!Box2D.Dynamics.Joints.b2Joint} j
 */
Box2D.Dynamics.b2World.prototype.DestroyJoint = function(j) {
	var collideConnected = j.m_collideConnected;
	if (j.m_prev) {
		j.m_prev.m_next = j.m_next;
	}
	if (j.m_next) {
		j.m_next.m_prev = j.m_prev;
	}
	if (j == this.m_jointList) {
		this.m_jointList = j.m_next;
	}
	var bodyA = j.m_bodyA;
	var bodyB = j.m_bodyB;
	bodyA.SetAwake(true);
	bodyB.SetAwake(true);
	if (j.m_edgeA.prev) {
		j.m_edgeA.prev.next = j.m_edgeA.next;
	}
	if (j.m_edgeA.next) {
		j.m_edgeA.next.prev = j.m_edgeA.prev;
	}
	if (j.m_edgeA == bodyA.m_jointList) {
		bodyA.m_jointList = j.m_edgeA.next;
	}
	j.m_edgeA.prev = null;
	j.m_edgeA.next = null;
	if (j.m_edgeB.prev) {
		j.m_edgeB.prev.next = j.m_edgeB.next;
	}
	if (j.m_edgeB.next) {
		j.m_edgeB.next.prev = j.m_edgeB.prev;
	}
	if (j.m_edgeB == bodyB.m_jointList) {
		bodyB.m_jointList = j.m_edgeB.next;
	}
	j.m_edgeB.prev = null;
	j.m_edgeB.next = null;
	this.m_jointCount--;
	if (!collideConnected) {
		for (var contactNode = bodyB.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
			if (contactNode.contact.GetOther(bodyB) == bodyA) {
				contactNode.contact.FlagForFiltering();
			}
		}
	}
};
/**
 * @return {!Box2D.Dynamics.Controllers.b2ControllerList}
 */
Box2D.Dynamics.b2World.prototype.GetControllerList = function() {
	return this.controllerList;
};
/**
 * @param {!Box2D.Dynamics.Controllers.b2Controller} c
 * @return {!Box2D.Dynamics.Controllers.b2Controller}
 */
Box2D.Dynamics.b2World.prototype.AddController = function(c) {
	if (c.m_world !== null && c.m_world != this) {
		throw new Error("Controller can only be a member of one world");
	}
	this.controllerList.AddController(c);
	c.m_world = this;
	return c;
};
/**
 * @param {!Box2D.Dynamics.Controllers.b2Controller} c
 */
Box2D.Dynamics.b2World.prototype.RemoveController = function(c) {
	this.controllerList.RemoveController(c);
	c.m_world = null;
	c.Clear();
};
/**
 * @param {!Box2D.Dynamics.Controllers.b2Controller} controller
 * @return {!Box2D.Dynamics.Controllers.b2Controller}
 */
Box2D.Dynamics.b2World.prototype.CreateController = function(controller) {
	return this.AddController(controller);
};
/**
 * @param {!Box2D.Dynamics.Controllers.b2Controller} controller
 */
Box2D.Dynamics.b2World.prototype.DestroyController = function(controller) {
	this.RemoveController(controller);
};
/**
 * @param {boolean} flag
 */
Box2D.Dynamics.b2World.prototype.SetWarmStarting = function(flag) {
	this.m_warmStarting = flag;
};
/**
 * @param {boolean} flag
 */
Box2D.Dynamics.b2World.prototype.SetContinuousPhysics = function(flag) {
	this.m_continuousPhysics = flag;
};
/**
 * @return {number}
 */
Box2D.Dynamics.b2World.prototype.GetBodyCount = function() {
	return this.bodyList.GetBodyCount();
};
/**
 * @return {number}
 */
Box2D.Dynamics.b2World.prototype.GetJointCount = function() {
	return this.m_jointCount;
};
/**
 * @return {number}
 */
Box2D.Dynamics.b2World.prototype.GetContactCount = function() {
	return this.contactList.GetContactCount();
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} gravity
 */
Box2D.Dynamics.b2World.prototype.SetGravity = function(gravity) {
	this.m_gravity = gravity;
};
/**
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Dynamics.b2World.prototype.GetGravity = function() {
	return this.m_gravity;
};
/**
 * @return {!Box2D.Dynamics.b2Body}
 */
Box2D.Dynamics.b2World.prototype.GetGroundBody = function() {
	return this.m_groundBody;
};
/**
 * @param {number} dt
 * @param {number} velocityIterations
 * @param {number} positionIterations
 */
Box2D.Dynamics.b2World.prototype.Step = function(dt, velocityIterations, positionIterations) {
	if (this.m_newFixture) {
		this.m_contactManager.FindNewContacts();
		this.m_newFixture = false;
	}
	this.m_isLocked = true;
	var step = new Box2D.Dynamics.b2TimeStep(dt, this.m_inv_dt0 * dt /* dtRatio */, velocityIterations, positionIterations, this.m_warmStarting);
	this.m_contactManager.Collide();
	if (step.dt > 0.0) {
		this.Solve(step);
		if (this.m_continuousPhysics) {
			this.SolveTOI(step);
		}
		this.m_inv_dt0 = step.inv_dt;
	}
	this.m_isLocked = false;
};
Box2D.Dynamics.b2World.prototype.ClearForces = function() {
	for (var node = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.dynamicBodies); node; node = node.GetNextNode()) {
		node.body.m_force.SetZero();
		node.body.m_torque = 0.0;
	}
};
/**
 * @param {function(!Box2D.Dynamics.b2Fixture):boolean} callback
 * @param {!Box2D.Collision.b2AABB} aabb
 */
Box2D.Dynamics.b2World.prototype.QueryAABB = function(callback, aabb) {
	this.m_contactManager.m_broadPhase.Query(callback, aabb);
};
/**
 * @param {function(!Box2D.Dynamics.b2Fixture): boolean} callback
 * @param {!Box2D.Common.Math.b2Vec2} p
 */
Box2D.Dynamics.b2World.prototype.QueryPoint = function(callback, p) {
	/** @type {function(!Box2D.Dynamics.b2Fixture): boolean} */
	var WorldQueryWrapper = function(fixture) {
		if (fixture.TestPoint(p)) {
			return callback(fixture);
		} else {
			return true;
		}
	};
	var aabb = Box2D.Collision.b2AABB.Get();
	aabb.lowerBound_.Set(p.x - Box2D.Common.b2Settings.b2_linearSlop, p.y - Box2D.Common.b2Settings.b2_linearSlop);
	aabb.upperBound_.Set(p.x + Box2D.Common.b2Settings.b2_linearSlop, p.y + Box2D.Common.b2Settings.b2_linearSlop);
	this.m_contactManager.m_broadPhase.Query(WorldQueryWrapper, aabb);
	Box2D.Collision.b2AABB.Free(aabb);
};
/**
 * @param {function(!Box2D.Dynamics.b2Fixture, !Box2D.Common.Math.b2Vec2, !Box2D.Common.Math.b2Vec2, number): number} callback
 * @param {!Box2D.Common.Math.b2Vec2} point1
 * @param {!Box2D.Common.Math.b2Vec2} point2
 */
Box2D.Dynamics.b2World.prototype.RayCast = function(callback, point1, point2) {
	var broadPhase = this.m_contactManager.m_broadPhase;
	var output = new Box2D.Collision.b2RayCastOutput();
	/**
	 * @param {!Box2D.Collision.b2RayCastInput} input
	 * @param {!Box2D.Dynamics.b2Fixture} fixture
	 */
	var RayCastWrapper = function(input, fixture) {
			var hit = fixture.RayCast(output, input);
			if (hit) {
				var flipFrac = 1 - output.fraction;
				var point = Box2D.Common.Math.b2Vec2.Get(flipFrac * point1.x + output.fraction * point2.x, flipFrac * point1.y + output.fraction * point2.y);
				var retVal = callback(fixture, point, output.normal, output.fraction);
				Box2D.Common.Math.b2Vec2.Free(point);
				return retVal;
			} else {
				return input.maxFraction;
			}
		};
	var input = new Box2D.Collision.b2RayCastInput(point1, point2, 1 /* maxFraction */ );
	broadPhase.RayCast(RayCastWrapper, input);
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} point1
 * @param {!Box2D.Common.Math.b2Vec2} point2
 * @return {Box2D.Dynamics.b2Fixture}
 */
Box2D.Dynamics.b2World.prototype.RayCastOne = function(point1, point2) {
	var result = null;
	/**
	 * @param {!Box2D.Dynamics.b2Fixture} fixture
	 * @param {!Box2D.Common.Math.b2Vec2} point
	 * @param {!Box2D.Common.Math.b2Vec2} normal
	 * @param {number} fraction
	 * @return {number}
	 */
	var RayCastOneWrapper = function(fixture, point, normal, fraction) {
		result = fixture;
		return fraction;
	};
	this.RayCast(RayCastOneWrapper, point1, point2);
	return result;
};
/**
 * @param {!Box2D.Common.Math.b2Vec2} point1
 * @param {!Box2D.Common.Math.b2Vec2} point2
 * @return {Array.<Box2D.Dynamics.b2Fixture>}
 */
Box2D.Dynamics.b2World.prototype.RayCastAll = function(point1, point2) {
	var result = [];
	/**
	 * @param {!Box2D.Dynamics.b2Fixture} fixture
	 * @param {!Box2D.Common.Math.b2Vec2} point
	 * @param {!Box2D.Common.Math.b2Vec2} normal
	 * @param {number} fraction
	 * @return {number}
	 */
	var RayCastAllWrapper = function(fixture, point, normal, fraction) {
		result.push(fixture);
		return 1;
	};
	this.RayCast(RayCastAllWrapper, point1, point2);
	return result;
};
/**
 * @return {!Box2D.Dynamics.b2BodyList}
 */
Box2D.Dynamics.b2World.prototype.GetBodyList = function() {
	return this.bodyList;
};
/**
 * @return {Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.b2World.prototype.GetJointList = function() {
	return this.m_jointList;
};
/**
 * @return {Box2D.Dynamics.Contacts.b2Contact}
 */
Box2D.Dynamics.b2World.prototype.GetContactList = function() {
	return this.contactList;
};
/**
 * @return {boolean}
 */
Box2D.Dynamics.b2World.prototype.IsLocked = function() {
	return this.m_isLocked;
};
var b2solvearray = [];
/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 */
Box2D.Dynamics.b2World.prototype.Solve = function(step) {
	for (var controllerNode = this.controllerList.GetFirstNode(); controllerNode; controllerNode = controllerNode.GetNextNode()) {
		controllerNode.controller.Step(step);
	}
	var m_island = new Box2D.Dynamics.b2Island(this.m_contactManager.m_contactListener, this.m_contactSolver);
	for (var bodyNode = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.allBodies); bodyNode; bodyNode = bodyNode.GetNextNode()) {
		bodyNode.body.m_islandFlag = false;
	}
	for (var contactNode = this.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
		contactNode.contact.m_islandFlag = false;
	}
	for (var j = this.m_jointList; j; j = j.m_next) {
		j.m_islandFlag = false;
	}
	for (var bodyNode = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.nonStaticActiveAwakeBodies); bodyNode; bodyNode = bodyNode.GetNextNode()) {
		var seed = bodyNode.body;
		if (seed.m_islandFlag) {
			continue;
		}
		m_island.Clear();
		b2solvearray.length = 0;
		var stack = b2solvearray;
		stack.push(seed);
		seed.m_islandFlag = true;
		while (stack.length > 0) {
			var b = stack.pop();
			m_island.AddBody(b);
			if (!b.IsAwake()) {
				b.SetAwake(true);
			}
			if (b.GetType() == Box2D.Dynamics.b2BodyDef.b2_staticBody) {
				continue;
			}
			for (var contactNode = b.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.nonSensorEnabledTouchingContacts); contactNode; contactNode = contactNode.GetNextNode()) {
				var contact = contactNode.contact;
				if (contact.m_islandFlag) {
					continue;
				}
				m_island.AddContact(contact);
				contact.m_islandFlag = true;
				var other = contact.GetOther(b);
				if (other.m_islandFlag) {
					continue;
				}
				stack.push(other);
				other.m_islandFlag = true;
			}
			for (var jn = b.m_jointList; jn; jn = jn.next) {
				if (jn.joint.m_islandFlag || !jn.other.IsActive()) {
					continue;
				}
				m_island.AddJoint(jn.joint);
				jn.joint.m_islandFlag = true;
				if (jn.other.m_islandFlag) {
					continue;
				}
				stack.push(jn.other);
				jn.other.m_islandFlag = true;
			}
		}
		m_island.Solve(step, this.m_gravity, this.m_allowSleep);
	}
	for (var bodyNode = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.nonStaticActiveAwakeBodies); bodyNode; bodyNode = bodyNode.GetNextNode()) {
		bodyNode.body.SynchronizeFixtures();
	}
	this.m_contactManager.FindNewContacts();
};
/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 */
Box2D.Dynamics.b2World.prototype.SolveTOI = function(step) {
	var m_island = new Box2D.Dynamics.b2Island(this.m_contactManager.m_contactListener, this.m_contactSolver);
	for (var bodyNode = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.allBodies); bodyNode; bodyNode = bodyNode.GetNextNode()) {
		var b = bodyNode.body;
		b.m_islandFlag = false;
		b.m_sweep.t0 = 0.0;
	}
	for (var contactNode = this.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
		contactNode.contact.m_islandFlag = false;
		contactNode.contact.m_toi = null;
	}
	for (var j = this.m_jointList; j; j = j.m_next) {
		j.m_islandFlag = false;
	}
	while (true) {
		var toi2 = this._SolveTOI2(step);
		var minContact = toi2.minContact;
		var minTOI = toi2.minTOI;
		if (minContact === null || Box2D.Dynamics.b2World.MAX_TOI < minTOI) {
			break;
		}
		var fixtureABody = minContact.m_fixtureA.GetBody();
		var fixtureBBody =  minContact.m_fixtureB.GetBody();
		Box2D.Dynamics.b2World.s_backupA.Set(fixtureABody.m_sweep);
		Box2D.Dynamics.b2World.s_backupB.Set(fixtureBBody.m_sweep);
		fixtureABody.Advance(minTOI);
		fixtureBBody.Advance(minTOI);
		minContact.Update(this.m_contactManager.m_contactListener);
		minContact.m_toi = null;
		if (minContact.sensor || !minContact.enabled) {
			fixtureABody.m_sweep.Set(Box2D.Dynamics.b2World.s_backupA);
			fixtureBBody.m_sweep.Set(Box2D.Dynamics.b2World.s_backupB);
			fixtureABody.SynchronizeTransform();
			fixtureBBody.SynchronizeTransform();
			continue;
		}
		if (!minContact.touching) {
			continue;
		}
		var seed = fixtureABody;
		if (seed.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
			seed = fixtureBBody;
		}
		m_island.Clear();
		b2solvearray.length = 0;
		var queue = b2solvearray;
		queue.push(seed);
		seed.m_islandFlag = true;
		while (queue.length > 0) {
			var b = queue.pop();
			m_island.AddBody(b);
			if (!b.IsAwake()) {
				b.SetAwake(true);
			}
			if (b.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
				continue;
			}
			for (var contactNode = b.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.nonSensorEnabledTouchingContacts); contactNode; contactNode = contactNode.GetNextNode()) {
				if (m_island.m_contactCount == Box2D.Common.b2Settings.b2_maxTOIContactsPerIsland) {
					break;
				}
				var contact = contactNode.contact;
				if (contact.m_islandFlag) {
					continue;
				}
				m_island.AddContact(contact);
				contact.m_islandFlag = true;
				var other = contact.GetOther(b);
				if (other.m_islandFlag) {
					continue;
				}
				if (other.GetType() != Box2D.Dynamics.b2BodyDef.b2_staticBody) {
					other.Advance(minTOI);
					other.SetAwake(true);
					queue.push(other);
				}
				other.m_islandFlag = true;
			}
			for (var jEdge = b.m_jointList; jEdge; jEdge = jEdge.next) {
				if (m_island.m_jointCount == Box2D.Common.b2Settings.b2_maxTOIJointsPerIsland) {
					continue;
				}
				if (jEdge.joint.m_islandFlag || !jEdge.other.IsActive()) {
					continue;
				}
				m_island.AddJoint(jEdge.joint);
				jEdge.joint.m_islandFlag = true;
				if (jEdge.other.m_islandFlag) {
					continue;
				}
				if (jEdge.other.GetType() != Box2D.Dynamics.b2BodyDef.b2_staticBody) {
					jEdge.other.Advance(minTOI);
					jEdge.other.SetAwake(true);
					queue.push(jEdge.other);
				}
				jEdge.other.m_islandFlag = true;
			}
		}
		m_island.SolveTOI(new Box2D.Dynamics.b2TimeStep((1.0 - minTOI) * step.dt /* dt */, 0 /* dtRatio */, step.velocityIterations, step.positionIterations, false /* warmStarting */));
		for (var i = 0; i < m_island.m_bodies.length; i++) {
			m_island.m_bodies[i].m_islandFlag = false;
			if (!m_island.m_bodies[i].IsAwake() || m_island.m_bodies[i].GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) {
				continue;
			}
			m_island.m_bodies[i].SynchronizeFixtures();
			for (var contactNode = m_island.m_bodies[i].contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts); contactNode; contactNode = contactNode.GetNextNode()) {
				contactNode.contact.m_toi = null;
			}
		}
		for (var i = 0; i < m_island.m_contactCount; i++) {
			m_island.m_contacts[i].m_islandFlag = false;
			m_island.m_contacts[i].m_toi = null;
		}
		for (var i = 0; i < m_island.m_jointCount; i++) {
			m_island.m_joints[i].m_islandFlag = false;
		}
		this.m_contactManager.FindNewContacts();
	}
};
/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 * @return {{minContact: Box2D.Dynamics.Contacts.b2Contact, minTOI: number}}
 */
Box2D.Dynamics.b2World.prototype._SolveTOI2 = function(step) {
	var minContact = null;
	var minTOI = 1.0;
	var contacts = 0;
	for (var contactNode = this.contactList.GetFirstNode(Box2D.Dynamics.Contacts.b2ContactList.TYPES.nonSensorEnabledContinuousContacts); contactNode; contactNode = contactNode.GetNextNode()) {
		var c = contactNode.contact;
		if (this._SolveTOI2SkipContact(step, c)) {
			continue;
		}
		var toi = 1.0;
		if (c.m_toi != null) {
			toi = c.m_toi;
		} else if (c.touching) {
			toi = 1;
			c.m_toi = toi;
		} else {
			var fixtureABody = c.m_fixtureA.GetBody();
			var fixtureBBody = c.m_fixtureB.GetBody();
			var t0 = fixtureABody.m_sweep.t0;
			if (fixtureABody.m_sweep.t0 < fixtureBBody.m_sweep.t0) {
				t0 = fixtureBBody.m_sweep.t0;
				fixtureABody.m_sweep.Advance(t0);
			} else if (fixtureBBody.m_sweep.t0 < fixtureABody.m_sweep.t0) {
				t0 = fixtureABody.m_sweep.t0;
				fixtureBBody.m_sweep.Advance(t0);
			}
			toi = c.ComputeTOI(fixtureABody.m_sweep, fixtureBBody.m_sweep);
;
			if (toi > 0.0 && toi < 1.0) {
				toi = (1.0 - toi) * t0 + toi;
			}
			c.m_toi = toi;
		}
		if (Number.MIN_VALUE < toi && toi < minTOI) {
			minContact = c;
			minTOI = toi;
		}
	}
	return {
		minContact: minContact,
		minTOI: minTOI
	};
};
/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 * @param {!Box2D.Dynamics.Contacts.b2Contact} c
 * @return {boolean}
 */
Box2D.Dynamics.b2World.prototype._SolveTOI2SkipContact = function(step, c) {
	var fixtureABody = c.m_fixtureA.GetBody();
	var fixtureBBody = c.m_fixtureB.GetBody();
	if ((fixtureABody.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody || !fixtureABody.IsAwake()) && (fixtureBBody.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody || !fixtureBBody.IsAwake())) {
		return true;
	}
	return false;
};
/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 * @constructor
 */
Box2D.Dynamics.Contacts.b2Contact = function(fixtureA, fixtureB) {
	/**
	 * @const
	 * @private
	 * @type {string}
	 */
	this.ID = "Contact" + Box2D.Dynamics.Contacts.b2Contact.NEXT_ID++;
	/**
	 * @private
	 * @type {!Box2D.Collision.b2Manifold}
	 */
	this.m_manifold = new Box2D.Collision.b2Manifold();
	/**
	 * @private
	 * @type {!Box2D.Collision.b2Manifold}
	 */
	this.m_oldManifold = new Box2D.Collision.b2Manifold();
	/**
	 * @private
	 * @type {boolean}
	 */
	this.touching = false;
	var bodyA = fixtureA.GetBody();
	var bodyB = fixtureB.GetBody();
	/**
	 * @private
	 * @type {boolean}
	 */
	this.continuous = (bodyA.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) ||
					  bodyA.IsBullet() ||
					  (bodyB.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) ||
					  bodyB.IsBullet();
	/**
	 * @private
	 * @type {boolean}
	 */
	this.sensor = fixtureA.IsSensor() || fixtureB.IsSensor();
	/**
	 * @private
	 * @type {boolean}
	 */
	this.filtering = false;
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2Fixture}
	 */
	this.m_fixtureA = fixtureA;
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2Fixture}
	 */
	this.m_fixtureB = fixtureB;
	/**
	 * @private
	 * @type {boolean}
	 */
	this.enabled = true;
	/**
	 * @private
	 * @type {!Box2D.Dynamics.Contacts.b2ContactList}
	 */
	this.bodyAList = bodyA.GetContactList();
	/**
	 * @private
	 * @type {!Box2D.Dynamics.Contacts.b2ContactList}
	 */
	this.bodyBList = bodyB.GetContactList();
	/**
	 * @private
	 * @type {!Box2D.Dynamics.Contacts.b2ContactList}
	 */
	this.worldList = bodyB.GetWorld().GetContactList();
	this.AddToLists();
};
/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.Reset = function(fixtureA, fixtureB) {
	this.m_manifold.Reset();
	this.m_oldManifold.Reset();
	this.touching = false;
	var bodyA = fixtureA.GetBody();
	var bodyB = fixtureB.GetBody();
	this.continuous = (bodyA.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) ||
					  bodyA.IsBullet() ||
					  (bodyB.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody) ||
					  bodyB.IsBullet();
	this.sensor = fixtureA.IsSensor() || fixtureB.IsSensor();
	this.filtering = false;
	this.m_fixtureA = fixtureA;
	this.m_fixtureB = fixtureB;
	this.enabled = true;
	this.bodyAList = bodyA.GetContactList();
	this.bodyBList = bodyB.GetContactList();
	this.worldList = bodyB.GetWorld().GetContactList();
	this.AddToLists();
};
Box2D.Dynamics.Contacts.b2Contact.prototype.AddToLists = function () {
	this.bodyAList.AddContact(this);
	this.bodyBList.AddContact(this);
	this.worldList.AddContact(this);
	this.UpdateLists();
};
Box2D.Dynamics.Contacts.b2Contact.prototype.UpdateLists = function () {
	var nonSensorEnabledTouching = false;
	var nonSensorEnabledContinuous = false;
	if (!this.IsSensor() && this.IsEnabled()) {
		if (this.IsTouching()) {
			nonSensorEnabledTouching = true;
		}
		if (this.IsContinuous()) {
			nonSensorEnabledContinuous = true;
		}
	}
	this.bodyAList.UpdateContact(this, nonSensorEnabledTouching, nonSensorEnabledContinuous);
	this.bodyBList.UpdateContact(this, nonSensorEnabledTouching, nonSensorEnabledContinuous);
	this.worldList.UpdateContact(this, nonSensorEnabledTouching, nonSensorEnabledContinuous);
};
Box2D.Dynamics.Contacts.b2Contact.prototype.RemoveFromLists = function () {
	this.bodyAList.RemoveContact(this);
	this.bodyBList.RemoveContact(this);
	this.worldList.RemoveContact(this);
};
/**
 * @return {!Box2D.Collision.b2Manifold}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.GetManifold = function () {
  return this.m_manifold;
};
/**
 * @param {!Box2D.Collision.b2WorldManifold} worldManifold
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.GetWorldManifold = function (worldManifold) {
	var bodyA = this.m_fixtureA.GetBody();
	var bodyB = this.m_fixtureB.GetBody();
	var shapeA = this.m_fixtureA.GetShape();
	var shapeB = this.m_fixtureB.GetShape();
	worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
};
/**
 * @return {boolean}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.IsTouching = function () {
  return this.touching;
};
/**
 * @return {boolean}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.IsContinuous = function () {
  return this.continuous;
};
/**
 * @param {boolean} sensor
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.SetSensor = function (sensor) {
   this.sensor = sensor;
   this.UpdateLists();
};
/**
 * @return {boolean}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.IsSensor = function () {
  return this.sensor;
};
/**
 * @param {boolean} flag
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.SetEnabled = function (flag) {
   this.enabled = flag;
   this.UpdateLists();
};
/**
 * @return {boolean}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.IsEnabled = function () {
   return this.enabled;
};
/**
 * @return {Box2D.Dynamics.Contacts.b2Contact}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.GetNext = function () {
  return this.m_next;
};
/**
 * @return {!Box2D.Dynamics.b2Fixture}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.GetFixtureA = function () {
  return this.m_fixtureA;
};
/**
 * @return {!Box2D.Dynamics.b2Fixture}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.GetFixtureB = function () {
  return this.m_fixtureB;
};
/**
 * @param {!Box2D.Dynamics.b2Body} body
 * @return {!Box2D.Dynamics.b2Body}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.GetOther = function (body) {
	var bodyA = this.m_fixtureA.GetBody();
	if (bodyA != body) {
		return bodyA;
	} else {
		return this.m_fixtureB.GetBody();
	}
};
Box2D.Dynamics.Contacts.b2Contact.prototype.FlagForFiltering = function () {
   this.filtering = true;
};
Box2D.Dynamics.Contacts.b2Contact.prototype.ClearFiltering = function () {
   this.filtering = false;
};
/**
 * @return {boolean}
 */
Box2D.Dynamics.Contacts.b2Contact.prototype.IsFiltering = function () {
   return this.filtering;
};
Box2D.Dynamics.Contacts.b2Contact.prototype.Update = function (listener) {
  var tManifold = this.m_oldManifold;
  this.m_oldManifold = this.m_manifold;
  this.m_manifold = tManifold;
  this.enabled = true;
  var touching = false;
  var wasTouching = this.IsTouching();
  var bodyA = this.m_fixtureA.GetBody();
  var bodyB = this.m_fixtureB.GetBody();
  var aabbOverlap = this.m_fixtureA.m_aabb.TestOverlap(this.m_fixtureB.m_aabb);
  if (this.sensor) {
	 if (aabbOverlap) {
		touching = Box2D.Collision.Shapes.b2Shape.TestOverlap(this.m_fixtureA.GetShape(), bodyA.GetTransform(), this.m_fixtureB.GetShape(), bodyB.GetTransform());
	 }
	 this.m_manifold.m_pointCount = 0;
  } else {
	 if (bodyA.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody || bodyA.IsBullet() || bodyB.GetType() != Box2D.Dynamics.b2BodyDef.b2_dynamicBody || bodyB.IsBullet()) {
		this.continuous = true;
	 } else {
		this.continuous = false;
	 }
	 if (aabbOverlap) {
		this.Evaluate();
		touching = this.m_manifold.m_pointCount > 0;
		for (var i = 0; i < this.m_manifold.m_pointCount; i++) {
		   var mp2 = this.m_manifold.m_points[i];
		   mp2.m_normalImpulse = 0.0;
		   mp2.m_tangentImpulse = 0.0;
		   for (var j = 0; j < this.m_oldManifold.m_pointCount; j++) {
			  var mp1 = this.m_oldManifold.m_points[j];
			  if (mp1.m_id.GetKey() == mp2.m_id.GetKey()) {
				 mp2.m_normalImpulse = mp1.m_normalImpulse;
				 mp2.m_tangentImpulse = mp1.m_tangentImpulse;
				 break;
			  }
		   }
		}
	 } else {
		this.m_manifold.m_pointCount = 0;
	 }
	 if (touching != wasTouching) {
		bodyA.SetAwake(true);
		bodyB.SetAwake(true);
	 }
  }
  this.touching = touching;
  if (touching != wasTouching) {
	 this.UpdateLists();
  }
  if (!wasTouching && touching) {
	 listener.BeginContact(this);
  }
  if (wasTouching && !touching) {
	 listener.EndContact(this);
  }
  if (!this.sensor) {
	 listener.PreSolve(this, this.m_oldManifold);
  }
};
Box2D.Dynamics.Contacts.b2Contact.prototype.Evaluate = function () {};
Box2D.Dynamics.Contacts.b2Contact.prototype.ComputeTOI = function (sweepA, sweepB) {
  Box2D.Dynamics.Contacts.b2Contact.s_input.proxyA.Set(this.m_fixtureA.GetShape());
  Box2D.Dynamics.Contacts.b2Contact.s_input.proxyB.Set(this.m_fixtureB.GetShape());
  Box2D.Dynamics.Contacts.b2Contact.s_input.sweepA = sweepA;
  Box2D.Dynamics.Contacts.b2Contact.s_input.sweepB = sweepB;
  Box2D.Dynamics.Contacts.b2Contact.s_input.tolerance = Box2D.Common.b2Settings.b2_linearSlop;
  return Box2D.Collision.b2TimeOfImpact.TimeOfImpact(Box2D.Dynamics.Contacts.b2Contact.s_input);
};
Box2D.Dynamics.Contacts.b2Contact.s_input = new Box2D.Collision.b2TOIInput();
/**
 * @type {number}
 * @private
 */
Box2D.Dynamics.Contacts.b2Contact.NEXT_ID = 0;
/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 * @constructor
 * @extends {Box2D.Dynamics.Contacts.b2Contact}
 */
Box2D.Dynamics.Contacts.b2CircleContact = function(fixtureA, fixtureB) {
	Box2D.Dynamics.Contacts.b2Contact.call(this, fixtureA, fixtureB);
};
c2inherit(Box2D.Dynamics.Contacts.b2CircleContact, Box2D.Dynamics.Contacts.b2Contact);
/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 */
Box2D.Dynamics.Contacts.b2CircleContact.prototype.Reset = function(fixtureA, fixtureB) {
	Box2D.Dynamics.Contacts.b2Contact.prototype.Reset.call(this, fixtureA, fixtureB);
};
Box2D.Dynamics.Contacts.b2CircleContact.prototype.Evaluate = function() {
	Box2D.Collision.b2Collision.CollideCircles(this.m_manifold, this.m_fixtureA.GetShape(), this.m_fixtureA.GetBody().m_xf, this.m_fixtureB.GetShape(), this.m_fixtureB.GetBody().m_xf);
};
/**
 * @constructor
 */
Box2D.Dynamics.Contacts.b2ContactConstraint = function() {
	this.localPlaneNormal = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localPoint = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.normal = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.normalMass = new Box2D.Common.Math.b2Mat22();
	this.K = new Box2D.Common.Math.b2Mat22();
	this.points = [];
	for (var i = 0; i < Box2D.Common.b2Settings.b2_maxManifoldPoints; i++) {
		this.points[i] = new Box2D.Dynamics.Contacts.b2ContactConstraintPoint();
	}
};
/**
 * @constructor
 */
Box2D.Dynamics.Contacts.b2ContactConstraintPoint = function() {
	  this.localPoint = Box2D.Common.Math.b2Vec2.Get(0, 0);
	  this.rA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	  this.rB = Box2D.Common.Math.b2Vec2.Get(0, 0);
};
Box2D.Dynamics.Contacts.b2ContactConstraintPoint.prototype.Reset = function() {
	this.localPoint.Set(0, 0);
	this.rA.Set(0, 0);
	this.rB.Set(0, 0);
};
/**
 * @constructor
 */
Box2D.Dynamics.Contacts.b2ContactFactory = function() {
	/**
	 * @private
	 */
	this.m_registers = {};
	/**
	 * @private
	 * @type {Object.<Object.<Array.<!Box2D.Dynamics.b2Contact>>>}
	 */
	this.m_freeContacts = {};
	this.AddType(Box2D.Dynamics.Contacts.b2CircleContact, Box2D.Collision.Shapes.b2CircleShape.NAME, Box2D.Collision.Shapes.b2CircleShape.NAME);
	this.AddType(Box2D.Dynamics.Contacts.b2PolyAndCircleContact, Box2D.Collision.Shapes.b2PolygonShape.NAME, Box2D.Collision.Shapes.b2CircleShape.NAME);
	this.AddType(Box2D.Dynamics.Contacts.b2PolygonContact, Box2D.Collision.Shapes.b2PolygonShape.NAME, Box2D.Collision.Shapes.b2PolygonShape.NAME);
	this.AddType(Box2D.Dynamics.Contacts.b2EdgeAndCircleContact, Box2D.Collision.Shapes.b2EdgeShape.NAME, Box2D.Collision.Shapes.b2CircleShape.NAME);
	this.AddType(Box2D.Dynamics.Contacts.b2PolyAndEdgeContact, Box2D.Collision.Shapes.b2PolygonShape.NAME, Box2D.Collision.Shapes.b2EdgeShape.NAME);
};
Box2D.Dynamics.Contacts.b2ContactFactory.prototype.AddType = function(ctor, type1, type2) {
	this.m_freeContacts[type1] = this.m_freeContacts[type1] || {};
	this.m_freeContacts[type1][type2] = this.m_freeContacts[type1][type2] || [];
	this.m_registers[type1] = this.m_registers[type1] || {};
	this.m_registers[type1][type2] = new Box2D.Dynamics.Contacts.b2ContactRegister();
	this.m_registers[type1][type2].ctor = ctor;
	this.m_registers[type1][type2].primary = true;
	if (type1 != type2) {
		this.m_registers[type2] = this.m_registers[type2] || {};
		this.m_registers[type2][type1] = new Box2D.Dynamics.Contacts.b2ContactRegister();
		this.m_registers[type2][type1].ctor = ctor;
		this.m_registers[type2][type1].primary = false;
	}
};
Box2D.Dynamics.Contacts.b2ContactFactory.prototype.Create = function(fixtureA, fixtureB) {
	var type1 = fixtureA.GetShape().GetTypeName();
	var type2 = fixtureB.GetShape().GetTypeName();
	var reg = this.m_registers[type1][type2];
	var ctor = reg.ctor;
	if (ctor != null) {
		if (reg.primary) {
			if (this.m_freeContacts[type1][type2].length > 0) {
				var c = this.m_freeContacts[type1][type2].pop();
				c.Reset(fixtureA, fixtureB);
				return c;
			}
			return new ctor(fixtureA, fixtureB);
		} else {
			if (this.m_freeContacts[type2][type1].length > 0) {
				var c = this.m_freeContacts[type2][type1].pop();
				c.Reset(fixtureB, fixtureA);
				return c;
			}
			return new ctor(fixtureB, fixtureA);
		}
	} else {
		return null;
	}
};
Box2D.Dynamics.Contacts.b2ContactFactory.prototype.Destroy = function(contact) {
	var type1 = contact.m_fixtureA.GetShape().GetTypeName();
	var type2 = contact.m_fixtureB.GetShape().GetTypeName();
	this.m_freeContacts[type1][type2].push(contact);
};
/**
 * @constructor
 */
Box2D.Dynamics.Contacts.b2ContactList = function() {
	/**
	 * @private
	 * @type {Array.<Box2D.Dynamics.Contacts.b2ContactListNode>}
	 */
	this.contactFirstNodes = [];
	for(var i = 0; i <= Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts; i++) {
		this.contactFirstNodes[i] = null;
	}
	/**
	 * @private
	 * @type {Array.<Box2D.Dynamics.Contacts.b2ContactListNode>}
	 */
	this.contactLastNodes = [];
	for(var i = 0; i <= Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts; i++) {
		this.contactLastNodes[i] = null;
	}
	/**
	 * @private
	 * @type {Object.<Array.<Box2D.Dynamics.Contacts.b2ContactListNode>>}
	 */
	this.contactNodeLookup = {};
	/**
	 * @private
	 * @type {number}
	 */
	this.contactCount = 0;
};
/**
 * @param {number} type
 * @return {Box2D.Dynamics.Contacts.b2ContactListNode}
 */
Box2D.Dynamics.Contacts.b2ContactList.prototype.GetFirstNode = function(type) {
	return this.contactFirstNodes[type];
};
/**
 * @param {!Box2D.Dynamics.Contacts.b2Contact} contact
 */
Box2D.Dynamics.Contacts.b2ContactList.prototype.AddContact = function(contact) {
	var contactID = contact.ID;
	if (this.contactNodeLookup[contactID] == null) {
		this.contactNodeLookup[contactID] = [];
		for(var i = 0; i <= Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts; i++) {
			this.contactNodeLookup[contactID][i] = null;
		}
		this.CreateNode(contact, contactID, Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts);
		this.contactCount++;
	}
};
/**
 * @param {!Box2D.Dynamics.Contacts.b2Contact} contact
 */
Box2D.Dynamics.Contacts.b2ContactList.prototype.UpdateContact = function(contact, nonSensorEnabledTouching, nonSensorEnabledContinuous) {
	if (nonSensorEnabledTouching) {
		this.CreateNode(contact, contact.ID, Box2D.Dynamics.Contacts.b2ContactList.TYPES.nonSensorEnabledTouchingContacts);
	} else {
		this.RemoveNode(contact.ID, Box2D.Dynamics.Contacts.b2ContactList.TYPES.nonSensorEnabledTouchingContacts);
	}
	if (nonSensorEnabledContinuous) {
		this.CreateNode(contact, contact.ID, Box2D.Dynamics.Contacts.b2ContactList.TYPES.nonSensorEnabledContinuousContacts);
	} else {
		this.RemoveNode(contact.ID, Box2D.Dynamics.Contacts.b2ContactList.TYPES.nonSensorEnabledContinuousContacts);
	}
};
/**
 * @param {!Box2D.Dynamics.Contacts.b2Contact} contact
 */
Box2D.Dynamics.Contacts.b2ContactList.prototype.RemoveContact = function(contact) {
	var contactID = contact.ID;
	if (this.contactNodeLookup[contactID] != null) {
		for(var i = 0; i <= Box2D.Dynamics.Contacts.b2ContactList.TYPES.allContacts; i++) {
			this.RemoveNode(contactID, i);
		}
		delete this.contactNodeLookup[contactID];
		this.contactCount--;
	}
};
/**
 * @param {string} contactID
 * @param {number} type
 */
Box2D.Dynamics.Contacts.b2ContactList.prototype.RemoveNode = function(contactID, type) {
	var nodeList = this.contactNodeLookup[contactID];
	if (nodeList == null) {
		return;
	}
	var node = nodeList[type];
	if (node == null) {
		return;
	}
	nodeList[type] = null;
	var prevNode = node.GetPreviousNode();
	var nextNode = node.GetNextNode();
	if (prevNode == null) {
		this.contactFirstNodes[type] = nextNode;
	} else {
		prevNode.SetNextNode(nextNode);
	}
	if (nextNode == null) {
		this.contactLastNodes[type] = prevNode;
	} else {
		nextNode.SetPreviousNode(prevNode);
	}
	Box2D.Dynamics.Contacts.b2ContactListNode.FreeNode(node);
};
/**
 * @param {!Box2D.Dynamics.Contacts.b2Contact} contact
 * @param {string} contactID
 * @param {number} type
 */
Box2D.Dynamics.Contacts.b2ContactList.prototype.CreateNode = function(contact, contactID, type) {
	var nodeList = this.contactNodeLookup[contactID];
	if (nodeList[type] == null) {
		nodeList[type] = Box2D.Dynamics.Contacts.b2ContactListNode.GetNode(contact);
		var prevNode = this.contactLastNodes[type];
		if (prevNode != null) {
			prevNode.SetNextNode(nodeList[type]);
			nodeList[type].SetPreviousNode(prevNode);
		} else {
			this.contactFirstNodes[type] = nodeList[type];
		}
		this.contactLastNodes[type] = nodeList[type];
	}
};
/**
 * @return {number}
 */
Box2D.Dynamics.Contacts.b2ContactList.prototype.GetContactCount = function() {
	return this.contactCount;
};
/**
 * @enum {number}
 */
Box2D.Dynamics.Contacts.b2ContactList.TYPES = {
	nonSensorEnabledTouchingContacts: 0,
	nonSensorEnabledContinuousContacts: 1,
	allContacts: 2 // Assumed to be last by above code
};
/**
 * @param {!Box2D.Dynamics.Contacts.b2Contact} contact
 * @constructor
 */
Box2D.Dynamics.Contacts.b2ContactListNode = function(contact) {
	/**
	 * @private
	 * @type {!Box2D.Dynamics.Contacts.b2Contact}
	 */
	this.contact = contact;
	/**
	 * @private
	 * @type {Box2D.Dynamics.Contacts.b2ContactListNode}
	 */
	this.next = null;
	/**
	 * @private
	 * @type {Box2D.Dynamics.Contacts.b2ContactListNode}
	 */
	this.previous = null;
};
/**
 * @private
 * @type {Array.<!Box2D.Dynamics.Contacts.b2ContactListNode>
 */
Box2D.Dynamics.Contacts.b2ContactListNode.freeNodes = [];
/**
 * @param {!Box2D.Dynamics.Contacts.b2Contact} contact
 * @return {!Box2D.Dynamics.Contacts.b2ContactListNode}
 */
Box2D.Dynamics.Contacts.b2ContactListNode.GetNode = function(contact) {
	if (Box2D.Dynamics.Contacts.b2ContactListNode.freeNodes.length > 0) {
		var node = Box2D.Dynamics.Contacts.b2ContactListNode.freeNodes.pop();
		node.next = null;
		node.previous = null;
		node.contact = contact;
		return node;
	} else {
		return new Box2D.Dynamics.Contacts.b2ContactListNode(contact);
	}
};
/**
 * @param {!Box2D.Dynamics.Contacts.b2ContactListNode} node
 */
Box2D.Dynamics.Contacts.b2ContactListNode.FreeNode = function(node) {
	Box2D.Dynamics.Contacts.b2ContactListNode.freeNodes.push(node);
};
/**
 * @param {Box2D.Dynamics.Contacts.b2ContactListNode} node
 */
Box2D.Dynamics.Contacts.b2ContactListNode.prototype.SetNextNode = function(node) {
	this.next = node;
};
/**
 * @param {Box2D.Dynamics.Contacts.b2ContactListNode} node
 */
Box2D.Dynamics.Contacts.b2ContactListNode.prototype.SetPreviousNode = function(node) {
	this.previous = node;
};
/**
 * @return {!Box2D.Dynamics.Contacts.b2Contact}
 */
Box2D.Dynamics.Contacts.b2ContactListNode.prototype.GetContact = function() {
	return this.contact;
};
/**
 * @return {Box2D.Dynamics.Contacts.b2ContactListNode}
 */
Box2D.Dynamics.Contacts.b2ContactListNode.prototype.GetNextNode = function() {
	return this.next;
};
/**
 * @return {Box2D.Dynamics.Contacts.b2ContactListNode}
 */
Box2D.Dynamics.Contacts.b2ContactListNode.prototype.GetPreviousNode = function() {
	return this.previous;
};
/**
 * @constructor
 */
Box2D.Dynamics.Contacts.b2ContactRegister = function () {
	this.pool = null;
	this.poolCount = 0;
};
/**
 * @constructor
 */
Box2D.Dynamics.Contacts.b2PositionSolverManifold = function() {
	this.m_normal = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_separations = [];
	this.m_points = [];
	for (var i = 0; i < Box2D.Common.b2Settings.b2_maxManifoldPoints; i++) {
		this.m_points[i] = Box2D.Common.Math.b2Vec2.Get(0, 0);
	}
};
/**
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraint} cc
 */
Box2D.Dynamics.Contacts.b2PositionSolverManifold.prototype.Initialize = function(cc) {
;
	switch (cc.type) {
		case Box2D.Collision.b2Manifold.e_circles:
			this._InitializeCircles(cc);
			break;
		case Box2D.Collision.b2Manifold.e_faceA:
			this._InitializeFaceA(cc);
			break;
		case Box2D.Collision.b2Manifold.e_faceB:
			this._InitializeFaceB(cc);
			break;
	}
};
/**
 * @private
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraint} cc
 */
Box2D.Dynamics.Contacts.b2PositionSolverManifold.prototype._InitializeCircles = function(cc) {
	var tMat = cc.bodyA.m_xf.R;
	var tVec = cc.localPoint;
	var pointAX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	var pointAY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	tMat = cc.bodyB.m_xf.R;
	tVec = cc.points[0].localPoint;
	var pointBX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
	var pointBY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
	var dX = pointBX - pointAX;
	var dY = pointBY - pointAY;
	var d2 = dX * dX + dY * dY;
	if (d2 > Box2D.Common.b2Settings.MIN_VALUE_SQUARED) {
		var d = Math.sqrt(d2);
		this.m_normal.x = dX / d;
		this.m_normal.y = dY / d;
	} else {
		this.m_normal.x = 1.0;
		this.m_normal.y = 0.0;
	}
	this.m_points[0].x = 0.5 * (pointAX + pointBX);
	this.m_points[0].y = 0.5 * (pointAY + pointBY);
	this.m_separations[0] = dX * this.m_normal.x + dY * this.m_normal.y - cc.radius;
};
/**
 * @private
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraint} cc
 */
Box2D.Dynamics.Contacts.b2PositionSolverManifold.prototype._InitializeFaceA = function(cc) {
	this.m_normal.x = cc.bodyA.m_xf.R.col1.x * cc.localPlaneNormal.x + cc.bodyA.m_xf.R.col2.x * cc.localPlaneNormal.y;
	this.m_normal.y = cc.bodyA.m_xf.R.col1.y * cc.localPlaneNormal.x + cc.bodyA.m_xf.R.col2.y * cc.localPlaneNormal.y;
	var planePointX = cc.bodyA.m_xf.position.x + (cc.bodyA.m_xf.R.col1.x * cc.localPoint.x + cc.bodyA.m_xf.R.col2.x * cc.localPoint.y);
	var planePointY = cc.bodyA.m_xf.position.y + (cc.bodyA.m_xf.R.col1.y * cc.localPoint.x + cc.bodyA.m_xf.R.col2.y * cc.localPoint.y);
	for (var i = 0; i < cc.pointCount; i++) {
		var clipPointX = cc.bodyB.m_xf.position.x + (cc.bodyB.m_xf.R.col1.x * cc.points[i].localPoint.x + cc.bodyB.m_xf.R.col2.x * cc.points[i].localPoint.y);
		var clipPointY = cc.bodyB.m_xf.position.y + (cc.bodyB.m_xf.R.col1.y * cc.points[i].localPoint.x + cc.bodyB.m_xf.R.col2.y * cc.points[i].localPoint.y);
		this.m_separations[i] = (clipPointX - planePointX) * this.m_normal.x + (clipPointY - planePointY) * this.m_normal.y - cc.radius;
		this.m_points[i].x = clipPointX;
		this.m_points[i].y = clipPointY;
	}
};
/**
 * @private
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraint} cc
 */
Box2D.Dynamics.Contacts.b2PositionSolverManifold.prototype._InitializeFaceB = function(cc) {
	this.m_normal.x = cc.bodyB.m_xf.R.col1.x * cc.localPlaneNormal.x + cc.bodyB.m_xf.R.col2.x * cc.localPlaneNormal.y;
	this.m_normal.y = cc.bodyB.m_xf.R.col1.y * cc.localPlaneNormal.x + cc.bodyB.m_xf.R.col2.y * cc.localPlaneNormal.y;
	var planePointX = cc.bodyB.m_xf.position.x + (cc.bodyB.m_xf.R.col1.x * cc.localPoint.x + cc.bodyB.m_xf.R.col2.x * cc.localPoint.y);
	var planePointY = cc.bodyB.m_xf.position.y + (cc.bodyB.m_xf.R.col1.y * cc.localPoint.x + cc.bodyB.m_xf.R.col2.y * cc.localPoint.y);
	for (var i = 0; i < cc.pointCount; i++) {
		var clipPointX = cc.bodyA.m_xf.position.x + (cc.bodyA.m_xf.R.col1.x * cc.points[i].localPoint.x + cc.bodyA.m_xf.R.col2.x * cc.points[i].localPoint.y);
		var clipPointY = cc.bodyA.m_xf.position.y + (cc.bodyA.m_xf.R.col1.y * cc.points[i].localPoint.x + cc.bodyA.m_xf.R.col2.y * cc.points[i].localPoint.y);
		this.m_separations[i] = (clipPointX - planePointX) * this.m_normal.x + (clipPointY - planePointY) * this.m_normal.y - cc.radius;
		this.m_points[i].Set(clipPointX, clipPointY);
	}
	this.m_normal.x *= -1;
	this.m_normal.y *= -1;
};
/**
 * @constructor
 */
Box2D.Dynamics.Contacts.b2ContactSolver = function() {
	/**
	 * @private
	 * @type {Array.<!Box2D.Dynamics.Contacts.b2ContactConstraint>}
	 */
	this.m_constraints = [];
};
/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 * @param {Array.<!Box2D.Dynamics.Contacts.b2Contact>} contacts
 * @param {number} contactCount
 */
Box2D.Dynamics.Contacts.b2ContactSolver.prototype.Initialize = function(step, contacts, contactCount) {
	this.m_constraintCount = contactCount;
	while (this.m_constraints.length < this.m_constraintCount) {
		this.m_constraints[this.m_constraints.length] = new Box2D.Dynamics.Contacts.b2ContactConstraint();
	}
	for (var i = 0; i < contactCount; i++) {
		var contact = contacts[i];
		var fixtureA = contact.m_fixtureA;
		var fixtureB = contact.m_fixtureB;
		var shapeA = fixtureA.m_shape;
		var shapeB = fixtureB.m_shape;
		var radiusA = shapeA.m_radius;
		var radiusB = shapeB.m_radius;
		var bodyA = fixtureA.GetBody();
		var bodyB = fixtureB.GetBody();
		var manifold = contact.GetManifold();
		var friction = Box2D.Common.b2Settings.b2MixFriction(fixtureA.GetFriction(), fixtureB.GetFriction());
		var restitution = Box2D.Common.b2Settings.b2MixRestitution(fixtureA.GetRestitution(), fixtureB.GetRestitution());
		var vAX = bodyA.m_linearVelocity.x;
		var vAY = bodyA.m_linearVelocity.y;
		var vBX = bodyB.m_linearVelocity.x;
		var vBY = bodyB.m_linearVelocity.y;
		var wA = bodyA.m_angularVelocity;
		var wB = bodyB.m_angularVelocity;
;
		Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold.Initialize(manifold, bodyA.m_xf, radiusA, bodyB.m_xf, radiusB);
		var normalX = Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold.m_normal.x;
		var normalY = Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold.m_normal.y;
		var cc = this.m_constraints[i];
		cc.bodyA = bodyA;
		cc.bodyB = bodyB;
		cc.manifold = manifold;
		cc.normal.x = normalX;
		cc.normal.y = normalY;
		cc.pointCount = manifold.m_pointCount;
		cc.friction = friction;
		cc.restitution = restitution;
		cc.localPlaneNormal.x = manifold.m_localPlaneNormal.x;
		cc.localPlaneNormal.y = manifold.m_localPlaneNormal.y;
		cc.localPoint.x = manifold.m_localPoint.x;
		cc.localPoint.y = manifold.m_localPoint.y;
		cc.radius = radiusA + radiusB;
		cc.type = manifold.m_type;
		for (var k = 0; k < cc.pointCount; ++k) {
			var cp = manifold.m_points[k];
			var ccp = cc.points[k];
			ccp.normalImpulse = cp.m_normalImpulse;
			ccp.tangentImpulse = cp.m_tangentImpulse;
			ccp.localPoint.SetV(cp.m_localPoint);
			var rAX = ccp.rA.x = Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold.m_points[k].x - bodyA.m_sweep.c.x;
			var rAY = ccp.rA.y = Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold.m_points[k].y - bodyA.m_sweep.c.y;
			var rBX = ccp.rB.x = Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold.m_points[k].x - bodyB.m_sweep.c.x;
			var rBY = ccp.rB.y = Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold.m_points[k].y - bodyB.m_sweep.c.y;
			var rnA = rAX * normalY - rAY * normalX;
			var rnB = rBX * normalY - rBY * normalX;
			rnA *= rnA;
			rnB *= rnB;
			var kNormal = bodyA.m_invMass + bodyB.m_invMass + bodyA.m_invI * rnA + bodyB.m_invI * rnB;
			ccp.normalMass = 1.0 / kNormal;
			var kEqualized = bodyA.m_mass * bodyA.m_invMass + bodyB.m_mass * bodyB.m_invMass;
			kEqualized += bodyA.m_mass * bodyA.m_invI * rnA + bodyB.m_mass * bodyB.m_invI * rnB;
			ccp.equalizedMass = 1.0 / kEqualized;
			var tangentX = normalY;
			var tangentY = (-normalX);
			var rtA = rAX * tangentY - rAY * tangentX;
			var rtB = rBX * tangentY - rBY * tangentX;
			rtA *= rtA;
			rtB *= rtB;
			var kTangent = bodyA.m_invMass + bodyB.m_invMass + bodyA.m_invI * rtA + bodyB.m_invI * rtB;
			ccp.tangentMass = 1.0 / kTangent;
			ccp.velocityBias = 0.0;
			var tX = vBX + ((-wB * rBY)) - vAX - ((-wA * rAY));
			var tY = vBY + (wB * rBX) - vAY - (wA * rAX);
			var vRel = cc.normal.x * tX + cc.normal.y * tY;
			if (vRel < (-Box2D.Common.b2Settings.b2_velocityThreshold)) {
				ccp.velocityBias += (-cc.restitution * vRel);
			}
		}
		if (cc.pointCount == 2) {
			var ccp1 = cc.points[0];
			var ccp2 = cc.points[1];
			var invMassA = bodyA.m_invMass;
			var invIA = bodyA.m_invI;
			var invMassB = bodyB.m_invMass;
			var invIB = bodyB.m_invI;
			var rn1A = ccp1.rA.x * normalY - ccp1.rA.y * normalX;
			var rn1B = ccp1.rB.x * normalY - ccp1.rB.y * normalX;
			var rn2A = ccp2.rA.x * normalY - ccp2.rA.y * normalX;
			var rn2B = ccp2.rB.x * normalY - ccp2.rB.y * normalX;
			var k11 = invMassA + invMassB + invIA * rn1A * rn1A + invIB * rn1B * rn1B;
			var k22 = invMassA + invMassB + invIA * rn2A * rn2A + invIB * rn2B * rn2B;
			var k12 = invMassA + invMassB + invIA * rn1A * rn2A + invIB * rn1B * rn2B;
			var k_maxConditionNumber = 100.0;
			if (k11 * k11 < k_maxConditionNumber * (k11 * k22 - k12 * k12)) {
				cc.K.col1.Set(k11, k12);
				cc.K.col2.Set(k12, k22);
				cc.K.GetInverse(cc.normalMass);
			} else {
				cc.pointCount = 1;
			}
		}
	}
};
/**
 * @param {!Box2D.Dynamics.b2TimeStep} step
 */
Box2D.Dynamics.Contacts.b2ContactSolver.prototype.InitVelocityConstraints = function(step) {
	for (var i = 0; i < this.m_constraintCount; ++i) {
		var c = this.m_constraints[i];
		var bodyA = c.bodyA;
		var bodyB = c.bodyB;
		var invMassA = bodyA.m_invMass;
		var invIA = bodyA.m_invI;
		var invMassB = bodyB.m_invMass;
		var invIB = bodyB.m_invI;
		var normalX = c.normal.x;
		var normalY = c.normal.y;
		var tangentX = normalY;
		var tangentY = (-normalX);
		var tX = 0;
		var j = 0;
		var tCount = 0;
		if (step.warmStarting) {
			tCount = c.pointCount;
			for (j = 0; j < tCount; ++j) {
				var ccp = c.points[j];
				ccp.normalImpulse *= step.dtRatio;
				ccp.tangentImpulse *= step.dtRatio;
				var PX = ccp.normalImpulse * normalX + ccp.tangentImpulse * tangentX;
				var PY = ccp.normalImpulse * normalY + ccp.tangentImpulse * tangentY;
				bodyA.m_angularVelocity -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
				bodyA.m_linearVelocity.x -= invMassA * PX;
				bodyA.m_linearVelocity.y -= invMassA * PY;
				bodyB.m_angularVelocity += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
				bodyB.m_linearVelocity.x += invMassB * PX;
				bodyB.m_linearVelocity.y += invMassB * PY;
			}
		} else {
			tCount = c.pointCount;
			for (j = 0; j < tCount; ++j) {
				var ccp2 = c.points[j];
				ccp2.normalImpulse = 0.0;
				ccp2.tangentImpulse = 0.0;
			}
		}
	}
};
Box2D.Dynamics.Contacts.b2ContactSolver.prototype.SolveVelocityConstraints = function() {
	for (var i = 0; i < this.m_constraintCount; i++) {
		this.SolveVelocityConstraints_Constraint(this.m_constraints[i]);
	}
};
/**
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraint} c
 */
Box2D.Dynamics.Contacts.b2ContactSolver.prototype.SolveVelocityConstraints_Constraint = function(c) {
	var normalX = c.normal.x;
	var normalY = c.normal.y;
	for (var j = 0; j < c.pointCount; j++) {
		Box2D.Dynamics.Contacts.b2ContactSolver.prototype.SolveVelocityConstraints_ConstraintPoint(c, c.points[j]);
	}
	if (c.pointCount == 1) {
		var ccp = c.points[0];
		var dvX = c.bodyB.m_linearVelocity.x - (c.bodyB.m_angularVelocity * ccp.rB.y) - c.bodyA.m_linearVelocity.x + (c.bodyA.m_angularVelocity * ccp.rA.y);
		var dvY = c.bodyB.m_linearVelocity.y + (c.bodyB.m_angularVelocity * ccp.rB.x) - c.bodyA.m_linearVelocity.y - (c.bodyA.m_angularVelocity * ccp.rA.x);
		var vn = dvX * normalX + dvY * normalY;
		var newImpulse = ccp.normalImpulse - (ccp.normalMass * (vn - ccp.velocityBias));
		newImpulse = newImpulse > 0 ? newImpulse : 0.0;
		var impulseLambda = newImpulse - ccp.normalImpulse;
		var PX = impulseLambda * normalX;
		var PY = impulseLambda * normalY;
		c.bodyA.m_linearVelocity.x -= c.bodyA.m_invMass * PX;
		c.bodyA.m_linearVelocity.y -= c.bodyA.m_invMass * PY;
		c.bodyA.m_angularVelocity -= c.bodyA.m_invI * (ccp.rA.x * PY - ccp.rA.y * PX);
		c.bodyB.m_linearVelocity.x += c.bodyB.m_invMass * PX;
		c.bodyB.m_linearVelocity.y += c.bodyB.m_invMass * PY;
		c.bodyB.m_angularVelocity += c.bodyB.m_invI * (ccp.rB.x * PY - ccp.rB.y * PX);
		ccp.normalImpulse = newImpulse;
	} else {
		var cp1 = c.points[0];
		var cp2 = c.points[1];
		var aX = cp1.normalImpulse;
		var aY = cp2.normalImpulse;
		var dv1X = c.bodyB.m_linearVelocity.x - c.bodyB.m_angularVelocity * cp1.rB.y - c.bodyA.m_linearVelocity.x + c.bodyA.m_angularVelocity * cp1.rA.y;
		var dv1Y = c.bodyB.m_linearVelocity.y + c.bodyB.m_angularVelocity * cp1.rB.x - c.bodyA.m_linearVelocity.y - c.bodyA.m_angularVelocity * cp1.rA.x;
		var dv2X = c.bodyB.m_linearVelocity.x - c.bodyB.m_angularVelocity * cp2.rB.y - c.bodyA.m_linearVelocity.x + c.bodyA.m_angularVelocity * cp2.rA.y;
		var dv2Y = c.bodyB.m_linearVelocity.y + c.bodyB.m_angularVelocity * cp2.rB.x - c.bodyA.m_linearVelocity.y - c.bodyA.m_angularVelocity * cp2.rA.x;
		var bX = (dv1X * normalX + dv1Y * normalY) - cp1.velocityBias;
		var bY = (dv2X * normalX + dv2Y * normalY) - cp2.velocityBias;
		bX -= c.K.col1.x * aX + c.K.col2.x * aY;
		bY -= c.K.col1.y * aX + c.K.col2.y * aY;
		for (;;) {
			var firstX = (-(c.normalMass.col1.x * bX + c.normalMass.col2.x * bY));
			if (firstX >= 0) {
				var firstY = (-(c.normalMass.col1.y * bX + c.normalMass.col2.y * bY));
				if(firstY >= 0) {
					var dX = firstX - aX;
					var dY = firstY - aY;
					this.SolveVelocityConstraints_ConstraintPointUpdate(c, cp1, cp2, firstX - aX, firstY - aY);
					cp1.normalImpulse = firstX;
					cp2.normalImpulse = firstY;
					break;
				}
			}
			var secondX = (-cp1.normalMass * bX);
			if (secondX >= 0) {
				if ((c.K.col1.y * secondX + bY) >= 0) {
					var dX = secondX - aX;
					var dY = -aY;
					this.SolveVelocityConstraints_ConstraintPointUpdate(c, cp1, cp2, secondX - aX, -aY);
					cp1.normalImpulse = secondX;
					cp2.normalImpulse = 0;
					break;
				}
			}
			var secondY = (-cp2.normalMass * bY);
			if (secondY >= 0) {
				if ((c.K.col2.x * secondY + bX) >= 0) {
					this.SolveVelocityConstraints_ConstraintPointUpdate(c, cp1, cp2, -aX, secondY - aY);
					cp1.normalImpulse = 0;
					cp2.normalImpulse = secondY;
					break;
				}
			}
			if (bX >= 0 && bY >= 0) {
				this.SolveVelocityConstraints_ConstraintPointUpdate(c, cp1, cp2, -aX, -aY);
				cp1.normalImpulse = 0;
				cp2.normalImpulse = 0;
				break;
			}
			break;
		}
	}
};
/**
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraint} c
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraintPoint} ccp
 */
Box2D.Dynamics.Contacts.b2ContactSolver.prototype.SolveVelocityConstraints_ConstraintPoint = function(c, ccp) {
	var tangentX = c.normal.y;
	var tangentY = -c.normal.x;
	var dvX = c.bodyB.m_linearVelocity.x - c.bodyB.m_angularVelocity * ccp.rB.y - c.bodyA.m_linearVelocity.x + c.bodyA.m_angularVelocity * ccp.rA.y;
	var dvY = c.bodyB.m_linearVelocity.y + c.bodyB.m_angularVelocity * ccp.rB.x - c.bodyA.m_linearVelocity.y - c.bodyA.m_angularVelocity * ccp.rA.x;
	var vt = dvX * tangentX + dvY * tangentY;
	var maxFriction = c.friction * ccp.normalImpulse;
	var newImpulse = Box2D.Common.Math.b2Math.Clamp(ccp.tangentImpulse - ccp.tangentMass * vt, -maxFriction, maxFriction);
	var impulseLambda = newImpulse - ccp.tangentImpulse;
	var PX = impulseLambda * tangentX;
	var PY = impulseLambda * tangentY;
	c.bodyA.m_linearVelocity.x -= c.bodyA.m_invMass * PX;
	c.bodyA.m_linearVelocity.y -= c.bodyA.m_invMass * PY;
	c.bodyA.m_angularVelocity -= c.bodyA.m_invI * (ccp.rA.x * PY - ccp.rA.y * PX);
	c.bodyB.m_linearVelocity.x += c.bodyB.m_invMass * PX;
	c.bodyB.m_linearVelocity.y += c.bodyB.m_invMass * PY;
	c.bodyB.m_angularVelocity += c.bodyB.m_invI * (ccp.rB.x * PY - ccp.rB.y * PX);
	ccp.tangentImpulse = newImpulse;
};
/**
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraint} c
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraintPoint} cp1
 * @param {!Box2D.Dynamics.Contacts.b2ContactConstraintPoint} cp2
 * @param {number} dX
 * @param {number} dY
 */
Box2D.Dynamics.Contacts.b2ContactSolver.prototype.SolveVelocityConstraints_ConstraintPointUpdate = function(c, cp1, cp2, dX, dY) {
	var P1X = dX * c.normal.x;
	var P1Y = dX * c.normal.y;
	var P2X = dY * c.normal.x;
	var P2Y = dY * c.normal.y;
	c.bodyA.m_linearVelocity.x -= c.bodyA.m_invMass * (P1X + P2X);
	c.bodyA.m_linearVelocity.y -= c.bodyA.m_invMass * (P1Y + P2Y);
	c.bodyA.m_angularVelocity -= c.bodyA.m_invI * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
	c.bodyB.m_linearVelocity.x += c.bodyB.m_invMass * (P1X + P2X);
	c.bodyB.m_linearVelocity.y += c.bodyB.m_invMass * (P1Y + P2Y);
	c.bodyB.m_angularVelocity += c.bodyB.m_invI * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
	cp1.normalImpulse = 0;
	cp2.normalImpulse = 0;
};
Box2D.Dynamics.Contacts.b2ContactSolver.prototype.FinalizeVelocityConstraints = function() {
	for (var i = 0; i < this.m_constraintCount; ++i) {
		var c = this.m_constraints[i];
		var m = c.manifold;
		for (var j = 0; j < c.pointCount; ++j) {
			var point1 = m.m_points[j];
			var point2 = c.points[j];
			point1.m_normalImpulse = point2.normalImpulse;
			point1.m_tangentImpulse = point2.tangentImpulse;
		}
	}
};
Box2D.Dynamics.Contacts.b2ContactSolver.prototype.SolvePositionConstraints = function(baumgarte) {
	if (baumgarte === undefined) baumgarte = 0;
	var minSeparation = 0.0;
	for (var i = 0; i < this.m_constraintCount; i++) {
		var c = this.m_constraints[i];
		var bodyA = c.bodyA;
		var bodyB = c.bodyB;
		var invMassA = bodyA.m_mass * bodyA.m_invMass;
		var invIA = bodyA.m_mass * bodyA.m_invI;
		var invMassB = bodyB.m_mass * bodyB.m_invMass;
		var invIB = bodyB.m_mass * bodyB.m_invI;
		Box2D.Dynamics.Contacts.b2ContactSolver.s_psm.Initialize(c);
		var normal = Box2D.Dynamics.Contacts.b2ContactSolver.s_psm.m_normal;
		for (var j = 0; j < c.pointCount; j++) {
			var ccp = c.points[j];
			var point = Box2D.Dynamics.Contacts.b2ContactSolver.s_psm.m_points[j];
			var separation = Box2D.Dynamics.Contacts.b2ContactSolver.s_psm.m_separations[j];
			var rAX = point.x - bodyA.m_sweep.c.x;
			var rAY = point.y - bodyA.m_sweep.c.y;
			var rBX = point.x - bodyB.m_sweep.c.x;
			var rBY = point.y - bodyB.m_sweep.c.y;
			minSeparation = minSeparation < separation ? minSeparation : separation;
			var C = Box2D.Common.Math.b2Math.Clamp(baumgarte * (separation + Box2D.Common.b2Settings.b2_linearSlop), (-Box2D.Common.b2Settings.b2_maxLinearCorrection), 0.0);
			var impulse = (-ccp.equalizedMass * C);
			var PX = impulse * normal.x;
			var PY = impulse * normal.y;
			bodyA.m_sweep.c.x -= invMassA * PX;
			bodyA.m_sweep.c.y -= invMassA * PY;
			bodyA.m_sweep.a -= invIA * (rAX * PY - rAY * PX);
			bodyA.SynchronizeTransform();
			bodyB.m_sweep.c.x += invMassB * PX;
			bodyB.m_sweep.c.y += invMassB * PY;
			bodyB.m_sweep.a += invIB * (rBX * PY - rBY * PX);
			bodyB.SynchronizeTransform();
		}
	}
	return minSeparation > (-1.5 * Box2D.Common.b2Settings.b2_linearSlop);
};
Box2D.Dynamics.Contacts.b2ContactSolver.prototype.SolvePositionConstraints_NEW = function(baumgarte) {
	if (baumgarte === undefined) baumgarte = 0;
	var minSeparation = 0.0;
	for (var i = 0; i < this.m_constraintCount; i++) {
		var c = this.m_constraints[i];
		var bodyA = c.bodyA;
		var bodyB = c.bodyB;
		var invMassA = bodyA.m_mass * bodyA.m_invMass;
		var invIA = bodyA.m_mass * bodyA.m_invI;
		var invMassB = bodyB.m_mass * bodyB.m_invMass;
		var invIB = bodyB.m_mass * bodyB.m_invI;
		Box2D.Dynamics.Contacts.b2ContactSolver.s_psm.Initialize(c);
		var normal = Box2D.Dynamics.Contacts.b2ContactSolver.s_psm.m_normal;
		for (var j = 0; j < c.pointCount; j++) {
			var ccp = c.points[j];
			var point = Box2D.Dynamics.Contacts.b2ContactSolver.s_psm.m_points[j];
			var separation = Box2D.Dynamics.Contacts.b2ContactSolver.s_psm.m_separations[j];
			var rAX = point.x - bodyA.m_sweep.c.x;
			var rAY = point.y - bodyA.m_sweep.c.y;
			var rBX = point.x - bodyB.m_sweep.c.x;
			var rBY = point.y - bodyB.m_sweep.c.y;
			if (separation < minSeparation) {
				minSeparation = separation;
			}
			var C = 0;
			if (baumgarte != 0) {
				Box2D.Common.Math.b2Math.Clamp(baumgarte * (separation + Box2D.Common.b2Settings.b2_linearSlop), (-Box2D.Common.b2Settings.b2_maxLinearCorrection), 0.0);
			}
			var impulse = (-ccp.equalizedMass * C);
			var PX = impulse * normal.x;
			var PY = impulse * normal.y;
			bodyA.m_sweep.c.x -= invMassA * PX;
			bodyA.m_sweep.c.y -= invMassA * PY;
			bodyA.m_sweep.a -= invIA * (rAX * PY - rAY * PX);
			bodyA.SynchronizeTransform();
			bodyB.m_sweep.c.x += invMassB * PX;
			bodyB.m_sweep.c.y += invMassB * PY;
			bodyB.m_sweep.a += invIB * (rBX * PY - rBY * PX);
			bodyB.SynchronizeTransform();
		}
	}
	return minSeparation > (-1.5 * Box2D.Common.b2Settings.b2_linearSlop);
};
/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 * @constructor
 * @extends {Box2D.Dynamics.Contacts.b2Contact}
 */
Box2D.Dynamics.Contacts.b2EdgeAndCircleContact = function(fixtureA, fixtureB) {
	Box2D.Dynamics.Contacts.b2Contact.call(this, fixtureA, fixtureB);
};
c2inherit(Box2D.Dynamics.Contacts.b2EdgeAndCircleContact, Box2D.Dynamics.Contacts.b2Contact);
/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 */
Box2D.Dynamics.Contacts.b2EdgeAndCircleContact.prototype.Reset = function(fixtureA, fixtureB) {
	Box2D.Dynamics.Contacts.b2Contact.prototype.Reset.call(this, fixtureA, fixtureB);
};
Box2D.Dynamics.Contacts.b2EdgeAndCircleContact.prototype.Evaluate = function() {
	var bA = this.m_fixtureA.GetBody();
	var bB = this.m_fixtureB.GetBody();
	this.b2CollideEdgeAndCircle(this.m_manifold, this.m_fixtureA.GetShape(), this.m_fixtureA.GetBody().m_xf, this.m_fixtureB.GetShape(), this.m_fixtureB.GetBody().m_xf);
};
Box2D.Dynamics.Contacts.b2EdgeAndCircleContact.prototype.b2CollideEdgeAndCircle = function(manifold, edge, xf1, circle, xf2) {};
/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 * @constructor
 * @extends {Box2D.Dynamics.Contacts.b2Contact}
 */
Box2D.Dynamics.Contacts.b2PolyAndCircleContact = function(fixtureA, fixtureB) {
;
;
	Box2D.Dynamics.Contacts.b2Contact.call(this, fixtureA, fixtureB);
};
c2inherit(Box2D.Dynamics.Contacts.b2PolyAndCircleContact, Box2D.Dynamics.Contacts.b2Contact);
/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 */
Box2D.Dynamics.Contacts.b2PolyAndCircleContact.prototype.Reset = function(fixtureA, fixtureB) {
;
;
	Box2D.Dynamics.Contacts.b2Contact.prototype.Reset.call(this, fixtureA, fixtureB);
};
Box2D.Dynamics.Contacts.b2PolyAndCircleContact.prototype.Evaluate = function() {
	Box2D.Collision.b2Collision.CollidePolygonAndCircle(this.m_manifold, this.m_fixtureA.GetShape(), this.m_fixtureA.GetBody().m_xf, this.m_fixtureB.GetShape(), this.m_fixtureB.GetBody().m_xf);
};
/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 * @constructor
 * @extends {Box2D.Dynamics.Contacts.b2Contact}
 */
Box2D.Dynamics.Contacts.b2PolyAndEdgeContact = function(fixtureA, fixtureB) {
;
;
	Box2D.Dynamics.Contacts.b2Contact.call(this, fixtureA, fixtureB);
};
c2inherit(Box2D.Dynamics.Contacts.b2PolyAndEdgeContact, Box2D.Dynamics.Contacts.b2Contact);
/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 */
Box2D.Dynamics.Contacts.b2PolyAndEdgeContact.prototype.Reset = function(fixtureA, fixtureB) {
;
;
	Box2D.Dynamics.Contacts.b2Contact.prototype.Reset.call(this, fixtureA, fixtureB);
};
Box2D.Dynamics.Contacts.b2PolyAndEdgeContact.prototype.Evaluate = function() {
	this.b2CollidePolyAndEdge(this.m_manifold, this.m_fixtureA.GetShape(), this.m_fixtureA.GetBody().m_xf, this.m_fixtureB.GetShape(), this.m_fixtureB.GetBody().m_xf);
};
Box2D.Dynamics.Contacts.b2PolyAndEdgeContact.prototype.b2CollidePolyAndEdge = function (manifold, polygon, xf1, edge, xf2) {};
/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 * @constructor
 * @extends {Box2D.Dynamics.Contacts.b2Contact}
 */
Box2D.Dynamics.Contacts.b2PolygonContact = function(fixtureA, fixtureB) {
	Box2D.Dynamics.Contacts.b2Contact.call(this, fixtureA, fixtureB);
};
c2inherit(Box2D.Dynamics.Contacts.b2PolygonContact, Box2D.Dynamics.Contacts.b2Contact);
/**
 * @param {!Box2D.Dynamics.b2Fixture} fixtureA
 * @param {!Box2D.Dynamics.b2Fixture} fixtureB
 */
Box2D.Dynamics.Contacts.b2PolygonContact.prototype.Reset = function(fixtureA, fixtureB) {
	Box2D.Dynamics.Contacts.b2Contact.prototype.Reset.call(this, fixtureA, fixtureB);
};
Box2D.Dynamics.Contacts.b2PolygonContact.prototype.Evaluate = function() {
	Box2D.Collision.b2Collision.CollidePolygons(this.m_manifold, this.m_fixtureA.GetShape(), this.m_fixtureA.GetBody().m_xf, this.m_fixtureB.GetShape(), this.m_fixtureB.GetBody().m_xf);
};
/**
 * @constructor
 */
Box2D.Dynamics.Controllers.b2Controller = function() {
	/**
	 * @const
	 * @private
	 * @type {string}
	 */
	this.ID = "Controller" + Box2D.Dynamics.Controllers.b2Controller.NEXT_ID++;
	/**
	 * @type {Box2D.Dynamics.b2World}
	 */
	this.m_world = null;
	/**
	 * @private
	 * @type {!Box2D.Dynamics.b2BodyList}
	 */
	this.bodyList = new Box2D.Dynamics.b2BodyList();
};
Box2D.Dynamics.Controllers.b2Controller.prototype.Step = function(step) {};
/**
 * @param {!Box2D.Dynamics.b2Body} body
 */
Box2D.Dynamics.Controllers.b2Controller.prototype.AddBody = function(body) {
	this.bodyList.AddBody(body);
	body.AddController(this);
};
/**
 * @param {!Box2D.Dynamics.b2Body} body
 */
Box2D.Dynamics.Controllers.b2Controller.prototype.RemoveBody = function(body) {
	this.bodyList.RemoveBody(body);
	body.RemoveController(this);
};
Box2D.Dynamics.Controllers.b2Controller.prototype.Clear = function() {
	for (var node = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.allBodies); node; node = node.GetNextNode()) {
		this.RemoveBody(node.body);
	}
};
/**
 * @return {!Box2D.Dynamics.b2BodyList}
 */
Box2D.Dynamics.Controllers.b2Controller.prototype.GetBodyList = function() {
	return this.bodyList;
};
/**
 * @type {number}
 * @private
 */
Box2D.Dynamics.Controllers.b2Controller.NEXT_ID = 0;
/**
 * @constructor
 * @extends {Box2D.Dynamics.Controllers.b2Controller}
 */
Box2D.Dynamics.Controllers.b2BuoyancyController = function() {
	Box2D.Dynamics.Controllers.b2Controller.call(this);
	this.normal = Box2D.Common.Math.b2Vec2.Get(0, -1);
	this.offset = 0;
	this.density = 0;
	this.velocity = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.linearDrag = 2;
	this.angularDrag = 1;
	this.useDensity = false;
	this.useWorldGravity = true;
	this.gravity = null;
};
c2inherit(Box2D.Dynamics.Controllers.b2BuoyancyController, Box2D.Dynamics.Controllers.b2Controller);
Box2D.Dynamics.Controllers.b2BuoyancyController.prototype.Step = function(step) {
	if (this.useWorldGravity) {
		this.gravity = this.m_world.GetGravity().Copy();
	}
	for (var bodyNode = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.awakeBodies); bodyNode; bodyNode = bodyNode.GetNextNode()) {
		var body = bodyNode.body;
		var areac = Box2D.Common.Math.b2Vec2.Get(0, 0);
		var massc = Box2D.Common.Math.b2Vec2.Get(0, 0);
		var area = 0.0;
		var mass = 0.0;
		for (var fixtureNode = body.GetFixtureList().GetFirstNode(); fixtureNode; fixtureNode = fixtureNode.GetNextNode()) {
			var sc = Box2D.Common.Math.b2Vec2.Get(0, 0);
			var sarea = fixtureNode.fixture.GetShape().ComputeSubmergedArea(this.normal, this.offset, body.GetTransform(), sc);
			area += sarea;
			areac.x += sarea * sc.x;
			areac.y += sarea * sc.y;
			var shapeDensity = 0;
			if (this.useDensity) {
				shapeDensity = 1;
			} else {
				shapeDensity = 1;
			}
			mass += sarea * shapeDensity;
			massc.x += sarea * sc.x * shapeDensity;
			massc.y += sarea * sc.y * shapeDensity;
		}
		if (area < Number.MIN_VALUE) {
			continue;
		}
		areac.x /= area;
		areac.y /= area;
		massc.x /= mass;
		massc.y /= mass;
		var buoyancyForce = this.gravity.GetNegative();
		buoyancyForce.Multiply(this.density * area);
		body.ApplyForce(buoyancyForce, massc);
		var dragForce = body.GetLinearVelocityFromWorldPoint(areac);
		dragForce.Subtract(this.velocity);
		dragForce.Multiply((-this.linearDrag * area));
		body.ApplyForce(dragForce, areac);
		body.ApplyTorque((-body.GetInertia() / body.GetMass() * area * body.GetAngularVelocity() * this.angularDrag));
		Box2D.Common.Math.b2Vec2.Free(areac);
		Box2D.Common.Math.b2Vec2.Free(massc);
	}
};
/**
 * @constructor
 * @extends {Box2D.Dynamics.Controllers.b2Controller}
 */
Box2D.Dynamics.Controllers.b2ConstantAccelController = function() {
	Box2D.Dynamics.Controllers.b2Controller.call(this);
	this.A = Box2D.Common.Math.b2Vec2.Get(0, 0);
};
c2inherit(Box2D.Dynamics.Controllers.b2ConstantAccelController, Box2D.Dynamics.Controllers.b2Controller);
Box2D.Dynamics.Controllers.b2ConstantAccelController.prototype.Step = function(step) {
	var smallA = Box2D.Common.Math.b2Vec2.Get(this.A.x * step.dt, this.A.y * step.dt);
	for (var bodyNode = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.awakeBodies); bodyNode; bodyNode = bodyNode.GetNextNode()) {
		var body = bodyNode.body;
		var oldVelocity = body.GetLinearVelocity();
		body.SetLinearVelocity(Box2D.Common.Math.b2Vec2.Get(oldVelocity.x + smallA.x, oldVelocity.y + smallA.y));
	}
	Box2D.Common.Math.b2Vec2.Free(smallA);
};
/**
 * @constructor
 * @extends {Box2D.Dynamics.Controllers.b2Controller}
 */
Box2D.Dynamics.Controllers.b2ConstantForceController = function() {
	Box2D.Dynamics.Controllers.b2Controller.call(this);
	this.F = Box2D.Common.Math.b2Vec2.Get(0, 0);
};
c2inherit(Box2D.Dynamics.Controllers.b2ConstantForceController, Box2D.Dynamics.Controllers.b2Controller);
Box2D.Dynamics.Controllers.b2ConstantForceController.prototype.Step = function(step) {
	for (var bodyNode = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.awakeBodies); bodyNode; bodyNode = bodyNode.GetNextNode()) {
		var body = bodyNode.body;
		body.ApplyForce(this.F, body.GetWorldCenter());
	}
};
/**
 * @constructor
 */
Box2D.Dynamics.Controllers.b2ControllerList = function() {
	/**
	 * @private
	 * @type {Box2D.Dynamics.Controllers.b2ControllerListNode}
	 */
	this.controllerFirstNode = null;
	/**
	 * @private
	 * @type {Box2D.Dynamics.Controllers.b2ControllerListNode}
	 */
	this.controllerLastNode = null;
	/**
	 * @private
	 * @type {Object.<Box2D.Dynamics.Controllers.b2ControllerListNode>}
	 */
	this.controllerNodeLookup = {};
	/**
	 * @private
	 * @type {number}
	 */
	this.controllerCount = 0;
};
/**
 * @return {Box2D.Dynamics.Controllers.b2ControllerListNode}
 */
Box2D.Dynamics.Controllers.b2ControllerList.prototype.GetFirstNode = function() {
	return this.controllerFirstNode;
};
/**
 * @param {!Box2D.Dynamics.Controllers.b2Controller} controller
 */
Box2D.Dynamics.Controllers.b2ControllerList.prototype.AddController = function(controller) {
	var controllerID = controller.ID;
	if (this.controllerNodeLookup[controllerID] == null) {
		var node = new Box2D.Dynamics.Controllers.b2ControllerListNode(controller);
		var prevNode = this.controllerLastNode;
		if (prevNode != null) {
			prevNode.SetNextNode(node);
		} else {
			this.controllerFirstNode = node;
		}
		node.SetPreviousNode(prevNode);
		this.controllerLastNode = node;
		this.controllerNodeLookup[controllerID] = node;
		this.controllerCount++;
	}
};
/**
 * @param {!Box2D.Dynamics.Controllers.b2Controller} controller
 */
Box2D.Dynamics.Controllers.b2ControllerList.prototype.RemoveController = function(controller) {
	var controllerID = controller.ID;
	var node = this.controllerNodeLookup[controllerID];
	if (node == null) {
		return;
	}
	var prevNode = node.GetPreviousNode();
	var nextNode = node.GetNextNode();
	if (prevNode == null) {
		this.controllerFirstNode = nextNode;
	} else {
		prevNode.SetNextNode(nextNode);
	}
	if (nextNode == null) {
		this.controllerLastNode = prevNode;
	} else {
		nextNode.SetPreviousNode(prevNode);
	}
	delete this.controllerNodeLookup[controllerID];
	this.controllerCount--;
};
/**
 * @return {number}
 */
Box2D.Dynamics.Controllers.b2ControllerList.prototype.GetControllerCount = function() {
	return this.controllerCount;
};
/**
 * @param {!Box2D.Dynamics.Controllers.b2Controller} controller
 * @constructor
 */
Box2D.Dynamics.Controllers.b2ControllerListNode = function(controller) {
	/**
	 * @const
	 * @type {!Box2D.Dynamics.Controllers.b2Controller}
	 */
	this.controller = controller;
	/**
	 * @private
	 * @type {Box2D.Dynamics.Controllers.b2ControllerListNode}
	 */
	this.next = null;
	/**
	 * @private
	 * @type {Box2D.Dynamics.Controllers.b2ControllerListNode}
	 */
	this.previous = null;
};
/**
 * @param {Box2D.Dynamics.Controllers.b2ControllerListNode} node
 */
Box2D.Dynamics.Controllers.b2ControllerListNode.prototype.SetNextNode = function(node) {
	this.next = node;
};
/**
 * @param {Box2D.Dynamics.Controllers.b2ControllerListNode} node
 */
Box2D.Dynamics.Controllers.b2ControllerListNode.prototype.SetPreviousNode = function(node) {
	this.previous = node;
};
/**
 * @return {Box2D.Dynamics.Controllers.b2ControllerListNode}
 */
Box2D.Dynamics.Controllers.b2ControllerListNode.prototype.GetNextNode = function() {
	return this.next;
};
/**
 * @return {Box2D.Dynamics.Controllers.b2ControllerListNode}
 */
Box2D.Dynamics.Controllers.b2ControllerListNode.prototype.GetPreviousNode = function() {
	return this.previous;
};
/**
 * @constructor
 * @extends {Box2D.Dynamics.Controllers.b2Controller}
 */
Box2D.Dynamics.Controllers.b2GravityController = function() {
	Box2D.Dynamics.Controllers.b2Controller.call(this);
	this.G = 1;
	this.invSqr = true;
};
c2inherit(Box2D.Dynamics.Controllers.b2GravityController, Box2D.Dynamics.Controllers.b2Controller);
Box2D.Dynamics.Controllers.b2GravityController.prototype.Step = function(step) {
	var i = null;
	var body1 = null;
	var p1 = null;
	var mass1 = 0;
	var j = null;
	var body2 = null;
	var p2 = null;
	var dx = 0;
	var dy = 0;
	var r2 = 0;
	var f = null;
	if (this.invSqr) {
		for (var body1Node = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.allBodies); body1Node; body1Node = body1Node.GetNextNode()) {
			var body1 = body1Node.body;
			var p1 = body1.GetWorldCenter();
			var mass1 = body1.GetMass();
			for (var body2Node = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.allBodies); body2Node; body2Node = body2Node.GetNextNode()) {
				var body2 = body2Node.body;
				if ( !body1.IsAwake() && !body2.IsAwake() ) {
					continue;
				}
				var p2 = body2.GetWorldCenter();
				var dx = p2.x - p1.x;
				var dy = p2.y - p1.y;
				var r2 = dx * dx + dy * dy;
				if (r2 < Number.MIN_VALUE) {
					continue;
				}
				var f = Box2D.Common.Math.b2Vec2.Get(dx, dy);
				f.Multiply(this.G / r2 / Math.sqrt(r2) * mass1 * body2.GetMass());
				if (body1.IsAwake()) {
					body1.ApplyForce(f, p1);
				}
				f.Multiply(-1);
				if (body2.IsAwake()) {
					body2.ApplyForce(f, p2);
				}
				Box2D.Common.Math.b2Vec2.Free(f);
			}
		}
	} else {
		for (var body1Node = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.allBodies); body1Node; body1Node = body1Node.GetNextNode()) {
			var body1 = bodyNode.body;
			var p1 = body1.GetWorldCenter();
			var mass1 = body1.GetMass();
			for (var body2Node = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.allBodies); body2Node; body2Node = body2Node.GetNextNode()) {
				var body2 = bodyNode.body;
				if ( !body1.IsAwake() && !body2.IsAwake() ) {
					continue;
				}
				var p2 = body2.GetWorldCenter();
				var dx = p2.x - p1.x;
				var dy = p2.y - p1.y;
				var r2 = dx * dx + dy * dy;
				if (r2 < Number.MIN_VALUE) {
					continue;
				}
				var f = Box2D.Common.Math.b2Vec2.Get(dx, dy);
				f.Multiply(this.G / r2 * mass1 * body2.GetMass());
				if (body1.IsAwake()) {
					body1.ApplyForce(f, p1);
				}
				f.Multiply(-1);
				if (body2.IsAwake()) {
					body2.ApplyForce(f, p2);
				}
				Box2D.Common.Math.b2Vec2.Free(f);
			}
		}
	}
};
/**
 * @constructor
 * @extends {Box2D.Dynamics.Controllers.b2Controller}
 */
Box2D.Dynamics.Controllers.b2TensorDampingController = function() {
	Box2D.Dynamics.Controllers.b2Controller.call(this);
	this.T = new Box2D.Common.Math.b2Mat22();
	this.maxTimestep = 0;
};
c2inherit(Box2D.Dynamics.Controllers.b2TensorDampingController, Box2D.Dynamics.Controllers.b2Controller);
/**
 * @param {number} xDamping
 * @param {number} yDamping
 */
Box2D.Dynamics.Controllers.b2TensorDampingController.prototype.SetAxisAligned = function(xDamping, yDamping) {
	this.T.col1.x = (-xDamping);
	this.T.col1.y = 0;
	this.T.col2.x = 0;
	this.T.col2.y = (-yDamping);
	if (xDamping > 0 || yDamping > 0) {
		this.maxTimestep = 1 / Math.max(xDamping, yDamping);
	} else {
		this.maxTimestep = 0;
	}
};
Box2D.Dynamics.Controllers.b2TensorDampingController.prototype.Step = function(step) {
	var timestep = step.dt;
	if (timestep <= Number.MIN_VALUE) return;
	if (timestep > this.maxTimestep && this.maxTimestep > 0) timestep = this.maxTimestep;
	for (var bodyNode = this.bodyList.GetFirstNode(Box2D.Dynamics.b2BodyList.TYPES.awakeBodies); bodyNode; bodyNode = bodyNode.GetNextNode()) {
		var body = bodyNode.body;
		var damping = body.GetWorldVector(Box2D.Common.Math.b2Math.MulMV(this.T, body.GetLocalVector(body.GetLinearVelocity())));
		body.SetLinearVelocity(Box2D.Common.Math.b2Vec2.Get(body.GetLinearVelocity().x + damping.x * timestep, body.GetLinearVelocity().y + damping.y * timestep));
	}
};
/**
 * @param {!Box2D.Dynamics.Joints.b2JointDef} def
 * @constructor
 */
Box2D.Dynamics.Joints.b2Joint = function(def) {
	this.m_edgeA = new Box2D.Dynamics.Joints.b2JointEdge();
	this.m_edgeB = new Box2D.Dynamics.Joints.b2JointEdge();
	this.m_localCenterA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localCenterB = Box2D.Common.Math.b2Vec2.Get(0, 0);
;
	this.m_type = def.type;
	this.m_prev = null;
	this.m_next = null;
	this.m_bodyA = def.bodyA;
	this.m_bodyB = def.bodyB;
	this.m_collideConnected = def.collideConnected;
};
Box2D.Dynamics.Joints.b2Joint.prototype.GetType = function() {
	return this.m_type;
};
Box2D.Dynamics.Joints.b2Joint.prototype.GetAnchorA = function() {
	return null;
};
Box2D.Dynamics.Joints.b2Joint.prototype.GetAnchorB = function() {
	return null;
};
Box2D.Dynamics.Joints.b2Joint.prototype.GetReactionForce = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return null;
};
Box2D.Dynamics.Joints.b2Joint.prototype.GetReactionTorque = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return 0.0;
};
Box2D.Dynamics.Joints.b2Joint.prototype.GetBodyA = function() {
	return this.m_bodyA;
};
Box2D.Dynamics.Joints.b2Joint.prototype.GetBodyB = function() {
	return this.m_bodyB;
};
Box2D.Dynamics.Joints.b2Joint.prototype.GetNext = function() {
	return this.m_next;
};
Box2D.Dynamics.Joints.b2Joint.prototype.IsActive = function() {
	return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
};
Box2D.Dynamics.Joints.b2Joint.Create = function(def) {
	return def.Create();
};
Box2D.Dynamics.Joints.b2Joint.prototype.InitVelocityConstraints = function(step) {};
Box2D.Dynamics.Joints.b2Joint.prototype.SolveVelocityConstraints = function(step) {};
Box2D.Dynamics.Joints.b2Joint.prototype.FinalizeVelocityConstraints = function() {};
Box2D.Dynamics.Joints.b2Joint.prototype.SolvePositionConstraints = function(baumgarte) {
	return false;
};
Box2D.Dynamics.Joints.b2Joint.e_unknownJoint = 0;
Box2D.Dynamics.Joints.b2Joint.e_revoluteJoint = 1;
Box2D.Dynamics.Joints.b2Joint.e_prismaticJoint = 2;
Box2D.Dynamics.Joints.b2Joint.e_distanceJoint = 3;
Box2D.Dynamics.Joints.b2Joint.e_pulleyJoint = 4;
Box2D.Dynamics.Joints.b2Joint.e_mouseJoint = 5;
Box2D.Dynamics.Joints.b2Joint.e_gearJoint = 6;
Box2D.Dynamics.Joints.b2Joint.e_lineJoint = 7;
Box2D.Dynamics.Joints.b2Joint.e_weldJoint = 8;
Box2D.Dynamics.Joints.b2Joint.e_frictionJoint = 9;
Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit = 0;
Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit = 1;
Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit = 2;
Box2D.Dynamics.Joints.b2Joint.e_equalLimits = 3;
/**
 * @constructor
 */
Box2D.Dynamics.Joints.b2JointDef = function () {
	this.type = Box2D.Dynamics.Joints.b2Joint.e_unknownJoint;
	this.bodyA = null;
	this.bodyB = null;
	this.collideConnected = false;
};
/**
 * @constructor
 */
Box2D.Dynamics.Joints.b2JointEdge = function () {};
/**
 * @param {!Box2D.Dynamics.Joints.b2DistanceJointDef} def
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.Joints.b2DistanceJoint = function(def) {
	Box2D.Dynamics.Joints.b2Joint.call(this, def);
	this.m_localAnchor1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_u = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor1.SetV(def.localAnchorA);
	this.m_localAnchor2.SetV(def.localAnchorB);
	this.m_length = def.length;
	this.m_frequencyHz = def.frequencyHz;
	this.m_dampingRatio = def.dampingRatio;
	this.m_impulse = 0.0;
	this.m_gamma = 0.0;
	this.m_bias = 0.0;
};
c2inherit(Box2D.Dynamics.Joints.b2DistanceJoint, Box2D.Dynamics.Joints.b2Joint);
Box2D.Dynamics.Joints.b2DistanceJoint.prototype.GetAnchorA = function() {
	return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
};
Box2D.Dynamics.Joints.b2DistanceJoint.prototype.GetAnchorB = function() {
	return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
};
/**
 * @param {number} inv_dt
 */
Box2D.Dynamics.Joints.b2DistanceJoint.prototype.GetReactionForce = function(inv_dt) {
	return Box2D.Common.Math.b2Vec2.Get(inv_dt * this.m_impulse * this.m_u.x, inv_dt * this.m_impulse * this.m_u.y);
};
/**
 * @param {number} inv_dt
 */
Box2D.Dynamics.Joints.b2DistanceJoint.prototype.GetReactionTorque = function(inv_dt) {
	return 0.0;
};
Box2D.Dynamics.Joints.b2DistanceJoint.prototype.GetLength = function() {
	return this.m_length;
};
/**
 * @param {number} length
 */
Box2D.Dynamics.Joints.b2DistanceJoint.prototype.SetLength = function(length) {
	this.m_length = length;
};
Box2D.Dynamics.Joints.b2DistanceJoint.prototype.GetFrequency = function() {
	return this.m_frequencyHz;
};
/**
 * @param {number} hz
 */
Box2D.Dynamics.Joints.b2DistanceJoint.prototype.SetFrequency = function(hz) {
	this.m_frequencyHz = hz;
};
Box2D.Dynamics.Joints.b2DistanceJoint.prototype.GetDampingRatio = function() {
	return this.m_dampingRatio;
};
/**
 * @param {number} ratio
 */
Box2D.Dynamics.Joints.b2DistanceJoint.prototype.SetDampingRatio = function(ratio) {
	this.m_dampingRatio = ratio;
};
Box2D.Dynamics.Joints.b2DistanceJoint.prototype.InitVelocityConstraints = function(step) {
	var tMat;
	var tX = 0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	tMat = bA.m_xf.R;
	var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
	var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = bB.m_xf.R;
	var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
	var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	this.m_u.x = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
	this.m_u.y = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
	var length = Math.sqrt(this.m_u.x * this.m_u.x + this.m_u.y * this.m_u.y);
	if (length > Box2D.Common.b2Settings.b2_linearSlop) {
		this.m_u.Multiply(1.0 / length);
	} else {
		this.m_u.SetZero();
	}
	var cr1u = (r1X * this.m_u.y - r1Y * this.m_u.x);
	var cr2u = (r2X * this.m_u.y - r2Y * this.m_u.x);
	var invMass = bA.m_invMass + bA.m_invI * cr1u * cr1u + bB.m_invMass + bB.m_invI * cr2u * cr2u;
	this.m_mass = invMass != 0.0 ? 1.0 / invMass : 0.0;
	if (this.m_frequencyHz > 0.0) {
		var C = length - this.m_length;
		var omega = 2.0 * Math.PI * this.m_frequencyHz;
		var d = 2.0 * this.m_mass * this.m_dampingRatio * omega;
		var k = this.m_mass * omega * omega;
		this.m_gamma = step.dt * (d + step.dt * k);
		this.m_gamma = this.m_gamma != 0.0 ? 1 / this.m_gamma : 0.0;
		this.m_bias = C * step.dt * k * this.m_gamma;
		this.m_mass = invMass + this.m_gamma;
		this.m_mass = this.m_mass != 0.0 ? 1.0 / this.m_mass : 0.0;
	}
	if (step.warmStarting) {
		this.m_impulse *= step.dtRatio;
		var PX = this.m_impulse * this.m_u.x;
		var PY = this.m_impulse * this.m_u.y;
		bA.m_linearVelocity.x -= bA.m_invMass * PX;
		bA.m_linearVelocity.y -= bA.m_invMass * PY;
		bA.m_angularVelocity -= bA.m_invI * (r1X * PY - r1Y * PX);
		bB.m_linearVelocity.x += bB.m_invMass * PX;
		bB.m_linearVelocity.y += bB.m_invMass * PY;
		bB.m_angularVelocity += bB.m_invI * (r2X * PY - r2Y * PX);
	} else {
		this.m_impulse = 0.0;
	}
};
Box2D.Dynamics.Joints.b2DistanceJoint.prototype.SolveVelocityConstraints = function(step) {
	var r1X = this.m_localAnchor1.x - this.m_bodyA.m_sweep.localCenter.x;
	var r1Y = this.m_localAnchor1.y - this.m_bodyA.m_sweep.localCenter.y;
	var tX = (this.m_bodyA.m_xf.R.col1.x * r1X + this.m_bodyA.m_xf.R.col2.x * r1Y);
	r1Y = (this.m_bodyA.m_xf.R.col1.y * r1X + this.m_bodyA.m_xf.R.col2.y * r1Y);
	r1X = tX;
	var r2X = this.m_localAnchor2.x - this.m_bodyB.m_sweep.localCenter.x;
	var r2Y = this.m_localAnchor2.y - this.m_bodyB.m_sweep.localCenter.y;
	tX = (this.m_bodyB.m_xf.R.col1.x * r2X + this.m_bodyB.m_xf.R.col2.x * r2Y);
	r2Y = (this.m_bodyB.m_xf.R.col1.y * r2X + this.m_bodyB.m_xf.R.col2.y * r2Y);
	r2X = tX;
	var v1X = this.m_bodyA.m_linearVelocity.x - this.m_bodyA.m_angularVelocity * r1Y;
	var v1Y = this.m_bodyA.m_linearVelocity.y + this.m_bodyA.m_angularVelocity * r1X;
	var v2X = this.m_bodyB.m_linearVelocity.x - this.m_bodyB.m_angularVelocity * r2Y;
	var v2Y = this.m_bodyB.m_linearVelocity.y + this.m_bodyB.m_angularVelocity * r2X;
	var Cdot = (this.m_u.x * (v2X - v1X) + this.m_u.y * (v2Y - v1Y));
	var impulse = -this.m_mass * (Cdot + this.m_bias + this.m_gamma * this.m_impulse);
	this.m_impulse += impulse;
	var PX = impulse * this.m_u.x;
	var PY = impulse * this.m_u.y;
	this.m_bodyA.m_linearVelocity.x -= this.m_bodyA.m_invMass * PX;
	this.m_bodyA.m_linearVelocity.y -= this.m_bodyA.m_invMass * PY;
	this.m_bodyA.m_angularVelocity -= this.m_bodyA.m_invI * (r1X * PY - r1Y * PX);
	this.m_bodyB.m_linearVelocity.x += this.m_bodyB.m_invMass * PX;
	this.m_bodyB.m_linearVelocity.y += this.m_bodyB.m_invMass * PY;
	this.m_bodyB.m_angularVelocity += this.m_bodyB.m_invI * (r2X * PY - r2Y * PX);
};
/**
 * @param {number} baumgarte
 */
Box2D.Dynamics.Joints.b2DistanceJoint.prototype.SolvePositionConstraints = function(baumgarte) {
	if (this.m_frequencyHz > 0.0) {
		return true;
	}
	var r1X = this.m_localAnchor1.x - this.m_bodyA.m_sweep.localCenter.x;
	var r1Y = this.m_localAnchor1.y - this.m_bodyA.m_sweep.localCenter.y;
	var tX = (this.m_bodyA.m_xf.R.col1.x * r1X + this.m_bodyA.m_xf.R.col2.x * r1Y);
	r1Y = (this.m_bodyA.m_xf.R.col1.y * r1X + this.m_bodyA.m_xf.R.col2.y * r1Y);
	r1X = tX;
	var r2X = this.m_localAnchor2.x - this.m_bodyB.m_sweep.localCenter.x;
	var r2Y = this.m_localAnchor2.y - this.m_bodyB.m_sweep.localCenter.y;
	tX = (this.m_bodyB.m_xf.R.col1.x * r2X + this.m_bodyB.m_xf.R.col2.x * r2Y);
	r2Y = (this.m_bodyB.m_xf.R.col1.y * r2X + this.m_bodyB.m_xf.R.col2.y * r2Y);
	r2X = tX;
	var dX = this.m_bodyB.m_sweep.c.x + r2X - this.m_bodyA.m_sweep.c.x - r1X;
	var dY = this.m_bodyB.m_sweep.c.y + r2Y - this.m_bodyA.m_sweep.c.y - r1Y;
	var length = Math.sqrt(dX * dX + dY * dY);
	dX /= length;
	dY /= length;
	var C = Box2D.Common.Math.b2Math.Clamp(length - this.m_length, -Box2D.Common.b2Settings.b2_maxLinearCorrection, Box2D.Common.b2Settings.b2_maxLinearCorrection);
	var impulse = -this.m_mass * C;
	this.m_u.Set(dX, dY);
	var PX = impulse * this.m_u.x;
	var PY = impulse * this.m_u.y;
	this.m_bodyA.m_sweep.c.x -= this.m_bodyA.m_invMass * PX;
	this.m_bodyA.m_sweep.c.y -= this.m_bodyA.m_invMass * PY;
	this.m_bodyA.m_sweep.a -= this.m_bodyA.m_invI * (r1X * PY - r1Y * PX);
	this.m_bodyB.m_sweep.c.x += this.m_bodyB.m_invMass * PX;
	this.m_bodyB.m_sweep.c.y += this.m_bodyB.m_invMass * PY;
	this.m_bodyB.m_sweep.a += this.m_bodyB.m_invI * (r2X * PY - r2Y * PX);
	this.m_bodyA.SynchronizeTransform();
	this.m_bodyB.SynchronizeTransform();
	return Math.abs(C) < Box2D.Common.b2Settings.b2_linearSlop;
};
/**
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2JointDef}
 */
Box2D.Dynamics.Joints.b2DistanceJointDef = function() {
	Box2D.Dynamics.Joints.b2JointDef.call(this);
	this.localAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.type = Box2D.Dynamics.Joints.b2Joint.e_distanceJoint;
	this.length = 1.0;
	this.frequencyHz = 0.0;
	this.dampingRatio = 0.0;
};
c2inherit(Box2D.Dynamics.Joints.b2DistanceJointDef, Box2D.Dynamics.Joints.b2JointDef);
Box2D.Dynamics.Joints.b2DistanceJointDef.prototype.Initialize = function(bA, bB, anchorA, anchorB) {
	this.bodyA = bA;
	this.bodyB = bB;
	this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchorA));
	this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchorB));
	var dX = anchorB.x - anchorA.x;
	var dY = anchorB.y - anchorA.y;
	this.length = Math.sqrt(dX * dX + dY * dY);
	this.frequencyHz = 0.0;
	this.dampingRatio = 0.0;
};
Box2D.Dynamics.Joints.b2DistanceJointDef.prototype.Create = function() {
	return new Box2D.Dynamics.Joints.b2DistanceJoint(this);
};
/**
 * @param {!Box2D.Dynamics.Joints.b2FrictionJointDef} def
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.Joints.b2FrictionJoint = function(def) {
	Box2D.Dynamics.Joints.b2Joint.call(this, def);
	this.m_localAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_linearMass = new Box2D.Common.Math.b2Mat22();
	this.m_linearImpulse = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchorA.SetV(def.localAnchorA);
	this.m_localAnchorB.SetV(def.localAnchorB);
	this.m_linearMass.SetZero();
	this.m_angularMass = 0.0;
	this.m_linearImpulse.SetZero();
	this.m_angularImpulse = 0.0;
	this.m_maxForce = def.maxForce;
	this.m_maxTorque = def.maxTorque;
};
c2inherit(Box2D.Dynamics.Joints.b2FrictionJoint, Box2D.Dynamics.Joints.b2Joint);
Box2D.Dynamics.Joints.b2FrictionJoint.prototype.GetAnchorA = function() {
	return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
};
Box2D.Dynamics.Joints.b2FrictionJoint.prototype.GetAnchorB = function() {
	return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
};
Box2D.Dynamics.Joints.b2FrictionJoint.prototype.GetReactionForce = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return new b2Vec2(inv_dt * this.m_linearImpulse.x, inv_dt * this.m_linearImpulse.y);
};
Box2D.Dynamics.Joints.b2FrictionJoint.prototype.GetReactionTorque = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return inv_dt * this.m_angularImpulse;
};
Box2D.Dynamics.Joints.b2FrictionJoint.prototype.SetMaxForce = function(force) {
	if (force === undefined) force = 0;
	this.m_maxForce = force;
};
Box2D.Dynamics.Joints.b2FrictionJoint.prototype.GetMaxForce = function() {
	return this.m_maxForce;
};
Box2D.Dynamics.Joints.b2FrictionJoint.prototype.SetMaxTorque = function(torque) {
	if (torque === undefined) torque = 0;
	this.m_maxTorque = torque;
};
Box2D.Dynamics.Joints.b2FrictionJoint.prototype.GetMaxTorque = function() {
	return this.m_maxTorque;
};
Box2D.Dynamics.Joints.b2FrictionJoint.prototype.InitVelocityConstraints = function(step) {
	var tMat;
	var tX = 0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	tMat = bA.m_xf.R;
	var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
	var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
	rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
	rAX = tX;
	tMat = bB.m_xf.R;
	var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
	var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
	rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
	rBX = tX;
	var mA = bA.m_invMass;
	var mB = bB.m_invMass;
	var iA = bA.m_invI;
	var iB = bB.m_invI;
	var K = new Box2D.Common.Math.b2Mat22();
	K.col1.x = mA + mB;
	K.col2.x = 0.0;
	K.col1.y = 0.0;
	K.col2.y = mA + mB;
	K.col1.x += iA * rAY * rAY;
	K.col2.x += (-iA * rAX * rAY);
	K.col1.y += (-iA * rAX * rAY);
	K.col2.y += iA * rAX * rAX;
	K.col1.x += iB * rBY * rBY;
	K.col2.x += (-iB * rBX * rBY);
	K.col1.y += (-iB * rBX * rBY);
	K.col2.y += iB * rBX * rBX;
	K.GetInverse(this.m_linearMass);
	this.m_angularMass = iA + iB;
	if (this.m_angularMass > 0.0) {
		this.m_angularMass = 1.0 / this.m_angularMass;
	}
	if (step.warmStarting) {
		this.m_linearImpulse.x *= step.dtRatio;
		this.m_linearImpulse.y *= step.dtRatio;
		this.m_angularImpulse *= step.dtRatio;
		var P = this.m_linearImpulse;
		bA.m_linearVelocity.x -= mA * P.x;
		bA.m_linearVelocity.y -= mA * P.y;
		bA.m_angularVelocity -= iA * (rAX * P.y - rAY * P.x + this.m_angularImpulse);
		bB.m_linearVelocity.x += mB * P.x;
		bB.m_linearVelocity.y += mB * P.y;
		bB.m_angularVelocity += iB * (rBX * P.y - rBY * P.x + this.m_angularImpulse);
	} else {
		this.m_linearImpulse.SetZero();
		this.m_angularImpulse = 0.0;
	}
};
Box2D.Dynamics.Joints.b2FrictionJoint.prototype.SolveVelocityConstraints = function(step) {
	var tMat;
	var tX = 0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var vA = bA.m_linearVelocity;
	var wA = bA.m_angularVelocity;
	var vB = bB.m_linearVelocity;
	var wB = bB.m_angularVelocity;
	var mA = bA.m_invMass;
	var mB = bB.m_invMass;
	var iA = bA.m_invI;
	var iB = bB.m_invI;
	tMat = bA.m_xf.R;
	var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
	var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
	rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
	rAX = tX;
	tMat = bB.m_xf.R;
	var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
	var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
	rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
	rBX = tX;
	var maxImpulse = 0;
	var Cdot = wB - wA;
	var impulse = (-this.m_angularMass * Cdot);
	var oldImpulse = this.m_angularImpulse;
	maxImpulse = step.dt * this.m_maxTorque;
	this.m_angularImpulse = Box2D.Common.Math.b2Math.Clamp(this.m_angularImpulse + impulse, (-maxImpulse), maxImpulse);
	impulse = this.m_angularImpulse - oldImpulse;
	wA -= iA * impulse;
	wB += iB * impulse;
	var CdotX = vB.x - wB * rBY - vA.x + wA * rAY;
	var CdotY = vB.y + wB * rBX - vA.y - wA * rAX;
	var impulseV = Box2D.Common.Math.b2Math.MulMV(this.m_linearMass, Box2D.Common.Math.b2Vec2.Get((-CdotX), (-CdotY)));
	var oldImpulseV = this.m_linearImpulse.Copy();
	this.m_linearImpulse.Add(impulseV);
	maxImpulse = step.dt * this.m_maxForce;
	if (this.m_linearImpulse.LengthSquared() > maxImpulse * maxImpulse) {
		this.m_linearImpulse.Normalize();
		this.m_linearImpulse.Multiply(maxImpulse);
	}
	impulseV = Box2D.Common.Math.b2Math.SubtractVV(this.m_linearImpulse, oldImpulseV);
	vA.x -= mA * impulseV.x;
	vA.y -= mA * impulseV.y;
	wA -= iA * (rAX * impulseV.y - rAY * impulseV.x);
	vB.x += mB * impulseV.x;
	vB.y += mB * impulseV.y;
	wB += iB * (rBX * impulseV.y - rBY * impulseV.x);
	bA.m_angularVelocity = wA;
	bB.m_angularVelocity = wB;
};
Box2D.Dynamics.Joints.b2FrictionJoint.prototype.SolvePositionConstraints = function(baumgarte) {
	return true;
};
/**
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2JointDef}
 */
Box2D.Dynamics.Joints.b2FrictionJointDef = function() {
	Box2D.Dynamics.Joints.b2JointDef.call(this);
	this.localAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.type = Box2D.Dynamics.Joints.b2Joint.e_frictionJoint;
	this.maxForce = 0.0;
	this.maxTorque = 0.0;
};
c2inherit(Box2D.Dynamics.Joints.b2FrictionJointDef, Box2D.Dynamics.Joints.b2JointDef);
Box2D.Dynamics.Joints.b2FrictionJointDef.prototype.Initialize = function (bA, bB, anchor) {
	this.bodyA = bA;
	this.bodyB = bB;
	this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchor));
	this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchor));
};
Box2D.Dynamics.Joints.b2FrictionJointDef.prototype.Create = function() {
	return new Box2D.Dynamics.Joints.b2FrictionJoint(this);
};
/**
 * @param {!Box2D.Dynamics.Joints.b2GearJointDef} def
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.Joints.b2GearJoint = function(def) {
	Box2D.Dynamics.Joints.b2Joint.call(this, def);
	this.m_groundAnchor1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_groundAnchor2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_J = new Box2D.Dynamics.Joints.b2Jacobian();
	var type1 = def.joint1.m_type;
	var type2 = def.joint2.m_type;
	this.m_revolute1 = null;
	this.m_prismatic1 = null;
	this.m_revolute2 = null;
	this.m_prismatic2 = null;
	var coordinate1 = 0;
	var coordinate2 = 0;
	this.m_ground1 = def.joint1.GetBodyA();
	this.m_bodyA = def.joint1.GetBodyB();
	if (type1 == Box2D.Dynamics.Joints.b2Joint.e_revoluteJoint) {
		this.m_revolute1 = def.joint1;
		this.m_groundAnchor1.SetV(this.m_revolute1.m_localAnchor1);
		this.m_localAnchor1.SetV(this.m_revolute1.m_localAnchor2);
		coordinate1 = this.m_revolute1.GetJointAngle();
	} else {
		this.m_prismatic1 = def.joint1;
		this.m_groundAnchor1.SetV(this.m_prismatic1.m_localAnchor1);
		this.m_localAnchor1.SetV(this.m_prismatic1.m_localAnchor2);
		coordinate1 = this.m_prismatic1.GetJointTranslation();
	}
	this.m_ground2 = def.joint2.GetBodyA();
	this.m_bodyB = def.joint2.GetBodyB();
	if (type2 == Box2D.Dynamics.Joints.b2Joint.e_revoluteJoint) {
		this.m_revolute2 = def.joint2;
		this.m_groundAnchor2.SetV(this.m_revolute2.m_localAnchor1);
		this.m_localAnchor2.SetV(this.m_revolute2.m_localAnchor2);
		coordinate2 = this.m_revolute2.GetJointAngle();
	} else {
		this.m_prismatic2 = def.joint2;
		this.m_groundAnchor2.SetV(this.m_prismatic2.m_localAnchor1);
		this.m_localAnchor2.SetV(this.m_prismatic2.m_localAnchor2);
		coordinate2 = this.m_prismatic2.GetJointTranslation();
	}
	this.m_ratio = def.ratio;
	this.m_constant = coordinate1 + this.m_ratio * coordinate2;
	this.m_impulse = 0.0;
};
c2inherit(Box2D.Dynamics.Joints.b2GearJoint, Box2D.Dynamics.Joints.b2Joint);
Box2D.Dynamics.Joints.b2GearJoint.prototype.GetAnchorA = function() {
	return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
};
Box2D.Dynamics.Joints.b2GearJoint.prototype.GetAnchorB = function() {
	return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
};
Box2D.Dynamics.Joints.b2GearJoint.prototype.GetReactionForce = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return Box2D.Common.Math.b2Vec2.Get(inv_dt * this.m_impulse * this.m_J.linearB.x, inv_dt * this.m_impulse * this.m_J.linearB.y);
};
Box2D.Dynamics.Joints.b2GearJoint.prototype.GetReactionTorque = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	var tMat = this.m_bodyB.m_xf.R;
	var rX = this.m_localAnchor1.x - this.m_bodyB.m_sweep.localCenter.x;
	var rY = this.m_localAnchor1.y - this.m_bodyB.m_sweep.localCenter.y;
	var tX = tMat.col1.x * rX + tMat.col2.x * rY;
	rY = tMat.col1.y * rX + tMat.col2.y * rY;
	rX = tX;
	var PX = this.m_impulse * this.m_J.linearB.x;
	var PY = this.m_impulse * this.m_J.linearB.y;
	return inv_dt * (this.m_impulse * this.m_J.angularB - rX * PY + rY * PX);
};
Box2D.Dynamics.Joints.b2GearJoint.prototype.GetRatio = function() {
	return this.m_ratio;
};
Box2D.Dynamics.Joints.b2GearJoint.prototype.SetRatio = function(ratio) {
	if (ratio === undefined) ratio = 0;
	this.m_ratio = ratio;
};
Box2D.Dynamics.Joints.b2GearJoint.prototype.InitVelocityConstraints = function(step) {
	var g1 = this.m_ground1;
	var g2 = this.m_ground2;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var ugX = 0;
	var ugY = 0;
	var rX = 0;
	var rY = 0;
	var tMat;
	var tVec;
	var crug = 0;
	var tX = 0;
	var K = 0.0;
	this.m_J.SetZero();
	if (this.m_revolute1) {
		this.m_J.angularA = (-1.0);
		K += bA.m_invI;
	} else {
		tMat = g1.m_xf.R;
		tVec = this.m_prismatic1.m_localXAxis1;
		ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
		ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
		tMat = bA.m_xf.R;
		rX = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
		rY = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
		tX = tMat.col1.x * rX + tMat.col2.x * rY;
		rY = tMat.col1.y * rX + tMat.col2.y * rY;
		rX = tX;
		crug = rX * ugY - rY * ugX;
		this.m_J.linearA.Set((-ugX), (-ugY));
		this.m_J.angularA = (-crug);
		K += bA.m_invMass + bA.m_invI * crug * crug;
	}
	if (this.m_revolute2) {
		this.m_J.angularB = (-this.m_ratio);
		K += this.m_ratio * this.m_ratio * bB.m_invI;
	} else {
		tMat = g2.m_xf.R;
		tVec = this.m_prismatic2.m_localXAxis1;
		ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
		ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
		tMat = bB.m_xf.R;
		rX = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
		rY = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
		tX = tMat.col1.x * rX + tMat.col2.x * rY;
		rY = tMat.col1.y * rX + tMat.col2.y * rY;
		rX = tX;
		crug = rX * ugY - rY * ugX;
		this.m_J.linearB.Set((-this.m_ratio * ugX), (-this.m_ratio * ugY));
		this.m_J.angularB = (-this.m_ratio * crug);
		K += this.m_ratio * this.m_ratio * (bB.m_invMass + bB.m_invI * crug * crug);
	}
	this.m_mass = K > 0.0 ? 1.0 / K : 0.0;
	if (step.warmStarting) {
		bA.m_linearVelocity.x += bA.m_invMass * this.m_impulse * this.m_J.linearA.x;
		bA.m_linearVelocity.y += bA.m_invMass * this.m_impulse * this.m_J.linearA.y;
		bA.m_angularVelocity += bA.m_invI * this.m_impulse * this.m_J.angularA;
		bB.m_linearVelocity.x += bB.m_invMass * this.m_impulse * this.m_J.linearB.x;
		bB.m_linearVelocity.y += bB.m_invMass * this.m_impulse * this.m_J.linearB.y;
		bB.m_angularVelocity += bB.m_invI * this.m_impulse * this.m_J.angularB;
	} else {
		this.m_impulse = 0.0;
	}
};
Box2D.Dynamics.Joints.b2GearJoint.prototype.SolveVelocityConstraints = function(step) {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var Cdot = this.m_J.Compute(bA.m_linearVelocity, bA.m_angularVelocity, bB.m_linearVelocity, bB.m_angularVelocity);
	var impulse = (-this.m_mass * Cdot);
	this.m_impulse += impulse;
	bA.m_linearVelocity.x += bA.m_invMass * impulse * this.m_J.linearA.x;
	bA.m_linearVelocity.y += bA.m_invMass * impulse * this.m_J.linearA.y;
	bA.m_angularVelocity += bA.m_invI * impulse * this.m_J.angularA;
	bB.m_linearVelocity.x += bB.m_invMass * impulse * this.m_J.linearB.x;
	bB.m_linearVelocity.y += bB.m_invMass * impulse * this.m_J.linearB.y;
	bB.m_angularVelocity += bB.m_invI * impulse * this.m_J.angularB;
};
Box2D.Dynamics.Joints.b2GearJoint.prototype.SolvePositionConstraints = function(baumgarte) {
	if (baumgarte === undefined) baumgarte = 0;
	var linearError = 0.0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var coordinate1 = 0;
	var coordinate2 = 0;
	if (this.m_revolute1) {
		coordinate1 = this.m_revolute1.GetJointAngle();
	} else {
		coordinate1 = this.m_prismatic1.GetJointTranslation();
	}
	if (this.m_revolute2) {
		coordinate2 = this.m_revolute2.GetJointAngle();
	} else {
		coordinate2 = this.m_prismatic2.GetJointTranslation();
	}
	var C = this.m_constant - (coordinate1 + this.m_ratio * coordinate2);
	var impulse = (-this.m_mass * C);
	bA.m_sweep.c.x += bA.m_invMass * impulse * this.m_J.linearA.x;
	bA.m_sweep.c.y += bA.m_invMass * impulse * this.m_J.linearA.y;
	bA.m_sweep.a += bA.m_invI * impulse * this.m_J.angularA;
	bB.m_sweep.c.x += bB.m_invMass * impulse * this.m_J.linearB.x;
	bB.m_sweep.c.y += bB.m_invMass * impulse * this.m_J.linearB.y;
	bB.m_sweep.a += bB.m_invI * impulse * this.m_J.angularB;
	bA.SynchronizeTransform();
	bB.SynchronizeTransform();
	return linearError < Box2D.Common.b2Settings.b2_linearSlop;
};
/**
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2JointDef}
 */
 Box2D.Dynamics.Joints.b2GearJointDef = function() {
	Box2D.Dynamics.Joints.b2JointDef.call(this);
	this.type = Box2D.Dynamics.Joints.b2Joint.e_gearJoint;
	this.joint1 = null;
	this.joint2 = null;
	this.ratio = 1.0;
};
c2inherit(Box2D.Dynamics.Joints.b2GearJointDef, Box2D.Dynamics.Joints.b2JointDef);
Box2D.Dynamics.Joints.b2GearJointDef.prototype.Initialize = function(joint1, joint2, ratio) {
	this.joint1 = joint1;
	this.bodyA = joint1.GetBodyA();
	this.joint2 = joint2;
	this.bodyB = joint2.GetBodyA();
	this.ratio = ratio;
};
Box2D.Dynamics.Joints.b2GearJointDef.prototype.Create = function() {
	return new Box2D.Dynamics.Joints.b2GearJoint(this);
};
/**
 * @constructor
 */
Box2D.Dynamics.Joints.b2Jacobian = function() {
	this.linearA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.linearB = Box2D.Common.Math.b2Vec2.Get(0, 0);
};
Box2D.Dynamics.Joints.b2Jacobian.prototype.SetZero = function() {
	this.linearA.SetZero();
	this.angularA = 0.0;
	this.linearB.SetZero();
	this.angularB = 0.0;
};
Box2D.Dynamics.Joints.b2Jacobian.prototype.Set = function(x1, a1, x2, a2) {
	if (a1 === undefined) a1 = 0;
	if (a2 === undefined) a2 = 0;
	this.linearA.SetV(x1);
	this.angularA = a1;
	this.linearB.SetV(x2);
	this.angularB = a2;
};
Box2D.Dynamics.Joints.b2Jacobian.prototype.Compute = function(x1, a1, x2, a2) {
	if (a1 === undefined) a1 = 0;
	if (a2 === undefined) a2 = 0;
	return (this.linearA.x * x1.x + this.linearA.y * x1.y) + this.angularA * a1 + (this.linearB.x * x2.x + this.linearB.y * x2.y) + this.angularB * a2;
};
/**
 * @param {!Box2D.Dynamics.Joints.b2LineJointDef} def
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.Joints.b2LineJoint = function(def) {
	Box2D.Dynamics.Joints.b2Joint.call(this, def);
	this.m_localAnchor1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localXAxis1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localYAxis1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_axis = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_perp = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_K = new Box2D.Common.Math.b2Mat22();
	this.m_impulse = Box2D.Common.Math.b2Vec2.Get(0, 0);
	var tMat;
	var tX = 0;
	var tY = 0;
	this.m_localAnchor1.SetV(def.localAnchorA);
	this.m_localAnchor2.SetV(def.localAnchorB);
	this.m_localXAxis1.SetV(def.localAxisA);
	this.m_localYAxis1.x = (-this.m_localXAxis1.y);
	this.m_localYAxis1.y = this.m_localXAxis1.x;
	this.m_impulse.SetZero();
	this.m_motorMass = 0.0;
	this.m_motorImpulse = 0.0;
	this.m_lowerTranslation = def.lowerTranslation;
	this.m_upperTranslation = def.upperTranslation;
	this.m_maxMotorForce = def.maxMotorForce;
	this.m_motorSpeed = def.motorSpeed;
	this.m_enableLimit = def.enableLimit;
	this.m_enableMotor = def.enableMotor;
	this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
	this.m_axis.SetZero();
	this.m_perp.SetZero();
};
c2inherit(Box2D.Dynamics.Joints.b2LineJoint, Box2D.Dynamics.Joints.b2Joint);
Box2D.Dynamics.Joints.b2LineJoint.prototype.GetAnchorA = function() {
	return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.GetAnchorB = function() {
	return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.GetReactionForce = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return Box2D.Common.Math.b2Vec2.Get(inv_dt * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.x), inv_dt * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.y));
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.GetReactionTorque = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return inv_dt * this.m_impulse.y;
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.GetJointTranslation = function() {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	var p1 = bA.GetWorldPoint(this.m_localAnchor1);
	var p2 = bB.GetWorldPoint(this.m_localAnchor2);
	var dX = p2.x - p1.x;
	var dY = p2.y - p1.y;
	var axis = bA.GetWorldVector(this.m_localXAxis1);
	var translation = axis.x * dX + axis.y * dY;
	return translation;
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.GetJointSpeed = function() {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	tMat = bA.m_xf.R;
	var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
	var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
	var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = bB.m_xf.R;
	var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
	var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var p1X = bA.m_sweep.c.x + r1X;
	var p1Y = bA.m_sweep.c.y + r1Y;
	var p2X = bB.m_sweep.c.x + r2X;
	var p2Y = bB.m_sweep.c.y + r2Y;
	var dX = p2X - p1X;
	var dY = p2Y - p1Y;
	var axis = bA.GetWorldVector(this.m_localXAxis1);
	var v1 = bA.m_linearVelocity;
	var v2 = bB.m_linearVelocity;
	var w1 = bA.m_angularVelocity;
	var w2 = bB.m_angularVelocity;
	var speed = (dX * ((-w1 * axis.y)) + dY * (w1 * axis.x)) + (axis.x * (((v2.x + ((-w2 * r2Y))) - v1.x) - ((-w1 * r1Y))) + axis.y * (((v2.y + (w2 * r2X)) - v1.y) - (w1 * r1X)));
	return speed;
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.IsLimitEnabled = function() {
	return this.m_enableLimit;
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.EnableLimit = function(flag) {
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_enableLimit = flag;
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.GetLowerLimit = function() {
	return this.m_lowerTranslation;
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.GetUpperLimit = function() {
	return this.m_upperTranslation;
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.SetLimits = function(lower, upper) {
	if (lower === undefined) lower = 0;
	if (upper === undefined) upper = 0;
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_lowerTranslation = lower;
	this.m_upperTranslation = upper;
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.IsMotorEnabled = function() {
	return this.m_enableMotor;
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.EnableMotor = function(flag) {
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_enableMotor = flag;
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.SetMotorSpeed = function(speed) {
	if (speed === undefined) speed = 0;
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_motorSpeed = speed;
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.GetMotorSpeed = function() {
	return this.m_motorSpeed;
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.SetMaxMotorForce = function(force) {
	if (force === undefined) force = 0;
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_maxMotorForce = force;
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.GetMaxMotorForce = function() {
	return this.m_maxMotorForce;
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.GetMotorForce = function() {
	return this.m_motorImpulse;
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.InitVelocityConstraints = function(step) {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	var tX = 0;
	this.m_localCenterA.SetV(bA.GetLocalCenter());
	this.m_localCenterB.SetV(bB.GetLocalCenter());
	var xf1 = bA.GetTransform();
	var xf2 = bB.GetTransform();
	tMat = bA.m_xf.R;
	var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
	var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
	tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = bB.m_xf.R;
	var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
	var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
	var dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
	this.m_invMassA = bA.m_invMass;
	this.m_invMassB = bB.m_invMass;
	this.m_invIA = bA.m_invI;
	this.m_invIB = bB.m_invI;
	this.m_axis.SetV(Box2D.Common.Math.b2Math.MulMV(xf1.R, this.m_localXAxis1));
	this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
	this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
	this.m_motorMass = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_a1 * this.m_a1 + this.m_invIB * this.m_a2 * this.m_a2;
	this.m_motorMass = this.m_motorMass > Number.MIN_VALUE ? 1.0 / this.m_motorMass : 0.0;
	this.m_perp.SetV(Box2D.Common.Math.b2Math.MulMV(xf1.R, this.m_localYAxis1));
	this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
	this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
	var m1 = this.m_invMassA;
	var m2 = this.m_invMassB;
	var i1 = this.m_invIA;
	var i2 = this.m_invIB;
	this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
	this.m_K.col1.y = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
	this.m_K.col2.x = this.m_K.col1.y;
	this.m_K.col2.y = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
	if (this.m_enableLimit) {
		var jointTransition = this.m_axis.x * dX + this.m_axis.y * dY;
		if (Math.abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * Box2D.Common.b2Settings.b2_linearSlop) {
			this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_equalLimits;
		} else if (jointTransition <= this.m_lowerTranslation) {
			if (this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit) {
				this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit;
				this.m_impulse.y = 0.0;
			}
		} else if (jointTransition >= this.m_upperTranslation) {
			if (this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
				this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit;
				this.m_impulse.y = 0.0;
			}
		} else {
			this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
			this.m_impulse.y = 0.0;
		}
	} else {
		this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
	}
	if (this.m_enableMotor == false) {
		this.m_motorImpulse = 0.0;
	}
	if (step.warmStarting) {
		this.m_impulse.x *= step.dtRatio;
		this.m_impulse.y *= step.dtRatio;
		this.m_motorImpulse *= step.dtRatio;
		var PX = this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.x;
		var PY = this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.y;
		var L1 = this.m_impulse.x * this.m_s1 + (this.m_motorImpulse + this.m_impulse.y) * this.m_a1;
		var L2 = this.m_impulse.x * this.m_s2 + (this.m_motorImpulse + this.m_impulse.y) * this.m_a2;
		bA.m_linearVelocity.x -= this.m_invMassA * PX;
		bA.m_linearVelocity.y -= this.m_invMassA * PY;
		bA.m_angularVelocity -= this.m_invIA * L1;
		bB.m_linearVelocity.x += this.m_invMassB * PX;
		bB.m_linearVelocity.y += this.m_invMassB * PY;
		bB.m_angularVelocity += this.m_invIB * L2;
	} else {
		this.m_impulse.SetZero();
		this.m_motorImpulse = 0.0;
	}
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.SolveVelocityConstraints = function(step) {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var v1 = bA.m_linearVelocity;
	var w1 = bA.m_angularVelocity;
	var v2 = bB.m_linearVelocity;
	var w2 = bB.m_angularVelocity;
	var PX = 0;
	var PY = 0;
	var L1 = 0;
	var L2 = 0;
	if (this.m_enableMotor && this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_equalLimits) {
		var Cdot = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
		var impulse = this.m_motorMass * (this.m_motorSpeed - Cdot);
		var oldImpulse = this.m_motorImpulse;
		var maxImpulse = step.dt * this.m_maxMotorForce;
		this.m_motorImpulse = Box2D.Common.Math.b2Math.Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
		impulse = this.m_motorImpulse - oldImpulse;
		PX = impulse * this.m_axis.x;
		PY = impulse * this.m_axis.y;
		L1 = impulse * this.m_a1;
		L2 = impulse * this.m_a2;
		v1.x -= this.m_invMassA * PX;
		v1.y -= this.m_invMassA * PY;
		w1 -= this.m_invIA * L1;
		v2.x += this.m_invMassB * PX;
		v2.y += this.m_invMassB * PY;
		w2 += this.m_invIB * L2;
	}
	var Cdot1 = this.m_perp.x * (v2.x - v1.x) + this.m_perp.y * (v2.y - v1.y) + this.m_s2 * w2 - this.m_s1 * w1;
	if (this.m_enableLimit && this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit) {
		var Cdot2 = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
		var f1 = this.m_impulse.Copy();
		var df = this.m_K.Solve(Box2D.Common.Math.b2Vec2.Get(0, 0), (-Cdot1), (-Cdot2));
		this.m_impulse.Add(df);
		if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit) {
			this.m_impulse.y = Math.max(this.m_impulse.y, 0.0);
		} else if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
			this.m_impulse.y = Math.min(this.m_impulse.y, 0.0);
		}
		var b = (-Cdot1) - (this.m_impulse.y - f1.y) * this.m_K.col2.x;
		var f2r = 0;
		if (this.m_K.col1.x != 0.0) {
			f2r = b / this.m_K.col1.x + f1.x;
		} else {
			f2r = f1.x;
		}
		this.m_impulse.x = f2r;
		df.x = this.m_impulse.x - f1.x;
		df.y = this.m_impulse.y - f1.y;
		PX = df.x * this.m_perp.x + df.y * this.m_axis.x;
		PY = df.x * this.m_perp.y + df.y * this.m_axis.y;
		L1 = df.x * this.m_s1 + df.y * this.m_a1;
		L2 = df.x * this.m_s2 + df.y * this.m_a2;
		v1.x -= this.m_invMassA * PX;
		v1.y -= this.m_invMassA * PY;
		w1 -= this.m_invIA * L1;
		v2.x += this.m_invMassB * PX;
		v2.y += this.m_invMassB * PY;
		w2 += this.m_invIB * L2;
	} else {
		var df2 = 0;
		if (this.m_K.col1.x != 0.0) {
			df2 = ((-Cdot1)) / this.m_K.col1.x;
		} else {
			df2 = 0.0;
		}
		this.m_impulse.x += df2;
		PX = df2 * this.m_perp.x;
		PY = df2 * this.m_perp.y;
		L1 = df2 * this.m_s1;
		L2 = df2 * this.m_s2;
		v1.x -= this.m_invMassA * PX;
		v1.y -= this.m_invMassA * PY;
		w1 -= this.m_invIA * L1;
		v2.x += this.m_invMassB * PX;
		v2.y += this.m_invMassB * PY;
		w2 += this.m_invIB * L2;
	}
	bA.m_linearVelocity.SetV(v1);
	bA.m_angularVelocity = w1;
	bB.m_linearVelocity.SetV(v2);
	bB.m_angularVelocity = w2;
};
Box2D.Dynamics.Joints.b2LineJoint.prototype.SolvePositionConstraints = function(baumgarte) {
	if (baumgarte === undefined) baumgarte = 0;
	var limitC = 0;
	var oldLimitImpulse = 0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var c1 = bA.m_sweep.c;
	var a1 = bA.m_sweep.a;
	var c2 = bB.m_sweep.c;
	var a2 = bB.m_sweep.a;
	var tMat;
	var tX = 0;
	var m1 = 0;
	var m2 = 0;
	var i1 = 0;
	var i2 = 0;
	var linearError = 0.0;
	var angularError = 0.0;
	var active = false;
	var C2 = 0.0;
	var R1 = Box2D.Common.Math.b2Mat22.FromAngle(a1);
	var R2 = Box2D.Common.Math.b2Mat22.FromAngle(a2);
	tMat = R1;
	var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
	var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
	tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = R2;
	var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
	var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var dX = c2.x + r2X - c1.x - r1X;
	var dY = c2.y + r2Y - c1.y - r1Y;
	if (this.m_enableLimit) {
		this.m_axis = Box2D.Common.Math.b2Math.MulMV(R1, this.m_localXAxis1);
		this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
		this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
		var translation = this.m_axis.x * dX + this.m_axis.y * dY;
		if (Math.abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * Box2D.Common.b2Settings.b2_linearSlop) {
			C2 = Box2D.Common.Math.b2Math.Clamp(translation, (-Box2D.Common.b2Settings.b2_maxLinearCorrection), Box2D.Common.b2Settings.b2_maxLinearCorrection);
			linearError = Math.abs(translation);
			active = true;
		} else if (translation <= this.m_lowerTranslation) {
			C2 = Box2D.Common.Math.b2Math.Clamp(translation - this.m_lowerTranslation + Box2D.Common.b2Settings.b2_linearSlop, (-Box2D.Common.b2Settings.b2_maxLinearCorrection), 0.0);
			linearError = this.m_lowerTranslation - translation;
			active = true;
		} else if (translation >= this.m_upperTranslation) {
			C2 = Box2D.Common.Math.b2Math.Clamp(translation - this.m_upperTranslation + Box2D.Common.b2Settings.b2_linearSlop, 0.0, Box2D.Common.b2Settings.b2_maxLinearCorrection);
			linearError = translation - this.m_upperTranslation;
			active = true;
		}
	}
	this.m_perp = Box2D.Common.Math.b2Math.MulMV(R1, this.m_localYAxis1);
	this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
	this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
	var impulse = Box2D.Common.Math.b2Vec2.Get(0, 0);
	var C1 = this.m_perp.x * dX + this.m_perp.y * dY;
	linearError = Math.max(linearError, Math.abs(C1));
	angularError = 0.0;
	if (active) {
		m1 = this.m_invMassA;
		m2 = this.m_invMassB;
		i1 = this.m_invIA;
		i2 = this.m_invIB;
		this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
		this.m_K.col1.y = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
		this.m_K.col2.x = this.m_K.col1.y;
		this.m_K.col2.y = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
		this.m_K.Solve(impulse, (-C1), (-C2));
	} else {
		m1 = this.m_invMassA;
		m2 = this.m_invMassB;
		i1 = this.m_invIA;
		i2 = this.m_invIB;
		var k11 = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
		var impulse1 = 0;
		if (k11 != 0.0) {
			impulse1 = ((-C1)) / k11;
		} else {
			impulse1 = 0.0;
		}
		impulse.x = impulse1;
		impulse.y = 0.0;
	}
	var PX = impulse.x * this.m_perp.x + impulse.y * this.m_axis.x;
	var PY = impulse.x * this.m_perp.y + impulse.y * this.m_axis.y;
	var L1 = impulse.x * this.m_s1 + impulse.y * this.m_a1;
	var L2 = impulse.x * this.m_s2 + impulse.y * this.m_a2;
	c1.x -= this.m_invMassA * PX;
	c1.y -= this.m_invMassA * PY;
	a1 -= this.m_invIA * L1;
	c2.x += this.m_invMassB * PX;
	c2.y += this.m_invMassB * PY;
	a2 += this.m_invIB * L2;
	bA.m_sweep.a = a1;
	bB.m_sweep.a = a2;
	bA.SynchronizeTransform();
	bB.SynchronizeTransform();
	return linearError <= Box2D.Common.b2Settings.b2_linearSlop && angularError <= Box2D.Common.b2Settings.b2_angularSlop;
};
/**
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2JointDef}
 */
Box2D.Dynamics.Joints.b2LineJointDef = function() {
	Box2D.Dynamics.Joints.b2JointDef.call(this);
	this.localAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAxisA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.type = Box2D.Dynamics.Joints.b2Joint.e_lineJoint;
	this.localAxisA.Set(1.0, 0.0);
	this.enableLimit = false;
	this.lowerTranslation = 0.0;
	this.upperTranslation = 0.0;
	this.enableMotor = false;
	this.maxMotorForce = 0.0;
	this.motorSpeed = 0.0;
};
c2inherit(Box2D.Dynamics.Joints.b2LineJointDef, Box2D.Dynamics.Joints.b2JointDef);
Box2D.Dynamics.Joints.b2LineJointDef.prototype.Initialize = function(bA, bB, anchor, axis) {
	this.bodyA = bA;
	this.bodyB = bB;
	this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
	this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
	this.localAxisA = this.bodyA.GetLocalVector(axis);
};
Box2D.Dynamics.Joints.b2LineJointDef.prototype.Create = function() {
	return new Box2D.Dynamics.Joints.b2LineJoint(this);
};
/**
 * @param {!Box2D.Dynamics.Joints.b2PrismaticJointDef} def
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.Joints.b2PrismaticJoint = function(def) {
	Box2D.Dynamics.Joints.b2Joint.call(this, def);
	this.m_localAnchor1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localXAxis1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localYAxis1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_axis = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_perp = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_K = new Box2D.Common.Math.b2Mat33();
	this.m_impulse = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	this.m_localAnchor1.SetV(def.localAnchorA);
	this.m_localAnchor2.SetV(def.localAnchorB);
	this.m_localXAxis1.SetV(def.localAxisA);
	this.m_localYAxis1.x = (-this.m_localXAxis1.y);
	this.m_localYAxis1.y = this.m_localXAxis1.x;
	this.m_refAngle = def.referenceAngle;
	this.m_impulse.SetZero();
	this.m_motorMass = 0.0;
	this.m_motorImpulse = 0.0;
	this.m_lowerTranslation = def.lowerTranslation;
	this.m_upperTranslation = def.upperTranslation;
	this.m_maxMotorForce = def.maxMotorForce;
	this.m_motorSpeed = def.motorSpeed;
	this.m_enableLimit = def.enableLimit;
	this.m_enableMotor = def.enableMotor;
	this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
	this.m_axis.SetZero();
	this.m_perp.SetZero();
};
c2inherit(Box2D.Dynamics.Joints.b2PrismaticJoint, Box2D.Dynamics.Joints.b2Joint);
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetAnchorA = function() {
	return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
};
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetAnchorB = function() {
	return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
};
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetReactionForce = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return Box2D.Common.Math.b2Vec2.Get(inv_dt * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x), inv_dt * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y));
};
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetReactionTorque = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return inv_dt * this.m_impulse.y;
};
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetJointTranslation = function() {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	var p1 = bA.GetWorldPoint(this.m_localAnchor1);
	var p2 = bB.GetWorldPoint(this.m_localAnchor2);
	var dX = p2.x - p1.x;
	var dY = p2.y - p1.y;
	var axis = bA.GetWorldVector(this.m_localXAxis1);
	var translation = axis.x * dX + axis.y * dY;
	return translation;
};
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetJointSpeed = function() {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	tMat = bA.m_xf.R;
	var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
	var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
	var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = bB.m_xf.R;
	var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
	var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var p1X = bA.m_sweep.c.x + r1X;
	var p1Y = bA.m_sweep.c.y + r1Y;
	var p2X = bB.m_sweep.c.x + r2X;
	var p2Y = bB.m_sweep.c.y + r2Y;
	var dX = p2X - p1X;
	var dY = p2Y - p1Y;
	var axis = bA.GetWorldVector(this.m_localXAxis1);
	var v1 = bA.m_linearVelocity;
	var v2 = bB.m_linearVelocity;
	var w1 = bA.m_angularVelocity;
	var w2 = bB.m_angularVelocity;
	var speed = (dX * ((-w1 * axis.y)) + dY * (w1 * axis.x)) + (axis.x * (((v2.x + ((-w2 * r2Y))) - v1.x) - ((-w1 * r1Y))) + axis.y * (((v2.y + (w2 * r2X)) - v1.y) - (w1 * r1X)));
	return speed;
};
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.IsLimitEnabled = function() {
	return this.m_enableLimit;
};
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.EnableLimit = function(flag) {
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_enableLimit = flag;
};
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetLowerLimit = function() {
	return this.m_lowerTranslation;
};
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetUpperLimit = function() {
	return this.m_upperTranslation;
};
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.SetLimits = function(lower, upper) {
	if (lower === undefined) lower = 0;
	if (upper === undefined) upper = 0;
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_lowerTranslation = lower;
	this.m_upperTranslation = upper;
};
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.IsMotorEnabled = function() {
	return this.m_enableMotor;
};
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.EnableMotor = function(flag) {
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_enableMotor = flag;
};
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.SetMotorSpeed = function(speed) {
	if (speed === undefined) speed = 0;
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_motorSpeed = speed;
};
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetMotorSpeed = function() {
	return this.m_motorSpeed;
};
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.SetMaxMotorForce = function(force) {
	if (force === undefined) force = 0;
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_maxMotorForce = force;
};
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.GetMotorForce = function() {
	return this.m_motorImpulse;
};
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.InitVelocityConstraints = function(step) {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	var tX = 0;
	this.m_localCenterA.SetV(bA.GetLocalCenter());
	this.m_localCenterB.SetV(bB.GetLocalCenter());
	var xf1 = bA.GetTransform();
	var xf2 = bB.GetTransform();
	tMat = bA.m_xf.R;
	var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
	var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
	tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = bB.m_xf.R;
	var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
	var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
	var dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
	this.m_invMassA = bA.m_invMass;
	this.m_invMassB = bB.m_invMass;
	this.m_invIA = bA.m_invI;
	this.m_invIB = bB.m_invI;
	this.m_axis.SetV(Box2D.Common.Math.b2Math.MulMV(xf1.R, this.m_localXAxis1));
	this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
	this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
	this.m_motorMass = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_a1 * this.m_a1 + this.m_invIB * this.m_a2 * this.m_a2;
	if (this.m_motorMass > Number.MIN_VALUE) this.m_motorMass = 1.0 / this.m_motorMass;
	this.m_perp.SetV(Box2D.Common.Math.b2Math.MulMV(xf1.R, this.m_localYAxis1));
	this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
	this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
	var m1 = this.m_invMassA;
	var m2 = this.m_invMassB;
	var i1 = this.m_invIA;
	var i2 = this.m_invIB;
	this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
	this.m_K.col1.y = i1 * this.m_s1 + i2 * this.m_s2;
	this.m_K.col1.z = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
	this.m_K.col2.x = this.m_K.col1.y;
	this.m_K.col2.y = i1 + i2;
	this.m_K.col2.z = i1 * this.m_a1 + i2 * this.m_a2;
	this.m_K.col3.x = this.m_K.col1.z;
	this.m_K.col3.y = this.m_K.col2.z;
	this.m_K.col3.z = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
	if (this.m_enableLimit) {
		var jointTransition = this.m_axis.x * dX + this.m_axis.y * dY;
		if (Math.abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * Box2D.Common.b2Settings.b2_linearSlop) {
			this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_equalLimits;
		} else if (jointTransition <= this.m_lowerTranslation) {
			if (this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit) {
				this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit;
				this.m_impulse.z = 0.0;
			}
		} else if (jointTransition >= this.m_upperTranslation) {
			if (this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
				this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit;
				this.m_impulse.z = 0.0;
			}
		} else {
			this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
			this.m_impulse.z = 0.0;
		}
	} else {
		this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
	}
	if (this.m_enableMotor == false) {
		this.m_motorImpulse = 0.0;
	}
	if (step.warmStarting) {
		this.m_impulse.x *= step.dtRatio;
		this.m_impulse.y *= step.dtRatio;
		this.m_motorImpulse *= step.dtRatio;
		var PX = this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x;
		var PY = this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y;
		var L1 = this.m_impulse.x * this.m_s1 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a1;
		var L2 = this.m_impulse.x * this.m_s2 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a2;
		bA.m_linearVelocity.x -= this.m_invMassA * PX;
		bA.m_linearVelocity.y -= this.m_invMassA * PY;
		bA.m_angularVelocity -= this.m_invIA * L1;
		bB.m_linearVelocity.x += this.m_invMassB * PX;
		bB.m_linearVelocity.y += this.m_invMassB * PY;
		bB.m_angularVelocity += this.m_invIB * L2;
	} else {
		this.m_impulse.SetZero();
		this.m_motorImpulse = 0.0;
	}
};
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.SolveVelocityConstraints = function(step) {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var v1 = bA.m_linearVelocity;
	var w1 = bA.m_angularVelocity;
	var v2 = bB.m_linearVelocity;
	var w2 = bB.m_angularVelocity;
	var PX = 0;
	var PY = 0;
	var L1 = 0;
	var L2 = 0;
	if (this.m_enableMotor && this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_equalLimits) {
		var Cdot = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
		var impulse = this.m_motorMass * (this.m_motorSpeed - Cdot);
		var oldImpulse = this.m_motorImpulse;
		var maxImpulse = step.dt * this.m_maxMotorForce;
		this.m_motorImpulse = Box2D.Common.Math.b2Math.Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
		impulse = this.m_motorImpulse - oldImpulse;
		PX = impulse * this.m_axis.x;
		PY = impulse * this.m_axis.y;
		L1 = impulse * this.m_a1;
		L2 = impulse * this.m_a2;
		v1.x -= this.m_invMassA * PX;
		v1.y -= this.m_invMassA * PY;
		w1 -= this.m_invIA * L1;
		v2.x += this.m_invMassB * PX;
		v2.y += this.m_invMassB * PY;
		w2 += this.m_invIB * L2;
	}
	var Cdot1X = this.m_perp.x * (v2.x - v1.x) + this.m_perp.y * (v2.y - v1.y) + this.m_s2 * w2 - this.m_s1 * w1;
	var Cdot1Y = w2 - w1;
	if (this.m_enableLimit && this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit) {
		var Cdot2 = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
		var f1 = this.m_impulse.Copy();
		var df = this.m_K.Solve33(new Box2D.Common.Math.b2Vec3(0, 0, 0), (-Cdot1X), (-Cdot1Y), (-Cdot2));
		this.m_impulse.Add(df);
		if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit) {
			this.m_impulse.z = Math.max(this.m_impulse.z, 0.0);
		} else if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
			this.m_impulse.z = Math.min(this.m_impulse.z, 0.0);
		}
		var bX = (-Cdot1X) - (this.m_impulse.z - f1.z) * this.m_K.col3.x;
		var bY = (-Cdot1Y) - (this.m_impulse.z - f1.z) * this.m_K.col3.y;
		var f2r = this.m_K.Solve22(Box2D.Common.Math.b2Vec2.Get(0, 0), bX, bY);
		f2r.x += f1.x;
		f2r.y += f1.y;
		this.m_impulse.x = f2r.x;
		this.m_impulse.y = f2r.y;
		df.x = this.m_impulse.x - f1.x;
		df.y = this.m_impulse.y - f1.y;
		df.z = this.m_impulse.z - f1.z;
		PX = df.x * this.m_perp.x + df.z * this.m_axis.x;
		PY = df.x * this.m_perp.y + df.z * this.m_axis.y;
		L1 = df.x * this.m_s1 + df.y + df.z * this.m_a1;
		L2 = df.x * this.m_s2 + df.y + df.z * this.m_a2;
		v1.x -= this.m_invMassA * PX;
		v1.y -= this.m_invMassA * PY;
		w1 -= this.m_invIA * L1;
		v2.x += this.m_invMassB * PX;
		v2.y += this.m_invMassB * PY;
		w2 += this.m_invIB * L2;
	} else {
		var df2 = this.m_K.Solve22(Box2D.Common.Math.b2Vec2.Get(0, 0), (-Cdot1X), (-Cdot1Y));
		this.m_impulse.x += df2.x;
		this.m_impulse.y += df2.y;
		PX = df2.x * this.m_perp.x;
		PY = df2.x * this.m_perp.y;
		L1 = df2.x * this.m_s1 + df2.y;
		L2 = df2.x * this.m_s2 + df2.y;
		v1.x -= this.m_invMassA * PX;
		v1.y -= this.m_invMassA * PY;
		w1 -= this.m_invIA * L1;
		v2.x += this.m_invMassB * PX;
		v2.y += this.m_invMassB * PY;
		w2 += this.m_invIB * L2;
	}
	bA.m_linearVelocity.SetV(v1);
	bA.m_angularVelocity = w1;
	bB.m_linearVelocity.SetV(v2);
	bB.m_angularVelocity = w2;
};
Box2D.Dynamics.Joints.b2PrismaticJoint.prototype.SolvePositionConstraints = function(baumgarte) {
	if (baumgarte === undefined) baumgarte = 0;
	var limitC = 0;
	var oldLimitImpulse = 0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var c1 = bA.m_sweep.c;
	var a1 = bA.m_sweep.a;
	var c2 = bB.m_sweep.c;
	var a2 = bB.m_sweep.a;
	var tMat;
	var tX = 0;
	var m1 = 0;
	var m2 = 0;
	var i1 = 0;
	var i2 = 0;
	var linearError = 0.0;
	var angularError = 0.0;
	var active = false;
	var C2 = 0.0;
	var R1 = Box2D.Common.Math.b2Mat22.FromAngle(a1);
	var R2 = Box2D.Common.Math.b2Mat22.FromAngle(a2);
	tMat = R1;
	var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
	var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
	tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = R2;
	var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
	var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var dX = c2.x + r2X - c1.x - r1X;
	var dY = c2.y + r2Y - c1.y - r1Y;
	if (this.m_enableLimit) {
		this.m_axis = Box2D.Common.Math.b2Math.MulMV(R1, this.m_localXAxis1);
		this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
		this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
		var translation = this.m_axis.x * dX + this.m_axis.y * dY;
		if (Math.abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * Box2D.Common.b2Settings.b2_linearSlop) {
			C2 = Box2D.Common.Math.b2Math.Clamp(translation, (-Box2D.Common.b2Settings.b2_maxLinearCorrection), Box2D.Common.b2Settings.b2_maxLinearCorrection);
			linearError = Math.abs(translation);
			active = true;
		} else if (translation <= this.m_lowerTranslation) {
			C2 = Box2D.Common.Math.b2Math.Clamp(translation - this.m_lowerTranslation + Box2D.Common.b2Settings.b2_linearSlop, (-Box2D.Common.b2Settings.b2_maxLinearCorrection), 0.0);
			linearError = this.m_lowerTranslation - translation;
			active = true;
		} else if (translation >= this.m_upperTranslation) {
			C2 = Box2D.Common.Math.b2Math.Clamp(translation - this.m_upperTranslation + Box2D.Common.b2Settings.b2_linearSlop, 0.0, Box2D.Common.b2Settings.b2_maxLinearCorrection);
			linearError = translation - this.m_upperTranslation;
			active = true;
		}
	}
	this.m_perp = Box2D.Common.Math.b2Math.MulMV(R1, this.m_localYAxis1);
	this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
	this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
	var impulse = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	var C1X = this.m_perp.x * dX + this.m_perp.y * dY;
	var C1Y = a2 - a1 - this.m_refAngle;
	linearError = Math.max(linearError, Math.abs(C1X));
	angularError = Math.abs(C1Y);
	if (active) {
		m1 = this.m_invMassA;
		m2 = this.m_invMassB;
		i1 = this.m_invIA;
		i2 = this.m_invIB;
		this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
		this.m_K.col1.y = i1 * this.m_s1 + i2 * this.m_s2;
		this.m_K.col1.z = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
		this.m_K.col2.x = this.m_K.col1.y;
		this.m_K.col2.y = i1 + i2;
		this.m_K.col2.z = i1 * this.m_a1 + i2 * this.m_a2;
		this.m_K.col3.x = this.m_K.col1.z;
		this.m_K.col3.y = this.m_K.col2.z;
		this.m_K.col3.z = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
		this.m_K.Solve33(impulse, (-C1X), (-C1Y), (-C2));
	} else {
		m1 = this.m_invMassA;
		m2 = this.m_invMassB;
		i1 = this.m_invIA;
		i2 = this.m_invIB;
		var k11 = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
		var k12 = i1 * this.m_s1 + i2 * this.m_s2;
		var k22 = i1 + i2;
		this.m_K.col1.Set(k11, k12, 0.0);
		this.m_K.col2.Set(k12, k22, 0.0);
		var impulse1 = this.m_K.Solve22(Box2D.Common.Math.b2Vec2.Get(0, 0), (-C1X), (-C1Y));
		impulse.x = impulse1.x;
		impulse.y = impulse1.y;
		impulse.z = 0.0;
	}
	var PX = impulse.x * this.m_perp.x + impulse.z * this.m_axis.x;
	var PY = impulse.x * this.m_perp.y + impulse.z * this.m_axis.y;
	var L1 = impulse.x * this.m_s1 + impulse.y + impulse.z * this.m_a1;
	var L2 = impulse.x * this.m_s2 + impulse.y + impulse.z * this.m_a2;
	c1.x -= this.m_invMassA * PX;
	c1.y -= this.m_invMassA * PY;
	a1 -= this.m_invIA * L1;
	c2.x += this.m_invMassB * PX;
	c2.y += this.m_invMassB * PY;
	a2 += this.m_invIB * L2;
	bA.m_sweep.a = a1;
	bB.m_sweep.a = a2;
	bA.SynchronizeTransform();
	bB.SynchronizeTransform();
	return linearError <= Box2D.Common.b2Settings.b2_linearSlop && angularError <= Box2D.Common.b2Settings.b2_angularSlop;
};
/**
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2JointDef}
 */
Box2D.Dynamics.Joints.b2PrismaticJointDef = function() {
	Box2D.Dynamics.Joints.b2JointDef.call(this);
	this.localAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAxisA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.type = Box2D.Dynamics.Joints.b2Joint.e_prismaticJoint;
	this.localAxisA.Set(1.0, 0.0);
	this.referenceAngle = 0.0;
	this.enableLimit = false;
	this.lowerTranslation = 0.0;
	this.upperTranslation = 0.0;
	this.enableMotor = false;
	this.maxMotorForce = 0.0;
	this.motorSpeed = 0.0;
};
c2inherit(Box2D.Dynamics.Joints.b2PrismaticJointDef, Box2D.Dynamics.Joints.b2JointDef);
Box2D.Dynamics.Joints.b2PrismaticJointDef.prototype.Initialize = function(bA, bB, anchor, axis) {
	this.bodyA = bA;
	this.bodyB = bB;
	this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
	this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
	this.localAxisA = this.bodyA.GetLocalVector(axis);
	this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
};
Box2D.Dynamics.Joints.b2PrismaticJointDef.prototype.Create = function() {
	return new Box2D.Dynamics.Joints.b2PrismaticJoint(this);
};
/**
 * @param {!Box2D.Dynamics.Joints.b2PulleyJointDef} def
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.Joints.b2PulleyJoint = function(def) {
	Box2D.Dynamics.Joints.b2Joint.call(this, def);
	this.m_groundAnchor1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_groundAnchor2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_u1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_u2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_ground = this.m_bodyA.m_world.m_groundBody;
	this.m_groundAnchor1.x = def.groundAnchorA.x - this.m_ground.m_xf.position.x;
	this.m_groundAnchor1.y = def.groundAnchorA.y - this.m_ground.m_xf.position.y;
	this.m_groundAnchor2.x = def.groundAnchorB.x - this.m_ground.m_xf.position.x;
	this.m_groundAnchor2.y = def.groundAnchorB.y - this.m_ground.m_xf.position.y;
	this.m_localAnchor1.SetV(def.localAnchorA);
	this.m_localAnchor2.SetV(def.localAnchorB);
	this.m_ratio = def.ratio;
	this.m_constant = def.lengthA + this.m_ratio * def.lengthB;
	this.m_maxLength1 = Math.min(def.maxLengthA, this.m_constant - this.m_ratio * Box2D.Dynamics.Joints.b2PulleyJoint.b2_minPulleyLength);
	this.m_maxLength2 = Math.min(def.maxLengthB, (this.m_constant - Box2D.Dynamics.Joints.b2PulleyJoint.b2_minPulleyLength) / this.m_ratio);
	this.m_impulse = 0.0;
	this.m_limitImpulse1 = 0.0;
	this.m_limitImpulse2 = 0.0;
};
c2inherit(Box2D.Dynamics.Joints.b2PulleyJoint, Box2D.Dynamics.Joints.b2Joint);
Box2D.Dynamics.Joints.b2PulleyJoint.prototype.GetAnchorA = function() {
	return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
};
Box2D.Dynamics.Joints.b2PulleyJoint.prototype.GetAnchorB = function() {
	return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
};
Box2D.Dynamics.Joints.b2PulleyJoint.prototype.GetReactionForce = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return Box2D.Common.Math.b2Vec2.Get(inv_dt * this.m_impulse * this.m_u2.x, inv_dt * this.m_impulse * this.m_u2.y);
};
Box2D.Dynamics.Joints.b2PulleyJoint.prototype.GetReactionTorque = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return 0.0;
};
Box2D.Dynamics.Joints.b2PulleyJoint.prototype.GetGroundAnchorA = function() {
	var a = this.m_ground.m_xf.position.Copy();
	a.Add(this.m_groundAnchor1);
	return a;
};
Box2D.Dynamics.Joints.b2PulleyJoint.prototype.GetGroundAnchorB = function() {
	var a = this.m_ground.m_xf.position.Copy();
	a.Add(this.m_groundAnchor2);
	return a;
};
Box2D.Dynamics.Joints.b2PulleyJoint.prototype.GetLength1 = function() {
	var p = this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
	var sX = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
	var sY = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
	var dX = p.x - sX;
	var dY = p.y - sY;
	return Math.sqrt(dX * dX + dY * dY);
};
Box2D.Dynamics.Joints.b2PulleyJoint.prototype.GetLength2 = function() {
	var p = this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
	var sX = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
	var sY = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
	var dX = p.x - sX;
	var dY = p.y - sY;
	return Math.sqrt(dX * dX + dY * dY);
};
Box2D.Dynamics.Joints.b2PulleyJoint.prototype.GetRatio = function() {
	return this.m_ratio;
};
Box2D.Dynamics.Joints.b2PulleyJoint.prototype.InitVelocityConstraints = function(step) {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	tMat = bA.m_xf.R;
	var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
	var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
	var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = bB.m_xf.R;
	var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
	var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var p1X = bA.m_sweep.c.x + r1X;
	var p1Y = bA.m_sweep.c.y + r1Y;
	var p2X = bB.m_sweep.c.x + r2X;
	var p2Y = bB.m_sweep.c.y + r2Y;
	var s1X = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
	var s1Y = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
	var s2X = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
	var s2Y = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
	this.m_u1.Set(p1X - s1X, p1Y - s1Y);
	this.m_u2.Set(p2X - s2X, p2Y - s2Y);
	var length1 = this.m_u1.Length();
	var length2 = this.m_u2.Length();
	if (length1 > Box2D.Common.b2Settings.b2_linearSlop) {
		this.m_u1.Multiply(1.0 / length1);
	} else {
		this.m_u1.SetZero();
	}
	if (length2 > Box2D.Common.b2Settings.b2_linearSlop) {
		this.m_u2.Multiply(1.0 / length2);
	} else {
		this.m_u2.SetZero();
	}
	var C = this.m_constant - length1 - this.m_ratio * length2;
	if (C > 0.0) {
		this.m_state = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
		this.m_impulse = 0.0;
	} else {
		this.m_state = Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit;
	}
	if (length1 < this.m_maxLength1) {
		this.m_limitState1 = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
		this.m_limitImpulse1 = 0.0;
	} else {
		this.m_limitState1 = Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit;
	}
	if (length2 < this.m_maxLength2) {
		this.m_limitState2 = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
		this.m_limitImpulse2 = 0.0;
	} else {
		this.m_limitState2 = Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit;
	}
	var cr1u1 = r1X * this.m_u1.y - r1Y * this.m_u1.x;
	var cr2u2 = r2X * this.m_u2.y - r2Y * this.m_u2.x;
	this.m_limitMass1 = bA.m_invMass + bA.m_invI * cr1u1 * cr1u1;
	this.m_limitMass2 = bB.m_invMass + bB.m_invI * cr2u2 * cr2u2;
	this.m_pulleyMass = this.m_limitMass1 + this.m_ratio * this.m_ratio * this.m_limitMass2;
	this.m_limitMass1 = 1.0 / this.m_limitMass1;
	this.m_limitMass2 = 1.0 / this.m_limitMass2;
	this.m_pulleyMass = 1.0 / this.m_pulleyMass;
	if (step.warmStarting) {
		this.m_impulse *= step.dtRatio;
		this.m_limitImpulse1 *= step.dtRatio;
		this.m_limitImpulse2 *= step.dtRatio;
		var P1X = ((-this.m_impulse) - this.m_limitImpulse1) * this.m_u1.x;
		var P1Y = ((-this.m_impulse) - this.m_limitImpulse1) * this.m_u1.y;
		var P2X = ((-this.m_ratio * this.m_impulse) - this.m_limitImpulse2) * this.m_u2.x;
		var P2Y = ((-this.m_ratio * this.m_impulse) - this.m_limitImpulse2) * this.m_u2.y;
		bA.m_linearVelocity.x += bA.m_invMass * P1X;
		bA.m_linearVelocity.y += bA.m_invMass * P1Y;
		bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
		bB.m_linearVelocity.x += bB.m_invMass * P2X;
		bB.m_linearVelocity.y += bB.m_invMass * P2Y;
		bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
	} else {
		this.m_impulse = 0.0;
		this.m_limitImpulse1 = 0.0;
		this.m_limitImpulse2 = 0.0;
	}
};
Box2D.Dynamics.Joints.b2PulleyJoint.prototype.SolveVelocityConstraints = function(step) {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	tMat = bA.m_xf.R;
	var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
	var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
	var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = bB.m_xf.R;
	var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
	var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var v1X = 0;
	var v1Y = 0;
	var v2X = 0;
	var v2Y = 0;
	var P1X = 0;
	var P1Y = 0;
	var P2X = 0;
	var P2Y = 0;
	var Cdot = 0;
	var impulse = 0;
	var oldImpulse = 0;
	if (this.m_state == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
		v1X = bA.m_linearVelocity.x + ((-bA.m_angularVelocity * r1Y));
		v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X);
		v2X = bB.m_linearVelocity.x + ((-bB.m_angularVelocity * r2Y));
		v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X);
		Cdot = (-(this.m_u1.x * v1X + this.m_u1.y * v1Y)) - this.m_ratio * (this.m_u2.x * v2X + this.m_u2.y * v2Y);
		impulse = this.m_pulleyMass * ((-Cdot));
		oldImpulse = this.m_impulse;
		this.m_impulse = Math.max(0.0, this.m_impulse + impulse);
		impulse = this.m_impulse - oldImpulse;
		P1X = (-impulse * this.m_u1.x);
		P1Y = (-impulse * this.m_u1.y);
		P2X = (-this.m_ratio * impulse * this.m_u2.x);
		P2Y = (-this.m_ratio * impulse * this.m_u2.y);
		bA.m_linearVelocity.x += bA.m_invMass * P1X;
		bA.m_linearVelocity.y += bA.m_invMass * P1Y;
		bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
		bB.m_linearVelocity.x += bB.m_invMass * P2X;
		bB.m_linearVelocity.y += bB.m_invMass * P2Y;
		bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
	}
	if (this.m_limitState1 == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
		v1X = bA.m_linearVelocity.x + ((-bA.m_angularVelocity * r1Y));
		v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X);
		Cdot = (-(this.m_u1.x * v1X + this.m_u1.y * v1Y));
		impulse = (-this.m_limitMass1 * Cdot);
		oldImpulse = this.m_limitImpulse1;
		this.m_limitImpulse1 = Math.max(0.0, this.m_limitImpulse1 + impulse);
		impulse = this.m_limitImpulse1 - oldImpulse;
		P1X = (-impulse * this.m_u1.x);
		P1Y = (-impulse * this.m_u1.y);
		bA.m_linearVelocity.x += bA.m_invMass * P1X;
		bA.m_linearVelocity.y += bA.m_invMass * P1Y;
		bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
	}
	if (this.m_limitState2 == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
		v2X = bB.m_linearVelocity.x + ((-bB.m_angularVelocity * r2Y));
		v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X);
		Cdot = (-(this.m_u2.x * v2X + this.m_u2.y * v2Y));
		impulse = (-this.m_limitMass2 * Cdot);
		oldImpulse = this.m_limitImpulse2;
		this.m_limitImpulse2 = Math.max(0.0, this.m_limitImpulse2 + impulse);
		impulse = this.m_limitImpulse2 - oldImpulse;
		P2X = (-impulse * this.m_u2.x);
		P2Y = (-impulse * this.m_u2.y);
		bB.m_linearVelocity.x += bB.m_invMass * P2X;
		bB.m_linearVelocity.y += bB.m_invMass * P2Y;
		bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
	}
};
Box2D.Dynamics.Joints.b2PulleyJoint.prototype.SolvePositionConstraints = function(baumgarte) {
	if (baumgarte === undefined) baumgarte = 0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	var s1X = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
	var s1Y = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
	var s2X = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
	var s2Y = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
	var r1X = 0;
	var r1Y = 0;
	var r2X = 0;
	var r2Y = 0;
	var p1X = 0;
	var p1Y = 0;
	var p2X = 0;
	var p2Y = 0;
	var length1 = 0;
	var length2 = 0;
	var C = 0;
	var impulse = 0;
	var oldImpulse = 0;
	var oldLimitPositionImpulse = 0;
	var tX = 0;
	var linearError = 0.0;
	if (this.m_state == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
		tMat = bA.m_xf.R;
		r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
		r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
		r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
		r1X = tX;
		tMat = bB.m_xf.R;
		r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
		r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
		r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
		r2X = tX;
		p1X = bA.m_sweep.c.x + r1X;
		p1Y = bA.m_sweep.c.y + r1Y;
		p2X = bB.m_sweep.c.x + r2X;
		p2Y = bB.m_sweep.c.y + r2Y;
		this.m_u1.Set(p1X - s1X, p1Y - s1Y);
		this.m_u2.Set(p2X - s2X, p2Y - s2Y);
		length1 = this.m_u1.Length();
		length2 = this.m_u2.Length();
		if (length1 > Box2D.Common.b2Settings.b2_linearSlop) {
			this.m_u1.Multiply(1.0 / length1);
		} else {
			this.m_u1.SetZero();
		}
		if (length2 > Box2D.Common.b2Settings.b2_linearSlop) {
			this.m_u2.Multiply(1.0 / length2);
		} else {
			this.m_u2.SetZero();
		}
		C = this.m_constant - length1 - this.m_ratio * length2;
		linearError = Math.max(linearError, (-C));
		C = Box2D.Common.Math.b2Math.Clamp(C + Box2D.Common.b2Settings.b2_linearSlop, (-Box2D.Common.b2Settings.b2_maxLinearCorrection), 0.0);
		impulse = (-this.m_pulleyMass * C);
		p1X = (-impulse * this.m_u1.x);
		p1Y = (-impulse * this.m_u1.y);
		p2X = (-this.m_ratio * impulse * this.m_u2.x);
		p2Y = (-this.m_ratio * impulse * this.m_u2.y);
		bA.m_sweep.c.x += bA.m_invMass * p1X;
		bA.m_sweep.c.y += bA.m_invMass * p1Y;
		bA.m_sweep.a += bA.m_invI * (r1X * p1Y - r1Y * p1X);
		bB.m_sweep.c.x += bB.m_invMass * p2X;
		bB.m_sweep.c.y += bB.m_invMass * p2Y;
		bB.m_sweep.a += bB.m_invI * (r2X * p2Y - r2Y * p2X);
		bA.SynchronizeTransform();
		bB.SynchronizeTransform();
	}
	if (this.m_limitState1 == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
		tMat = bA.m_xf.R;
		r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
		r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
		r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
		r1X = tX;
		p1X = bA.m_sweep.c.x + r1X;
		p1Y = bA.m_sweep.c.y + r1Y;
		this.m_u1.Set(p1X - s1X, p1Y - s1Y);
		length1 = this.m_u1.Length();
		if (length1 > Box2D.Common.b2Settings.b2_linearSlop) {
			this.m_u1.x *= 1.0 / length1;
			this.m_u1.y *= 1.0 / length1;
		} else {
			this.m_u1.SetZero();
		}
		C = this.m_maxLength1 - length1;
		linearError = Math.max(linearError, (-C));
		C = Box2D.Common.Math.b2Math.Clamp(C + Box2D.Common.b2Settings.b2_linearSlop, (-Box2D.Common.b2Settings.b2_maxLinearCorrection), 0.0);
		impulse = (-this.m_limitMass1 * C);
		p1X = (-impulse * this.m_u1.x);
		p1Y = (-impulse * this.m_u1.y);
		bA.m_sweep.c.x += bA.m_invMass * p1X;
		bA.m_sweep.c.y += bA.m_invMass * p1Y;
		bA.m_sweep.a += bA.m_invI * (r1X * p1Y - r1Y * p1X);
		bA.SynchronizeTransform();
	}
	if (this.m_limitState2 == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
		tMat = bB.m_xf.R;
		r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
		r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
		r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
		r2X = tX;
		p2X = bB.m_sweep.c.x + r2X;
		p2Y = bB.m_sweep.c.y + r2Y;
		this.m_u2.Set(p2X - s2X, p2Y - s2Y);
		length2 = this.m_u2.Length();
		if (length2 > Box2D.Common.b2Settings.b2_linearSlop) {
			this.m_u2.x *= 1.0 / length2;
			this.m_u2.y *= 1.0 / length2;
		}
		else {
			this.m_u2.SetZero();
		}
		C = this.m_maxLength2 - length2;
		linearError = Math.max(linearError, (-C));
		C = Box2D.Common.Math.b2Math.Clamp(C + Box2D.Common.b2Settings.b2_linearSlop, (-Box2D.Common.b2Settings.b2_maxLinearCorrection), 0.0);
		impulse = (-this.m_limitMass2 * C);
		p2X = (-impulse * this.m_u2.x);
		p2Y = (-impulse * this.m_u2.y);
		bB.m_sweep.c.x += bB.m_invMass * p2X;
		bB.m_sweep.c.y += bB.m_invMass * p2Y;
		bB.m_sweep.a += bB.m_invI * (r2X * p2Y - r2Y * p2X);
		bB.SynchronizeTransform();
	}
	return linearError < Box2D.Common.b2Settings.b2_linearSlop;
};
Box2D.Dynamics.Joints.b2PulleyJoint.b2_minPulleyLength = 1.0;
/**
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2JointDef}
 */
Box2D.Dynamics.Joints.b2PulleyJointDef = function() {
	Box2D.Dynamics.Joints.b2JointDef.call(this);
	this.groundAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.groundAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.type = Box2D.Dynamics.Joints.b2Joint.e_pulleyJoint;
	this.groundAnchorA.Set((-1.0), 1.0);
	this.groundAnchorB.Set(1.0, 1.0);
	this.localAnchorA.Set((-1.0), 0.0);
	this.localAnchorB.Set(1.0, 0.0);
	this.lengthA = 0.0;
	this.maxLengthA = 0.0;
	this.lengthB = 0.0;
	this.maxLengthB = 0.0;
	this.ratio = 1.0;
	this.collideConnected = true;
};
c2inherit(Box2D.Dynamics.Joints.b2PulleyJointDef, Box2D.Dynamics.Joints.b2JointDef);
Box2D.Dynamics.Joints.b2PulleyJointDef.prototype.Initialize = function(bA, bB, gaA, gaB, anchorA, anchorB, r) {
	if (r === undefined) r = 0;
	this.bodyA = bA;
	this.bodyB = bB;
	this.groundAnchorA.SetV(gaA);
	this.groundAnchorB.SetV(gaB);
	this.localAnchorA = this.bodyA.GetLocalPoint(anchorA);
	this.localAnchorB = this.bodyB.GetLocalPoint(anchorB);
	var d1X = anchorA.x - gaA.x;
	var d1Y = anchorA.y - gaA.y;
	this.lengthA = Math.sqrt(d1X * d1X + d1Y * d1Y);
	var d2X = anchorB.x - gaB.x;
	var d2Y = anchorB.y - gaB.y;
	this.lengthB = Math.sqrt(d2X * d2X + d2Y * d2Y);
	this.ratio = r;
	var C = this.lengthA + this.ratio * this.lengthB;
	this.maxLengthA = C - this.ratio * Box2D.Dynamics.Joints.b2PulleyJoint.b2_minPulleyLength;
	this.maxLengthB = (C - Box2D.Dynamics.Joints.b2PulleyJoint.b2_minPulleyLength) / this.ratio;
};
Box2D.Dynamics.Joints.b2PulleyJointDef.prototype.Create = function() {
	return new Box2D.Dynamics.Joints.b2PulleyJoint(this);
};
/**
 * @param {!Box2D.Dynamics.Joints.b2RevoluteJointDef} def
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.Joints.b2RevoluteJoint = function(def) {
	Box2D.Dynamics.Joints.b2Joint.call(this, def);
	this.K = new Box2D.Common.Math.b2Mat22();
	this.K1 = new Box2D.Common.Math.b2Mat22();
	this.K2 = new Box2D.Common.Math.b2Mat22();
	this.K3 = new Box2D.Common.Math.b2Mat22();
	this.impulse3 = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	this.impulse2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.reduced = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor1 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchor2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_impulse = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	this.m_mass = new Box2D.Common.Math.b2Mat33();
	this.m_localAnchor1.SetV(def.localAnchorA);
	this.m_localAnchor2.SetV(def.localAnchorB);
	this.m_referenceAngle = def.referenceAngle;
	this.m_impulse.SetZero();
	this.m_motorImpulse = 0.0;
	this.m_lowerAngle = def.lowerAngle;
	this.m_upperAngle = def.upperAngle;
	this.m_maxMotorTorque = def.maxMotorTorque;
	this.m_motorSpeed = def.motorSpeed;
	this.m_enableLimit = def.enableLimit;
	this.m_enableMotor = def.enableMotor;
	this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
};
c2inherit(Box2D.Dynamics.Joints.b2RevoluteJoint, Box2D.Dynamics.Joints.b2Joint);
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetAnchorA = function() {
	return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
};
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetAnchorB = function() {
	return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
};
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetReactionForce = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return Box2D.Common.Math.b2Vec2.Get(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
};
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetReactionTorque = function(inv_dt) {
	if (inv_dt === undefined) inv_dt = 0;
	return inv_dt * this.m_impulse.z;
};
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetJointAngle = function() {
	return this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a - this.m_referenceAngle;
};
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetJointSpeed = function() {
	return this.m_bodyB.m_angularVelocity - this.m_bodyA.m_angularVelocity;
};
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.IsLimitEnabled = function() {
	return this.m_enableLimit;
};
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.EnableLimit = function(flag) {
	this.m_enableLimit = flag;
};
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetLowerLimit = function() {
	return this.m_lowerAngle;
};
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetUpperLimit = function() {
	return this.m_upperAngle;
};
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.SetLimits = function(lower, upper) {
	if (lower === undefined) lower = 0;
	if (upper === undefined) upper = 0;
	this.m_lowerAngle = lower;
	this.m_upperAngle = upper;
};
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.IsMotorEnabled = function() {
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	return this.m_enableMotor;
};
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.EnableMotor = function(flag) {
	this.m_enableMotor = flag;
};
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.SetMotorSpeed = function(speed) {
	if (speed === undefined) speed = 0;
	this.m_bodyA.SetAwake(true);
	this.m_bodyB.SetAwake(true);
	this.m_motorSpeed = speed;
};
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetMotorSpeed = function() {
	return this.m_motorSpeed;
};
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.SetMaxMotorTorque = function(torque) {
	if (torque === undefined) torque = 0;
	this.m_maxMotorTorque = torque;
};
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.GetMotorTorque = function() {
	return this.m_maxMotorTorque;
};
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.InitVelocityConstraints = function(step) {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	var tX = 0;
	tMat = bA.m_xf.R;
	var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
	var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = bB.m_xf.R;
	var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
	var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var m1 = bA.m_invMass;
	var m2 = bB.m_invMass;
	var i1 = bA.m_invI;
	var i2 = bB.m_invI;
	this.m_mass.col1.x = m1 + m2 + r1Y * r1Y * i1 + r2Y * r2Y * i2;
	this.m_mass.col2.x = (-r1Y * r1X * i1) - r2Y * r2X * i2;
	this.m_mass.col3.x = (-r1Y * i1) - r2Y * i2;
	this.m_mass.col1.y = this.m_mass.col2.x;
	this.m_mass.col2.y = m1 + m2 + r1X * r1X * i1 + r2X * r2X * i2;
	this.m_mass.col3.y = r1X * i1 + r2X * i2;
	this.m_mass.col1.z = this.m_mass.col3.x;
	this.m_mass.col2.z = this.m_mass.col3.y;
	this.m_mass.col3.z = i1 + i2;
	this.m_motorMass = 1.0 / (i1 + i2);
	if (!this.m_enableMotor) {
		this.m_motorImpulse = 0.0;
	}
	if (this.m_enableLimit) {
		var jointAngle = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
		if (Math.abs(this.m_upperAngle - this.m_lowerAngle) < 2.0 * Box2D.Common.b2Settings.b2_angularSlop) {
			this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_equalLimits;
		} else if (jointAngle <= this.m_lowerAngle) {
			if (this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit) {
				this.m_impulse.z = 0.0;
			}
			this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit;
		} else if (jointAngle >= this.m_upperAngle) {
			if (this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
				this.m_impulse.z = 0.0;
			}
			this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit;
		} else {
			this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
			this.m_impulse.z = 0.0;
		}
	} else {
		this.m_limitState = Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit;
	}
	if (step.warmStarting) {
		this.m_impulse.x *= step.dtRatio;
		this.m_impulse.y *= step.dtRatio;
		this.m_motorImpulse *= step.dtRatio;
		var PX = this.m_impulse.x;
		var PY = this.m_impulse.y;
		bA.m_linearVelocity.x -= m1 * PX;
		bA.m_linearVelocity.y -= m1 * PY;
		bA.m_angularVelocity -= i1 * ((r1X * PY - r1Y * PX) + this.m_motorImpulse + this.m_impulse.z);
		bB.m_linearVelocity.x += m2 * PX;
		bB.m_linearVelocity.y += m2 * PY;
		bB.m_angularVelocity += i2 * ((r2X * PY - r2Y * PX) + this.m_motorImpulse + this.m_impulse.z);
	} else {
		this.m_impulse.SetZero();
		this.m_motorImpulse = 0.0;
	}
};
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.SolveVelocityConstraints = function(step) {
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var tMat;
	var tX = 0;
	var newImpulse = 0;
	var r1X = 0;
	var r1Y = 0;
	var r2X = 0;
	var r2Y = 0;
	var v1 = bA.m_linearVelocity;
	var w1 = bA.m_angularVelocity;
	var v2 = bB.m_linearVelocity;
	var w2 = bB.m_angularVelocity;
	var m1 = bA.m_invMass;
	var m2 = bB.m_invMass;
	var i1 = bA.m_invI;
	var i2 = bB.m_invI;
	if (this.m_enableMotor && this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_equalLimits) {
		var Cdot = w2 - w1 - this.m_motorSpeed;
		var impulse = this.m_motorMass * ((-Cdot));
		var oldImpulse = this.m_motorImpulse;
		var maxImpulse = step.dt * this.m_maxMotorTorque;
		this.m_motorImpulse = Box2D.Common.Math.b2Math.Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
		impulse = this.m_motorImpulse - oldImpulse;
		w1 -= i1 * impulse;
		w2 += i2 * impulse;
	}
	if (this.m_enableLimit && this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit) {
		tMat = bA.m_xf.R;
		r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
		r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
		r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
		r1X = tX;
		tMat = bB.m_xf.R;
		r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
		r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
		r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
		r2X = tX;
		var Cdot1X = v2.x + ((-w2 * r2Y)) - v1.x - ((-w1 * r1Y));
		var Cdot1Y = v2.y + (w2 * r2X) - v1.y - (w1 * r1X);
		var Cdot2 = w2 - w1;
		this.m_mass.Solve33(this.impulse3, (-Cdot1X), (-Cdot1Y), (-Cdot2));
		if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_equalLimits) {
			this.m_impulse.Add(this.impulse3);
		} else if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit) {
			newImpulse = this.m_impulse.z + this.impulse3.z;
			if (newImpulse < 0.0) {
				this.m_mass.Solve22(this.reduced, (-Cdot1X), (-Cdot1Y));
				this.impulse3.x = this.reduced.x;
				this.impulse3.y = this.reduced.y;
				this.impulse3.z = (-this.m_impulse.z);
				this.m_impulse.x += this.reduced.x;
				this.m_impulse.y += this.reduced.y;
				this.m_impulse.z = 0.0;
			}
		} else if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
			newImpulse = this.m_impulse.z + this.impulse3.z;
			if (newImpulse > 0.0) {
				this.m_mass.Solve22(this.reduced, (-Cdot1X), (-Cdot1Y));
				this.impulse3.x = this.reduced.x;
				this.impulse3.y = this.reduced.y;
				this.impulse3.z = (-this.m_impulse.z);
				this.m_impulse.x += this.reduced.x;
				this.m_impulse.y += this.reduced.y;
				this.m_impulse.z = 0.0;
			}
		}
		v1.x -= m1 * this.impulse3.x;
		v1.y -= m1 * this.impulse3.y;
		w1 -= i1 * (r1X * this.impulse3.y - r1Y * this.impulse3.x + this.impulse3.z);
		v2.x += m2 * this.impulse3.x;
		v2.y += m2 * this.impulse3.y;
		w2 += i2 * (r2X * this.impulse3.y - r2Y * this.impulse3.x + this.impulse3.z);
	} else {
		tMat = bA.m_xf.R;
		r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
		r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
		r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
		r1X = tX;
		tMat = bB.m_xf.R;
		r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
		r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
		tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
		r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
		r2X = tX;
		var CdotX = v2.x + ((-w2 * r2Y)) - v1.x - ((-w1 * r1Y));
		var CdotY = v2.y + (w2 * r2X) - v1.y - (w1 * r1X);
		this.m_mass.Solve22(this.impulse2, (-CdotX), (-CdotY));
		this.m_impulse.x += this.impulse2.x;
		this.m_impulse.y += this.impulse2.y;
		v1.x -= m1 * this.impulse2.x;
		v1.y -= m1 * this.impulse2.y;
		w1 -= i1 * (r1X * this.impulse2.y - r1Y * this.impulse2.x);
		v2.x += m2 * this.impulse2.x;
		v2.y += m2 * this.impulse2.y;
		w2 += i2 * (r2X * this.impulse2.y - r2Y * this.impulse2.x);
	}
	bA.m_linearVelocity.SetV(v1);
	bA.m_angularVelocity = w1;
	bB.m_linearVelocity.SetV(v2);
	bB.m_angularVelocity = w2;
};
Box2D.Dynamics.Joints.b2RevoluteJoint.prototype.SolvePositionConstraints = function(baumgarte) {
	if (baumgarte === undefined) baumgarte = 0;
	var oldLimitImpulse = 0;
	var C = 0;
	var tMat;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var angularError = 0.0;
	var positionError = 0.0;
	var tX = 0;
	var impulseX = 0;
	var impulseY = 0;
	if (this.m_enableLimit && this.m_limitState != Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit) {
		var angle = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
		var limitImpulse = 0.0;
		if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_equalLimits) {
			C = Box2D.Common.Math.b2Math.Clamp(angle - this.m_lowerAngle, (-Box2D.Common.b2Settings.b2_maxAngularCorrection), Box2D.Common.b2Settings.b2_maxAngularCorrection);
			limitImpulse = (-this.m_motorMass * C);
			angularError = Math.abs(C);
		} else if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit) {
			C = angle - this.m_lowerAngle;
			angularError = (-C);
			C = Box2D.Common.Math.b2Math.Clamp(C + Box2D.Common.b2Settings.b2_angularSlop, (-Box2D.Common.b2Settings.b2_maxAngularCorrection), 0.0);
			limitImpulse = (-this.m_motorMass * C);
		} else if (this.m_limitState == Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit) {
			C = angle - this.m_upperAngle;
			angularError = C;
			C = Box2D.Common.Math.b2Math.Clamp(C - Box2D.Common.b2Settings.b2_angularSlop, 0.0, Box2D.Common.b2Settings.b2_maxAngularCorrection);
			limitImpulse = (-this.m_motorMass * C);
		}
		bA.m_sweep.a -= bA.m_invI * limitImpulse;
		bB.m_sweep.a += bB.m_invI * limitImpulse;
		bA.SynchronizeTransform();
		bB.SynchronizeTransform();
	}
	tMat = bA.m_xf.R;
	var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
	var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
	r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
	r1X = tX;
	tMat = bB.m_xf.R;
	var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
	var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
	r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
	r2X = tX;
	var CX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
	var CY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
	var CLengthSquared = CX * CX + CY * CY;
	var CLength = Math.sqrt(CLengthSquared);
	positionError = CLength;
	var invMass1 = bA.m_invMass;
	var invMass2 = bB.m_invMass;
	var invI1 = bA.m_invI;
	var invI2 = bB.m_invI;
	var k_allowedStretch = 10.0 * Box2D.Common.b2Settings.b2_linearSlop;
	if (CLengthSquared > k_allowedStretch * k_allowedStretch) {
		var uX = CX / CLength;
		var uY = CY / CLength;
		var k = invMass1 + invMass2;
		var m = 1.0 / k;
		impulseX = m * ((-CX));
		impulseY = m * ((-CY));
		var k_beta = 0.5;
		bA.m_sweep.c.x -= k_beta * invMass1 * impulseX;
		bA.m_sweep.c.y -= k_beta * invMass1 * impulseY;
		bB.m_sweep.c.x += k_beta * invMass2 * impulseX;
		bB.m_sweep.c.y += k_beta * invMass2 * impulseY;
		CX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
		CY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
	}
	this.K1.col1.x = invMass1 + invMass2;
	this.K1.col2.x = 0.0;
	this.K1.col1.y = 0.0;
	this.K1.col2.y = invMass1 + invMass2;
	this.K2.col1.x = invI1 * r1Y * r1Y;
	this.K2.col2.x = (-invI1 * r1X * r1Y);
	this.K2.col1.y = (-invI1 * r1X * r1Y);
	this.K2.col2.y = invI1 * r1X * r1X;
	this.K3.col1.x = invI2 * r2Y * r2Y;
	this.K3.col2.x = (-invI2 * r2X * r2Y);
	this.K3.col1.y = (-invI2 * r2X * r2Y);
	this.K3.col2.y = invI2 * r2X * r2X;
	this.K.SetM(this.K1);
	this.K.AddM(this.K2);
	this.K.AddM(this.K3);
	this.K.Solve(Box2D.Dynamics.Joints.b2RevoluteJoint.tImpulse, (-CX), (-CY));
	impulseX = Box2D.Dynamics.Joints.b2RevoluteJoint.tImpulse.x;
	impulseY = Box2D.Dynamics.Joints.b2RevoluteJoint.tImpulse.y;
	bA.m_sweep.c.x -= bA.m_invMass * impulseX;
	bA.m_sweep.c.y -= bA.m_invMass * impulseY;
	bA.m_sweep.a -= bA.m_invI * (r1X * impulseY - r1Y * impulseX);
	bB.m_sweep.c.x += bB.m_invMass * impulseX;
	bB.m_sweep.c.y += bB.m_invMass * impulseY;
	bB.m_sweep.a += bB.m_invI * (r2X * impulseY - r2Y * impulseX);
	bA.SynchronizeTransform();
	bB.SynchronizeTransform();
	return positionError <= Box2D.Common.b2Settings.b2_linearSlop && angularError <= Box2D.Common.b2Settings.b2_angularSlop;
};
Box2D.Dynamics.Joints.b2RevoluteJoint.tImpulse = Box2D.Common.Math.b2Vec2.Get(0, 0);
/**
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2JointDef}
 */
Box2D.Dynamics.Joints.b2RevoluteJointDef = function() {
	Box2D.Dynamics.Joints.b2JointDef.call(this);
	this.localAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.type = Box2D.Dynamics.Joints.b2Joint.e_revoluteJoint;
	this.localAnchorA.SetZero();
	this.localAnchorB.SetZero();
	this.referenceAngle = 0.0;
	this.lowerAngle = 0.0;
	this.upperAngle = 0.0;
	this.maxMotorTorque = 0.0;
	this.motorSpeed = 0.0;
	this.enableLimit = false;
	this.enableMotor = false;
};
c2inherit(Box2D.Dynamics.Joints.b2RevoluteJointDef, Box2D.Dynamics.Joints.b2JointDef);
Box2D.Dynamics.Joints.b2RevoluteJointDef.prototype.Initialize = function(bA, bB, anchor) {
	this.bodyA = bA;
	this.bodyB = bB;
	this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
	this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
	this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
};
Box2D.Dynamics.Joints.b2RevoluteJointDef.prototype.Create = function() {
	return new Box2D.Dynamics.Joints.b2RevoluteJoint(this);
};
/**
 * @param {!Box2D.Dynamics.Joints.b2WeldJointDef} def
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2Joint}
 */
Box2D.Dynamics.Joints.b2WeldJoint = function(def) {
	Box2D.Dynamics.Joints.b2Joint.call(this, def);
	this.m_localAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_localAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.m_impulse = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	this.m_mass = new Box2D.Common.Math.b2Mat33();
	this.m_localAnchorA.SetV(def.localAnchorA);
	this.m_localAnchorB.SetV(def.localAnchorB);
	this.m_referenceAngle = def.referenceAngle;
};
c2inherit(Box2D.Dynamics.Joints.b2WeldJoint, Box2D.Dynamics.Joints.b2Joint);
Box2D.Dynamics.Joints.b2WeldJoint.prototype.GetAnchorA = function() {
	return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
};
Box2D.Dynamics.Joints.b2WeldJoint.prototype.GetAnchorB = function() {
	return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
};
/**
 * @param {number} inv_dt
 * @return {!Box2D.Common.Math.b2Vec2}
 */
Box2D.Dynamics.Joints.b2WeldJoint.prototype.GetReactionForce = function(inv_dt) {
	return Box2D.Common.Math.b2Vec2.Get(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
};
/**
 * @param {number} inv_dt
 * @return {number}
 */
Box2D.Dynamics.Joints.b2WeldJoint.prototype.GetReactionTorque = function(inv_dt) {
	return inv_dt * this.m_impulse.z;
};
Box2D.Dynamics.Joints.b2WeldJoint.prototype.InitVelocityConstraints = function(step) {
	var tMat;
	var tX = 0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	tMat = bA.m_xf.R;
	var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
	var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
	rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
	rAX = tX;
	tMat = bB.m_xf.R;
	var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
	var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
	rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
	rBX = tX;
	var mA = bA.m_invMass;
	var mB = bB.m_invMass;
	var iA = bA.m_invI;
	var iB = bB.m_invI;
	this.m_mass.col1.x = mA + mB + rAY * rAY * iA + rBY * rBY * iB;
	this.m_mass.col2.x = (-rAY * rAX * iA) - rBY * rBX * iB;
	this.m_mass.col3.x = (-rAY * iA) - rBY * iB;
	this.m_mass.col1.y = this.m_mass.col2.x;
	this.m_mass.col2.y = mA + mB + rAX * rAX * iA + rBX * rBX * iB;
	this.m_mass.col3.y = rAX * iA + rBX * iB;
	this.m_mass.col1.z = this.m_mass.col3.x;
	this.m_mass.col2.z = this.m_mass.col3.y;
	this.m_mass.col3.z = iA + iB;
	if (step.warmStarting) {
		this.m_impulse.x *= step.dtRatio;
		this.m_impulse.y *= step.dtRatio;
		this.m_impulse.z *= step.dtRatio;
		bA.m_linearVelocity.x -= mA * this.m_impulse.x;
		bA.m_linearVelocity.y -= mA * this.m_impulse.y;
		bA.m_angularVelocity -= iA * (rAX * this.m_impulse.y - rAY * this.m_impulse.x + this.m_impulse.z);
		bB.m_linearVelocity.x += mB * this.m_impulse.x;
		bB.m_linearVelocity.y += mB * this.m_impulse.y;
		bB.m_angularVelocity += iB * (rBX * this.m_impulse.y - rBY * this.m_impulse.x + this.m_impulse.z);
	} else {
		this.m_impulse.SetZero();
	}
};
Box2D.Dynamics.Joints.b2WeldJoint.prototype.SolveVelocityConstraints = function(step) {
	var tMat;
	var tX = 0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	var vA = bA.m_linearVelocity;
	var wA = bA.m_angularVelocity;
	var vB = bB.m_linearVelocity;
	var wB = bB.m_angularVelocity;
	var mA = bA.m_invMass;
	var mB = bB.m_invMass;
	var iA = bA.m_invI;
	var iB = bB.m_invI;
	tMat = bA.m_xf.R;
	var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
	var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
	rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
	rAX = tX;
	tMat = bB.m_xf.R;
	var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
	var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
	rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
	rBX = tX;
	var Cdot1X = vB.x - wB * rBY - vA.x + wA * rAY;
	var Cdot1Y = vB.y + wB * rBX - vA.y - wA * rAX;
	var Cdot2 = wB - wA;
	var impulse = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	this.m_mass.Solve33(impulse, (-Cdot1X), (-Cdot1Y), (-Cdot2));
	this.m_impulse.Add(impulse);
	vA.x -= mA * impulse.x;
	vA.y -= mA * impulse.y;
	wA -= iA * (rAX * impulse.y - rAY * impulse.x + impulse.z);
	vB.x += mB * impulse.x;
	vB.y += mB * impulse.y;
	wB += iB * (rBX * impulse.y - rBY * impulse.x + impulse.z);
	bA.m_angularVelocity = wA;
	bB.m_angularVelocity = wB;
};
Box2D.Dynamics.Joints.b2WeldJoint.prototype.SolvePositionConstraints = function(baumgarte) {
	if (baumgarte === undefined) baumgarte = 0;
	var tMat;
	var tX = 0;
	var bA = this.m_bodyA;
	var bB = this.m_bodyB;
	tMat = bA.m_xf.R;
	var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
	var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
	rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
	rAX = tX;
	tMat = bB.m_xf.R;
	var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
	var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
	tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
	rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
	rBX = tX;
	var mA = bA.m_invMass;
	var mB = bB.m_invMass;
	var iA = bA.m_invI;
	var iB = bB.m_invI;
	var C1X = bB.m_sweep.c.x + rBX - bA.m_sweep.c.x - rAX;
	var C1Y = bB.m_sweep.c.y + rBY - bA.m_sweep.c.y - rAY;
	var C2 = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
	var k_allowedStretch = 10.0 * Box2D.Common.b2Settings.b2_linearSlop;
	var positionError = Math.sqrt(C1X * C1X + C1Y * C1Y);
	var angularError = Math.abs(C2);
	if (positionError > k_allowedStretch) {
		iA *= 1.0;
		iB *= 1.0;
	}
	this.m_mass.col1.x = mA + mB + rAY * rAY * iA + rBY * rBY * iB;
	this.m_mass.col2.x = (-rAY * rAX * iA) - rBY * rBX * iB;
	this.m_mass.col3.x = (-rAY * iA) - rBY * iB;
	this.m_mass.col1.y = this.m_mass.col2.x;
	this.m_mass.col2.y = mA + mB + rAX * rAX * iA + rBX * rBX * iB;
	this.m_mass.col3.y = rAX * iA + rBX * iB;
	this.m_mass.col1.z = this.m_mass.col3.x;
	this.m_mass.col2.z = this.m_mass.col3.y;
	this.m_mass.col3.z = iA + iB;
	var impulse = new Box2D.Common.Math.b2Vec3(0, 0, 0);
	this.m_mass.Solve33(impulse, (-C1X), (-C1Y), (-C2));
	bA.m_sweep.c.x -= mA * impulse.x;
	bA.m_sweep.c.y -= mA * impulse.y;
	bA.m_sweep.a -= iA * (rAX * impulse.y - rAY * impulse.x + impulse.z);
	bB.m_sweep.c.x += mB * impulse.x;
	bB.m_sweep.c.y += mB * impulse.y;
	bB.m_sweep.a += iB * (rBX * impulse.y - rBY * impulse.x + impulse.z);
	bA.SynchronizeTransform();
	bB.SynchronizeTransform();
	return positionError <= Box2D.Common.b2Settings.b2_linearSlop && angularError <= Box2D.Common.b2Settings.b2_angularSlop;
};
/**
 * @constructor
 * @extends {Box2D.Dynamics.Joints.b2JointDef}
 */
Box2D.Dynamics.Joints.b2WeldJointDef = function() {
	Box2D.Dynamics.Joints.b2JointDef.call(this);
	this.localAnchorA = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.localAnchorB = Box2D.Common.Math.b2Vec2.Get(0, 0);
	this.type = Box2D.Dynamics.Joints.b2Joint.e_weldJoint;
	this.referenceAngle = 0.0;
};
c2inherit(Box2D.Dynamics.Joints.b2WeldJointDef, Box2D.Dynamics.Joints.b2JointDef);
Box2D.Dynamics.Joints.b2WeldJointDef.prototype.Initialize = function(bA, bB, anchor) {
	this.bodyA = bA;
	this.bodyB = bB;
	this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchor));
	this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchor));
	this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
};
Box2D.Dynamics.Joints.b2WeldJointDef.prototype.Create = function() {
	return new Box2D.Dynamics.Joints.b2WeldJoint(this);
};
Box2D.Collision.b2Collision.s_incidentEdge = Box2D.Collision.b2Collision.MakeClipPointVector();
Box2D.Collision.b2Collision.s_clipPoints1 = Box2D.Collision.b2Collision.MakeClipPointVector();
Box2D.Collision.b2Collision.s_clipPoints2 = Box2D.Collision.b2Collision.MakeClipPointVector();
Box2D.Collision.b2Collision.s_localTangent = Box2D.Common.Math.b2Vec2.Get(0, 0);
Box2D.Collision.b2Collision.s_localNormal = Box2D.Common.Math.b2Vec2.Get(0, 0);
Box2D.Collision.b2Collision.s_planePoint = Box2D.Common.Math.b2Vec2.Get(0, 0);
Box2D.Collision.b2Collision.s_normal = Box2D.Common.Math.b2Vec2.Get(0, 0);
Box2D.Collision.b2Collision.s_tangent = Box2D.Common.Math.b2Vec2.Get(0, 0);
Box2D.Collision.b2Collision.s_tangent2 = Box2D.Common.Math.b2Vec2.Get(0, 0);
Box2D.Collision.b2Collision.s_v11 = Box2D.Common.Math.b2Vec2.Get(0, 0);
Box2D.Collision.b2Collision.s_v12 = Box2D.Common.Math.b2Vec2.Get(0, 0);
Box2D.Collision.b2TimeOfImpact.b2_toiCalls = 0;
Box2D.Collision.b2TimeOfImpact.b2_toiIters = 0;
Box2D.Collision.b2TimeOfImpact.b2_toiMaxIters = 0;
Box2D.Collision.b2TimeOfImpact.b2_toiRootIters = 0;
Box2D.Collision.b2TimeOfImpact.b2_toiMaxRootIters = 0;
Box2D.Collision.b2TimeOfImpact.s_cache = new Box2D.Collision.b2SimplexCache();
Box2D.Collision.b2TimeOfImpact.s_distanceInput = new Box2D.Collision.b2DistanceInput();
Box2D.Collision.b2TimeOfImpact.s_xfA = new Box2D.Common.Math.b2Transform();
Box2D.Collision.b2TimeOfImpact.s_xfB = new Box2D.Common.Math.b2Transform();
Box2D.Collision.b2TimeOfImpact.s_fcn = new Box2D.Collision.b2SeparationFunction();
Box2D.Collision.b2TimeOfImpact.s_distanceOutput = new Box2D.Collision.b2DistanceOutput();
/** @type {!Box2D.Common.Math.b2Transform} */
Box2D.Dynamics.b2Body.s_xf1 = new Box2D.Common.Math.b2Transform();
Box2D.Dynamics.b2ContactListener.b2_defaultListener = new Box2D.Dynamics.b2ContactListener();
Box2D.Dynamics.b2ContactManager.s_evalCP = new Box2D.Collision.b2ContactPoint();
/** @type {!Box2D.Common.Math.b2Transform} */
Box2D.Dynamics.b2World.s_xf = new Box2D.Common.Math.b2Transform();
/** @type {!Box2D.Common.Math.b2Sweep} */
Box2D.Dynamics.b2World.s_backupA = new Box2D.Common.Math.b2Sweep();
/** @type {!Box2D.Common.Math.b2Sweep} */
Box2D.Dynamics.b2World.s_backupB = new Box2D.Common.Math.b2Sweep();
Box2D.Dynamics.Contacts.b2Contact.s_input = new Box2D.Collision.b2TOIInput();
Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold = new Box2D.Collision.b2WorldManifold();
Box2D.Dynamics.Contacts.b2ContactSolver.s_psm = new Box2D.Dynamics.Contacts.b2PositionSolverManifold();
/*
* Convex Separator for Box2D Flash
*
* This class has been written by Antoan Angelov.
* It is designed to work with Erin Catto's Box2D physics library.
*
* Everybody can use this software for any purpose, under two restrictions:
* 1. You cannot claim that you wrote this software.
* 2. You can not remove or alter this notice.
*
*/
cr.b2Separator = function() {};
cr.b2Separator.det = function(x1, y1, x2, y2, x3, y3)
{
	return x1*y2 + x2*y3 + x3*y1 - y1*x2 - y2*x3 - y3*x1;
};
cr.b2Separator.hitRay = function(x1, y1, x2, y2, x3, y3, x4, y4)
{
	var t1 = x3-x1, t2 = y3-y1, t3 = x2-x1, t4 = y2-y1, t5 = x4-x3, t6 = y4-y3, t7 = t4*t5 - t3*t6;
	var a = (t5*t2 - t6*t1) / t7;
	var px = x1 + a*t3, py = y1 + a*t4;
	var b1 = cr.b2Separator.isOnSegment(x2, y2, x1, y1, px, py);
	var b2 = cr.b2Separator.isOnSegment(px, py, x3, y3, x4, y4);
	if (b1 && b2)
		return Box2D.Common.Math.b2Vec2.Get(px, py);
	else
		return null;
};
cr.b2Separator.isOnSegment = function(px, py, x1, y1, x2, y2)
{
	var b1 = (x1+0.1 >= px && px >= x2-0.1) || (x1-0.1 <= px && px <= x2+0.1);
	var b2 = (y1+0.1 >= py && py >= y2-0.1) || (y1-0.1 <= py && py <= y2+0.1);
	return (b1 && b2) && cr.b2Separator.isOnLine(px, py, x1, y1, x2, y2);
};
cr.b2Separator.isOnLine = function(px, py, x1, y1, x2, y2)
{
	if (Math.abs(x2-x1) > 0.1)
	{
		var a = (y2-y1) / (x2-x1);
		var possibleY = a * (px-x1)+y1;
		var diff = Math.abs(possibleY-py);
		return diff < 0.1;
	}
	return Math.abs(px-x1) < 0.1;
};
cr.b2Separator.pointsMatch = function(x1, y1, x2, y2)
{
	return Math.abs(x2-x1) < 0.1 && Math.abs(y2-y1) < 0.1;
};
cr.b2Separator.Separate = function(verticesVec /*array of b2Vec2*/, objarea)
{
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	var calced = cr.b2Separator.calcShapes(verticesVec);
	var ret = [];
	var poly, a, b, c;
	var i, len, j, lenj;
	var areasum;
	for (i = 0, len = calced.length; i < len; i++)
	{
		a = calced[i];
		poly = [];
		poly.length = a.length;
		areasum = 0;
		for (j = 0, lenj = a.length; j < lenj; j++)
		{
			b = a[j];
			c = a[(j + 1) % lenj];
			areasum += (b.x * c.y - b.y * c.x);
			poly[j] = b2Vec2.Get(b.x, b.y);
		}
		areasum = Math.abs(areasum / 2);
		if (areasum >= objarea * 0.001)
			ret.push(poly);
	}
;
	return ret;
};
cr.b2Separator.calcShapes = function(verticesVec /*array of b2Vec2*/)
{
	var vec = [];										// array of b2Vec2
	var i = 0, n = 0, j = 0;							// ints
	var d = 0, t = 0, dx = 0, dy = 0, minLen = 0;		// numbers
	var i1 = 0, i2 = 0, i3 = 0;							// ints
	var p1, p2, p3, v1, v2, v, hitV;					// b2Vec2s
	var j1 = 0, j2 = 0, k = 0, h = 0;					// ints
	var vec1 = [], vec2 = [];							// array of b2Vec2
	var isConvex = false;								// boolean
	var figsVec = [], queue = [];						// Arrays
	queue.push(verticesVec);
	while (queue.length)
	{
		vec = queue[0];
		n = vec.length;
		isConvex = true;
		for (i = 0; i < n; i++)
		{
			i1 = i;
			i2 = (i < n-1) ? i+1 : i+1-n;
			i3 = (i < n-2) ? i+2 : i+2-n;
			p1 = vec[i1];
			p2 = vec[i2];
			p3 = vec[i3];
			d = cr.b2Separator.det(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
			if (d < 0)
			{
				isConvex = false;
				minLen = 1e9;
				for (j = 0; j < n; j++)
				{
					if ((j !== i1) && (j !== i2))
					{
						j1 = j;
						j2 = (j<n - 1) ? j+1 : 0;
						v1 = vec[j1];
						v2 = vec[j2];
						v = cr.b2Separator.hitRay(p1.x, p1.y, p2.x, p2.y, v1.x, v1.y, v2.x, v2.y);
						if (v)
						{
							dx = p2.x - v.x;
							dy = p2.y - v.y;
							t = dx*dx + dy*dy;
							if (t < minLen)
							{
								h = j1;
								k = j2;
								hitV = v;
								minLen = t;
							}
						}
					}
				}
				if (minLen === 1e9)
					return [];
				vec1 = [];
				vec2 = [];
				j1 = h;
				j2 = k;
				v1 = vec[j1];
				v2 = vec[j2];
				if (!cr.b2Separator.pointsMatch(hitV.x, hitV.y, v2.x, v2.y))
					vec1.push(hitV);
				if (!cr.b2Separator.pointsMatch(hitV.x, hitV.y, v1.x, v1.y))
					vec2.push(hitV);
				h = -1;
				k = i1;
				while (true)
				{
					if (k !== j2)
						vec1.push(vec[k]);
					else
					{
						if (h < 0 || h >= n)
							return [];
						if (!cr.b2Separator.isOnSegment(v2.x, v2.y, vec[h].x, vec[h].y, p1.x, p1.y))
							vec1.push(vec[k]);
						break;
					}
					h = k;
					if (k-1 < 0)
						k = n-1;
					else
						k--;
				}
				vec1.reverse();
				h = -1;
				k = i2;
				while (true)
				{
					if (k !== j1)
						vec2.push(vec[k]);
					else
					{
						if (h < 0 || h >= n)
							return [];
						if (k === j1 && !cr.b2Separator.isOnSegment(v1.x, v1.y, vec[h].x, vec[h].y, p2.x, p2.y))
							vec2.push(vec[k]);
						break;
					}
					h = k;
					if (k+1 > n-1)
						k = 0;
					else
						k++;
				}
				queue.push(vec1, vec2);
				queue.shift();
				break;
			}
		}
		if (isConvex)
			figsVec.push(queue.shift());
	}
	return figsVec;
};
;
;
cr.behaviors.Physics = function(runtime)
{
	for (var i = 0; i < 4000; i++)
		Box2D.Common.Math.b2Vec2._freeCache.push(new Box2D.Common.Math.b2Vec2(0, 0));
	this.runtime = runtime;
	this.world = new Box2D.Dynamics.b2World(
								Box2D.Common.Math.b2Vec2.Get(0, 10),	// gravity
								true);									// allow sleep
	this.worldG = 10;
	this.lastUpdateTick = -1;
	var listener = new Box2D.Dynamics.b2ContactListener;
	listener.behavior = this;
	listener.BeginContact = function(contact)
	{
		var behA = contact.m_fixtureA.GetBody().c2userdata;
		var behB = contact.m_fixtureB.GetBody().c2userdata;
		this.behavior.runtime.registerCollision(behA.inst, behB.inst);
	};
	this.world.SetContactListener(listener);
	var filter = new Box2D.Dynamics.b2ContactFilter;
	filter.behavior = this;
	filter.ShouldCollide = function (fixtureA, fixtureB)
	{
		if (this.behavior.allCollisionsEnabled)
			return true;
		var typeA = fixtureA.GetBody().c2userdata.inst.type;
		var typeB = fixtureB.GetBody().c2userdata.inst.type;
		var s = typeA.extra["Physics_DisabledCollisions"];
		if (s && s.contains(typeB))
			return false;
		s = typeB.extra["Physics_DisabledCollisions"];
		if (s && s.contains(typeA))
			return false;
		return true;
	};
	this.world.SetContactFilter(filter);
	this.steppingMode = 0;		// fixed
	this.velocityIterations = 8;
	this.positionIterations = 3;
	this.allCollisionsEnabled = true;
};
(function ()
{
	var b2Vec2 = Box2D.Common.Math.b2Vec2,
		b2BodyDef = Box2D.Dynamics.b2BodyDef,
		b2Body = Box2D.Dynamics.b2Body,
		b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
		b2Fixture = Box2D.Dynamics.b2Fixture,
		b2World = Box2D.Dynamics.b2World,
		b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
		b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
		b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
		b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
		b2Transform = Box2D.Common.Math.b2Transform,
		b2Mat22 = Box2D.Common.Math.b2Mat22;
	var TILE_FLIPPED_HORIZONTAL = -0x80000000		// note: pretend is a signed int, so negate
	var TILE_FLIPPED_VERTICAL = 0x40000000
	var TILE_FLIPPED_DIAGONAL = 0x20000000
	var TILE_FLAGS_MASK = 0xE0000000
	var worldScale = 0.02;
	var behaviorProto = cr.behaviors.Physics.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
		this.world = this.behavior.world;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.immovable = (this.properties[0] !== 0);
		this.collisionmask = this.properties[1];
		this.preventRotation = (this.properties[2] !== 0);
		this.density = this.properties[3];
		this.friction = this.properties[4];
		this.restitution = this.properties[5];
		this.linearDamping = this.properties[6];
		this.angularDamping = this.properties[7];
		this.bullet = (this.properties[8] !== 0);
		this.enabled = (this.properties[9] !== 0);
		this.body = null;
		this.inst.update_bbox();
		this.lastKnownX = this.inst.x;
		this.lastKnownY = this.inst.y;
		this.lastKnownAngle = this.inst.angle;
		this.lastWidth = 0;
		this.lastHeight = 0;
		this.lastTickOverride = false;
		this.recreateBody = false;
		this.lastAnimation = null;			// for sprites only - will be undefined for other objects
		this.lastAnimationFrame = -1;		// for sprites only - will be undefined for other objects
		if (this.myJoints)
		{
			this.myJoints.length = 0;
			this.myCreatedJoints.length = 0;
			this.joiningMe.clear();
		}
		else
		{
			this.myJoints = [];						// Created Box2D joints
			this.myCreatedJoints = [];				// List of actions called to create joints
			this.joiningMe = new cr.ObjectSet();	// Instances with joints to me
		}
		var self = this;
		if (!this.recycled)
		{
			this.myDestroyCallback = (function(inst) {
													self.onInstanceDestroyed(inst);
												});
		}
		this.runtime.addDestroyCallback(this.myDestroyCallback);
	};
	behinstProto.postCreate = function ()
	{
		this.inst.update_bbox();
		this.createBody();
		this.lastAnimation = this.inst.cur_animation;
		this.lastAnimationFrame = this.inst.cur_frame;
	};
	behinstProto.onDestroy = function()
	{
		this.destroyMyJoints();
		this.myCreatedJoints.length = 0;
		this.joiningMe.clear();
		if (this.body)
		{
			this.world.DestroyBody(this.body);
			this.body = null;
		}
		this.runtime.removeDestroyCallback(this.myDestroyCallback);
	};
	behinstProto.saveToJSON = function ()
	{
		var o = {
			"e": this.enabled,
			"im": this.immovable,
			"pr": this.preventRotation,
			"d": this.density,
			"fr": this.friction,
			"re": this.restitution,
			"ld": this.linearDamping,
			"ad": this.angularDamping,
			"b": this.bullet,
			"mcj": this.myCreatedJoints
		};
		if (this.enabled)
		{
			var temp = b2Vec2.Get(0, 0);
			temp.SetV(this.body.GetLinearVelocity());
			o["vx"] = temp.x;
			o["vy"] = temp.y;
			o["om"] = this.body.GetAngularVelocity();
		}
		return o;
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.destroyMyJoints();
		this.myCreatedJoints.length = 0;
		this.joiningMe.clear();
		if (this.body)
		{
			this.world.DestroyBody(this.body);
			this.body = null;
		}
		this.enabled = o["e"];
		this.immovable = o["im"];
		this.preventRotation = o["pr"];
		this.density = o["d"];
		this.friction = o["fr"];
		this.restitution = o["re"];
		this.linearDamping = o["ld"];
		this.angularDamping = o["ad"];
		this.bullet = o["b"];
		this.lastKnownX = this.inst.x;
		this.lastKnownY = this.inst.y;
		this.lastKnownAngle = this.inst.angle;
		this.lastWidth = this.inst.width;
		this.lastHeight = this.inst.height;
		if (this.enabled)
		{
			this.createBody();
			this.body.SetLinearVelocity(b2Vec2.Get(o["vx"], o["vy"]));
			this.body.SetAngularVelocity(o["om"]);
			if (o["vx"] !== 0 || o["vy"] !== 0 || o["om"] !== 0)
				this.body.SetAwake(true);
			this.myCreatedJoints = o["mcj"];
		}
	};
	behinstProto.afterLoad = function ()
	{
		if (this.enabled)
			this.recreateMyJoints();
		this.behavior.lastUpdateTick = this.runtime.tickcount - 1;
	};
	behinstProto.onInstanceDestroyed = function (inst)
	{
		var i, len, j, instuid = inst.uid;
		for (i = 0, j = 0, len = this.myCreatedJoints.length; i < len; i++)
		{
			this.myCreatedJoints[j] = this.myCreatedJoints[i];
			if (j < this.myJoints.length)
				this.myJoints[j] = this.myJoints[i];
			if (this.myCreatedJoints[i].params[1] == instuid)		// attached instance is always 2nd param
				this.world.DestroyJoint(this.myJoints[i]);
			else
				j++;
		}
		this.myCreatedJoints.length = j;
		if (j < this.myJoints.length)
			this.myJoints.length = j;
		this.joiningMe.remove(inst);
	};
	behinstProto.destroyMyJoints = function()
	{
		var i, len;
		for (i = 0, len = this.myJoints.length; i < len; i++)
			this.world.DestroyJoint(this.myJoints[i]);
		this.myJoints.length = 0;
	};
	behinstProto.recreateMyJoints = function()
	{
		var i, len, j;
		for (i = 0, len = this.myCreatedJoints.length; i < len; i++)
		{
			j = this.myCreatedJoints[i];
			switch (j.type) {
			case 0:			// distance joint
				this.doCreateDistanceJoint(j.params[0], j.params[1], j.params[2], j.params[3], j.params[4]);
				break;
			case 1:			// revolute joint
				this.doCreateRevoluteJoint(j.params[0], j.params[1]);
				break;
			case 2:			// limited revolute joint
				this.doCreateLimitedRevoluteJoint(j.params[0], j.params[1], j.params[2], j.params[3]);
				break;
			default:
;
			}
		}
	};
	behinstProto.destroyBody = function()
	{
		if (!this.body)
			return;
		this.destroyMyJoints();
		this.world.DestroyBody(this.body);
		this.body = null;
		this.inst.extra.box2dbody = null;
	};
	var collrects = [];
	behinstProto.createBody = function()
	{
		if (!this.enabled)
			return;
		var inst = this.inst;
		var hadOldBody = false;
		var oldVelocity = null;
		var oldOmega = null;
		var i, len, j, lenj, k, lenk, vec, arr, b, c, rc, pts_cache, pts_count, convexpolys, cp, offx, offy, oldAngle;
		if (this.body)
		{
			hadOldBody = true;
			oldVelocity = b2Vec2.Get(0, 0);
			oldVelocity.SetV(this.body.GetLinearVelocity());
			oldOmega = this.body.GetAngularVelocity();
			arr = this.joiningMe.valuesRef();
			for (i = 0, len = arr.length; i < len; i++)
			{
				b = arr[i].extra.box2dbody.c2userdata;
				b.destroyMyJoints();
			}
			this.destroyBody();
		}
		var fixDef = new b2FixtureDef;
		fixDef.density = this.density;
		fixDef.friction = this.friction;
		fixDef.restitution = this.restitution;
		var bodyDef = new b2BodyDef;
		if (this.immovable)
			bodyDef.type = 0; //b2BodyDef.b2_staticBody
		else
			bodyDef.type = 2; //b2BodyDef.b2_dynamicBody
		inst.update_bbox();
		bodyDef.position.x = inst.bquad.midX() * worldScale;
		bodyDef.position.y = inst.bquad.midY() * worldScale;
		bodyDef.angle = inst.angle;
		bodyDef.fixedRotation = this.preventRotation;
		bodyDef.linearDamping = this.linearDamping;
		bodyDef.angularDamping = this.angularDamping;
		bodyDef.bullet = this.bullet;
		var hasPoly = this.inst.collision_poly && !this.inst.collision_poly.is_empty();
		this.body = this.world.CreateBody(bodyDef);
		this.body.c2userdata = this;
		var usecollisionmask = this.collisionmask;
		if (!hasPoly && !this.inst.tilemap_exists && this.collisionmask === 0)
			usecollisionmask = 1;
		var instw = Math.max(Math.abs(inst.width), 1);
		var insth = Math.max(Math.abs(inst.height), 1);
		var ismirrored = inst.width < 0;
		var isflipped = inst.height < 0;
		if (usecollisionmask === 0)
		{
			if (inst.tilemap_exists)
			{
				offx = inst.bquad.midX() - inst.x;
				offy = inst.bquad.midY() - inst.y;
				inst.getAllCollisionRects(collrects);
				arr = [];
				for (i = 0, len = collrects.length; i < len; ++i)
				{
					c = collrects[i];
					rc = c.rc;
					if (c.poly)
					{
						if (!c.poly.convexpolys)
						{
							pts_cache = c.poly.pts_cache;
							pts_count = c.poly.pts_count;
							for (j = 0; j < pts_count; ++j)
							{
								arr.push(b2Vec2.Get(pts_cache[j*2], pts_cache[j*2+1]));
							}
							var flags = (c.id & TILE_FLAGS_MASK);
							if (flags === TILE_FLIPPED_HORIZONTAL || flags === TILE_FLIPPED_VERTICAL || flags === TILE_FLIPPED_DIAGONAL ||
								((flags & TILE_FLIPPED_HORIZONTAL) && (flags & TILE_FLIPPED_VERTICAL) && (flags & TILE_FLIPPED_DIAGONAL)))
							{
								arr.reverse();
							}
							c.poly.convexpolys = cr.b2Separator.Separate(arr, (rc.right - rc.left) * (rc.bottom - rc.top));
							for (j = 0, lenj = arr.length; j < lenj; ++j)
								b2Vec2.Free(arr[j]);
							arr.length = 0;
						}
						for (j = 0, lenj = c.poly.convexpolys.length; j < lenj; ++j)
						{
							cp = c.poly.convexpolys[j];
;
							for (k = 0, lenk = cp.length; k < lenk; ++k)
							{
								arr.push(b2Vec2.Get((rc.left + cp[k].x - offx) * worldScale, (rc.top + cp[k].y - offy) * worldScale));
							}
							fixDef.shape = new b2PolygonShape;
							fixDef.shape.SetAsArray(arr, arr.length);		// copies content of arr
							this.body.CreateFixture(fixDef);
							for (k = 0, lenk = arr.length; k < lenk; ++k)
								b2Vec2.Free(arr[k]);
							arr.length = 0;
						}
					}
					else
					{
						arr.push(b2Vec2.Get((rc.left - offx) * worldScale, (rc.top - offy) * worldScale));
						arr.push(b2Vec2.Get((rc.right - offx) * worldScale, (rc.top - offy) * worldScale));
						arr.push(b2Vec2.Get((rc.right - offx) * worldScale, (rc.bottom - offy) * worldScale));
						arr.push(b2Vec2.Get((rc.left - offx) * worldScale, (rc.bottom - offy) * worldScale));
						fixDef.shape = new b2PolygonShape;
						fixDef.shape.SetAsArray(arr, arr.length);		// copies content of arr
						this.body.CreateFixture(fixDef);
					}
					for (j = 0, lenj = arr.length; j < lenj; ++j)
						b2Vec2.Free(arr[j]);
					arr.length = 0;
				}
			}
			else
			{
				oldAngle = inst.angle;
				inst.angle = 0;
				inst.set_bbox_changed();
				inst.update_bbox();
				offx = inst.bquad.midX() - inst.x;
				offy = inst.bquad.midY() - inst.y;
				inst.angle = oldAngle;
				inst.set_bbox_changed();
				inst.collision_poly.cache_poly(ismirrored ? -instw : instw, isflipped ? -insth : insth, 0);
				pts_cache = inst.collision_poly.pts_cache;
				pts_count = inst.collision_poly.pts_count;
				arr = [];
				arr.length = pts_count;
				for (i = 0; i < pts_count; i++)
				{
					arr[i] = b2Vec2.Get(pts_cache[i*2] - offx, pts_cache[i*2+1] - offy);
				}
				if (ismirrored !== isflipped)
					arr.reverse();		// wrong clockwise order when flipped
				convexpolys = cr.b2Separator.Separate(arr, instw * insth);
				for (i = 0; i < pts_count; i++)
					b2Vec2.Free(arr[i]);
				if (convexpolys.length)
				{
					for (i = 0, len = convexpolys.length; i < len; i++)
					{
						arr = convexpolys[i];
;
						for (j = 0, lenj = arr.length; j < lenj; j++)
						{
							vec = arr[j];
							vec.x *= worldScale;
							vec.y *= worldScale;
						}
						fixDef.shape = new b2PolygonShape;
						fixDef.shape.SetAsArray(arr, arr.length);		// copies content of arr
						this.body.CreateFixture(fixDef);
						for (j = 0, lenj = arr.length; j < lenj; j++)
							b2Vec2.Free(arr[j]);
					}
				}
				else
				{
					fixDef.shape = new b2PolygonShape;
					fixDef.shape.SetAsBox(instw * worldScale * 0.5, insth * worldScale * 0.5);
					this.body.CreateFixture(fixDef);
				}
			}
		}
		else if (usecollisionmask === 1)
		{
			fixDef.shape = new b2PolygonShape;
			fixDef.shape.SetAsBox(instw * worldScale * 0.5, insth * worldScale * 0.5);
			this.body.CreateFixture(fixDef);
		}
		else
		{
			fixDef.shape = new b2CircleShape(Math.min(instw, insth) * worldScale * 0.5);
			this.body.CreateFixture(fixDef);
		}
		inst.extra.box2dbody = this.body;
		this.lastWidth = inst.width;
		this.lastHeight = inst.height;
		if (hadOldBody)
		{
			this.body.SetLinearVelocity(oldVelocity);
			this.body.SetAngularVelocity(oldOmega);
			b2Vec2.Free(oldVelocity);
			this.recreateMyJoints();
			arr = this.joiningMe.valuesRef();
			for (i = 0, len = arr.length; i < len; i++)
			{
				b = arr[i].extra.box2dbody.c2userdata;
				b.recreateMyJoints();
			}
		}
		collrects.length = 0;
	};
	/*
	behinstProto.draw = function (ctx)
	{
		if (!this.myconvexpolys)
			return;
		this.inst.update_bbox();
		var midx = this.inst.bquad.midX();
		var midy = this.inst.bquad.midY();
		var i, len, j, lenj;
		var sina = 0;
		var cosa = 1;
		if (this.inst.angle !== 0)
		{
			sina = Math.sin(this.inst.angle);
			cosa = Math.cos(this.inst.angle);
		}
		var strokeStyles = ["#f00", "#0f0", "#00f", "#ff0", "#0ff", "#f0f"];
		ctx.lineWidth = 2;
		var i, len, j, lenj, ax, ay, bx, by, poly, va, vb;
		for (i = 0, len = this.myconvexpolys.length; i < len; i++)
		{
			poly = this.myconvexpolys[i];
			ctx.strokeStyle = strokeStyles[i];
			for (j = 0, lenj = poly.length; j < lenj; j++)
			{
				va = poly[j];
				vb = poly[(j + 1) % lenj];
				ax = va.x / worldScale;
				ay = va.y / worldScale;
				bx = vb.x / worldScale;
				by = vb.y / worldScale;
				ctx.beginPath();
				ctx.moveTo(((ax * cosa) - (ay * sina)) + midx, ((ay * cosa) + (ax * sina)) + midy);
				ctx.lineTo(((bx * cosa) - (by * sina)) + midx, ((by * cosa) + (bx * sina)) + midy);
				ctx.stroke();
				ctx.closePath();
			}
		}
	};
	*/
	behinstProto.tick = function ()
	{
		if (!this.enabled)
			return;
		var inst = this.inst;
		var dt;
		if (this.behavior.steppingMode === 0)		// fixed
			dt = this.runtime.timescale / 60;
		else
		{
			dt = this.runtime.getDt(this.inst);
			if (dt > 1 / 30)
				dt = 1 / 30;
		}
		if (this.runtime.tickcount > this.behavior.lastUpdateTick && this.runtime.timescale > 0)
		{
			this.world.Step(dt, this.behavior.velocityIterations, this.behavior.positionIterations);		// still apply timescale
			this.world.ClearForces();
			this.behavior.lastUpdateTick = this.runtime.tickcount;
		}
		if (this.recreateBody || inst.width !== this.lastWidth || inst.height !== this.lastHeight
			|| inst.cur_animation !== this.lastAnimation || inst.cur_frame !== this.lastAnimationFrame
			|| (inst.tilemap_exists && inst.physics_changed))
		{
			this.createBody();
			this.recreateBody = false;
			this.lastAnimation = inst.cur_animation;
			this.lastAnimationFrame = inst.cur_frame;
			if (inst.tilemap_exists && inst.physics_changed)
				inst.physics_changed = false;
		}
		var pos_changed = (inst.x !== this.lastKnownX || inst.y !== this.lastKnownY);
		var angle_changed = (inst.angle !== this.lastKnownAngle);
		if (pos_changed)
		{
			inst.update_bbox();
			var newmidx = inst.bquad.midX();
			var newmidy = inst.bquad.midY();
			var diffx = newmidx - this.lastKnownX;
			var diffy = newmidy - this.lastKnownY;
			this.body.SetPosition(b2Vec2.Get(newmidx * worldScale, newmidy * worldScale));
			this.body.SetLinearVelocity(b2Vec2.Get(diffx, diffy));
			this.lastTickOverride = true;
			this.body.SetAwake(true);
		}
		else if (this.lastTickOverride)
		{
			this.lastTickOverride = false;
			this.body.SetLinearVelocity(b2Vec2.Get(0, 0));
			this.body.SetPosition(b2Vec2.Get(inst.bquad.midX() * worldScale, inst.bquad.midY() * worldScale));
		}
		if (angle_changed)
		{
			this.body.SetAngle(inst.angle);
			this.body.SetAwake(true);
		}
		var pos = this.body.GetPosition();
		var newx = pos.x / worldScale;
		var newy = pos.y / worldScale;
		var newangle = this.body.GetAngle();
		if (newx !== inst.x || newy !== inst.y || newangle !== inst.angle)
		{
			inst.x = newx;
			inst.y = newy;
			inst.angle = newangle;
			inst.set_bbox_changed();
			inst.update_bbox();
			var dx = inst.bquad.midX() - inst.x;
			var dy = inst.bquad.midY() - inst.y;
			if (dx !== 0 || dy !== 0)
			{
				inst.x -= dx;
				inst.y -= dy;
				inst.set_bbox_changed();
			}
		}
		this.lastKnownX = inst.x;
		this.lastKnownY = inst.y;
		this.lastKnownAngle = inst.angle;
	};
	behinstProto.getInstImgPointX = function(imgpt)
	{
		if (imgpt === -1 || !this.inst.getImagePoint)
			return this.inst.x;
		if (imgpt === 0 && this.body)
			return (this.body.GetPosition().x + this.body.GetLocalCenter().x) / worldScale;
		return this.inst.getImagePoint(imgpt, true);
	};
	behinstProto.getInstImgPointY = function(imgpt)
	{
		if (imgpt === -1 || !this.inst.getImagePoint)
			return this.inst.y;
		if (imgpt === 0 && this.body)
			return (this.body.GetPosition().y + this.body.GetLocalCenter().y) / worldScale;
		return this.inst.getImagePoint(imgpt, false);
	};
	function Cnds() {};
	Cnds.prototype.IsSleeping = function ()
	{
		if (!this.enabled)
			return false;
		return !this.body.IsAwake();
	};
	Cnds.prototype.CompareVelocity = function (which_, cmp_, x_)
	{
		if (!this.enabled)
			return false;
		var velocity_vec = this.body.GetLinearVelocity();
		var v, vx, vy;
		if (which_ === 0)		// X velocity
			v = velocity_vec.x / worldScale;
		else if (which_ === 1)	// Y velocity
			v = velocity_vec.y / worldScale;
		else					// Overall velocity
		{
			vx = velocity_vec.x / worldScale;
			vy = velocity_vec.y / worldScale;
			v = cr.distanceTo(0, 0, vx, vy);
		}
		return cr.do_cmp(v, cmp_, x_);
	};
	Cnds.prototype.CompareAngularVelocity = function (cmp_, x_)
	{
		if (!this.enabled)
			return false;
		var av = cr.to_degrees(this.body.GetAngularVelocity());
		return cr.do_cmp(av, cmp_, x_);
	};
	Cnds.prototype.CompareMass = function (cmp_, x_)
	{
		if (!this.enabled)
			return false;
		var mass = this.body.GetMass() / worldScale;
		return cr.do_cmp(mass, cmp_, x_);
	};
	Cnds.prototype.IsEnabled = function ()
	{
		return this.enabled;
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.ApplyForce = function (fx, fy, imgpt)
	{
		if (!this.enabled)
			return;
		var x = this.getInstImgPointX(imgpt);
		var y = this.getInstImgPointY(imgpt);
		this.body.ApplyForce(b2Vec2.Get(fx, fy), b2Vec2.Get(x * worldScale, y * worldScale));
	};
	Acts.prototype.ApplyForceToward = function (f, px, py, imgpt)
	{
		if (!this.enabled)
			return;
		var x = this.getInstImgPointX(imgpt);
		var y = this.getInstImgPointY(imgpt);
		var a = cr.angleTo(x, y, px, py);
		this.body.ApplyForce(b2Vec2.Get(Math.cos(a) * f, Math.sin(a) * f), b2Vec2.Get(x * worldScale, y * worldScale));
	};
	Acts.prototype.ApplyForceAtAngle = function (f, a, imgpt)
	{
		if (!this.enabled)
			return;
		a = cr.to_radians(a);
		var x = this.getInstImgPointX(imgpt);
		var y = this.getInstImgPointY(imgpt);
		this.body.ApplyForce(b2Vec2.Get(Math.cos(a) * f, Math.sin(a) * f), b2Vec2.Get(x * worldScale, y * worldScale));
	};
	Acts.prototype.ApplyImpulse = function (fx, fy, imgpt)
	{
		if (!this.enabled)
			return;
		var x = this.getInstImgPointX(imgpt);
		var y = this.getInstImgPointY(imgpt);
		this.body.ApplyImpulse(b2Vec2.Get(fx, fy), b2Vec2.Get(x * worldScale, y * worldScale));
		this.lastTickOverride = false;
		this.lastKnownX = this.inst.x;
		this.lastKnownY = this.inst.y;
	};
	Acts.prototype.ApplyImpulseToward = function (f, px, py, imgpt)
	{
		if (!this.enabled)
			return;
		var x = this.getInstImgPointX(imgpt);
		var y = this.getInstImgPointY(imgpt);
		var a = cr.angleTo(x, y, px, py);
		this.body.ApplyImpulse(b2Vec2.Get(Math.cos(a) * f, Math.sin(a) * f), b2Vec2.Get(x * worldScale, y * worldScale));
		this.lastTickOverride = false;
		this.lastKnownX = this.inst.x;
		this.lastKnownY = this.inst.y;
	};
	Acts.prototype.ApplyImpulseAtAngle = function (f, a, imgpt)
	{
		if (!this.enabled)
			return;
		a = cr.to_radians(a);
		var x = this.getInstImgPointX(imgpt);
		var y = this.getInstImgPointY(imgpt);
		this.body.ApplyImpulse(b2Vec2.Get(Math.cos(a) * f, Math.sin(a) * f), b2Vec2.Get(x * worldScale, y * worldScale));
		this.lastTickOverride = false;
		this.lastKnownX = this.inst.x;
		this.lastKnownY = this.inst.y;
	};
	Acts.prototype.ApplyTorque = function (m)
	{
		if (!this.enabled)
			return;
		this.body.ApplyTorque(cr.to_radians(m));
	};
	Acts.prototype.ApplyTorqueToAngle = function (m, a)
	{
		if (!this.enabled)
			return;
		m = cr.to_radians(m);
		a = cr.to_radians(a);
		if (cr.angleClockwise(this.inst.angle, a))
			this.body.ApplyTorque(-m);
		else
			this.body.ApplyTorque(m);
	};
	Acts.prototype.ApplyTorqueToPosition = function (m, x, y)
	{
		if (!this.enabled)
			return;
		m = cr.to_radians(m);
		var a = cr.angleTo(this.inst.x, this.inst.y, x, y);
		if (cr.angleClockwise(this.inst.angle, a))
			this.body.ApplyTorque(-m);
		else
			this.body.ApplyTorque(m);
	};
	Acts.prototype.SetAngularVelocity = function (v)
	{
		if (!this.enabled)
			return;
		this.body.SetAngularVelocity(cr.to_radians(v));
		this.body.SetAwake(true);
	};
	Acts.prototype.CreateDistanceJoint = function (imgpt, obj, objimgpt, damping, freq)
	{
		if (!obj || !this.enabled)
			return;
		var otherinst = obj.getFirstPicked(this.inst);
		if (!otherinst || otherinst == this.inst)
			return;
		if (!otherinst.extra.box2dbody)
			return;		// no physics behavior on other object
		this.myCreatedJoints.push({type: 0, params: [imgpt, otherinst.uid, objimgpt, damping, freq]});
		this.doCreateDistanceJoint(imgpt, otherinst.uid, objimgpt, damping, freq);
	};
	behinstProto.doCreateDistanceJoint = function (imgpt, otherinstuid, objimgpt, damping, freq)
	{
		if (!this.enabled)
			return;
		var otherinst = this.runtime.getObjectByUID(otherinstuid);
		if (!otherinst || otherinst == this.inst || !otherinst.extra.box2dbody)
			return;
		otherinst.extra.box2dbody.c2userdata.joiningMe.add(this.inst);
		var myx = this.getInstImgPointX(imgpt);
		var myy = this.getInstImgPointY(imgpt);
		var theirx, theiry;
		if (otherinst.getImagePoint)
		{
			theirx = otherinst.getImagePoint(objimgpt, true);
			theiry = otherinst.getImagePoint(objimgpt, false);
		}
		else
		{
			theirx = otherinst.x;
			theiry = otherinst.y;
		}
		var dx = myx - theirx;
		var dy = myy - theiry;
		var jointDef = new b2DistanceJointDef();
		jointDef.Initialize(this.body, otherinst.extra.box2dbody, b2Vec2.Get(myx * worldScale, myy * worldScale), b2Vec2.Get(theirx * worldScale, theiry * worldScale));
		jointDef.length = Math.sqrt(dx*dx + dy*dy) * worldScale;
		jointDef.dampingRatio = damping;
		jointDef.frequencyHz = freq;
		this.myJoints.push(this.world.CreateJoint(jointDef));
	};
	Acts.prototype.CreateRevoluteJoint = function (imgpt, obj)
	{
		if (!obj || !this.enabled)
			return;
		var otherinst = obj.getFirstPicked(this.inst);
		if (!otherinst || otherinst == this.inst)
			return;
		if (!otherinst.extra.box2dbody)
			return;		// no physics behavior on other object
		this.myCreatedJoints.push({type: 1, params: [imgpt, otherinst.uid]});
		this.doCreateRevoluteJoint(imgpt, otherinst.uid);
	};
	behinstProto.doCreateRevoluteJoint = function (imgpt, otherinstuid)
	{
		if (!this.enabled)
			return;
		var otherinst = this.runtime.getObjectByUID(otherinstuid);
		if (!otherinst || otherinst == this.inst || !otherinst.extra.box2dbody)
			return;
		otherinst.extra.box2dbody.c2userdata.joiningMe.add(this.inst);
		var myx = this.getInstImgPointX(imgpt);
		var myy = this.getInstImgPointY(imgpt);
		var jointDef = new b2RevoluteJointDef();
		jointDef.Initialize(this.body, otherinst.extra.box2dbody, b2Vec2.Get(myx * worldScale, myy * worldScale));
		this.myJoints.push(this.world.CreateJoint(jointDef));
	};
	Acts.prototype.CreateLimitedRevoluteJoint = function (imgpt, obj, lower, upper)
	{
		if (!obj || !this.enabled)
			return;
		var otherinst = obj.getFirstPicked(this.inst);
		if (!otherinst || otherinst == this.inst)
			return;
		if (!otherinst.extra.box2dbody)
			return;		// no physics behavior on other object
		this.myCreatedJoints.push({type: 2, params: [imgpt, otherinst.uid, lower, upper]});
		this.doCreateLimitedRevoluteJoint(imgpt, otherinst.uid, lower, upper);
	};
	behinstProto.doCreateLimitedRevoluteJoint = function (imgpt, otherinstuid, lower, upper)
	{
		if (!this.enabled)
			return;
		var otherinst = this.runtime.getObjectByUID(otherinstuid);
		if (!otherinst || otherinst == this.inst || !otherinst.extra.box2dbody)
			return;
		otherinst.extra.box2dbody.c2userdata.joiningMe.add(this.inst);
		var myx = this.getInstImgPointX(imgpt);
		var myy = this.getInstImgPointY(imgpt);
		var jointDef = new b2RevoluteJointDef();
		jointDef.Initialize(this.body, otherinst.extra.box2dbody, b2Vec2.Get(myx * worldScale, myy * worldScale));
		jointDef.enableLimit = true;
		jointDef.lowerAngle = cr.to_radians(lower);
		jointDef.upperAngle = cr.to_radians(upper);
		this.myJoints.push(this.world.CreateJoint(jointDef));
	};
	Acts.prototype.SetWorldGravity = function (g)
	{
		if (g === this.behavior.worldG)
			return;
		this.world.SetGravity(b2Vec2.Get(0, g));
		this.behavior.worldG = g;
		var i, len, arr = this.behavior.my_instances.valuesRef();
		for (i = 0, len = arr.length; i < len; i++)
		{
			if (arr[i].extra.box2dbody)
				arr[i].extra.box2dbody.SetAwake(true);
		}
	};
	Acts.prototype.SetSteppingMode = function (mode)
	{
		this.behavior.steppingMode = mode;
	};
	Acts.prototype.SetIterations = function (vel, pos)
	{
		if (vel < 1) vel = 1;
		if (pos < 1) pos = 1;
		this.behavior.velocityIterations = vel;
		this.behavior.positionIterations = pos;
	};
	Acts.prototype.SetVelocity = function (vx, vy)
	{
		if (!this.enabled)
			return;
		this.body.SetLinearVelocity(b2Vec2.Get(vx * worldScale, vy * worldScale));
		this.body.SetAwake(true);
		this.lastTickOverride = false;
		this.lastKnownX = this.inst.x;
		this.lastKnownY = this.inst.y;
	};
	Acts.prototype.SetDensity = function (d)
	{
		if (!this.enabled)
			return;
		if (this.density === d)
			return;
		this.density = d;
		this.recreateBody = true;
	};
	Acts.prototype.SetFriction = function (f)
	{
		if (!this.enabled)
			return;
		if (this.friction === f)
			return;
		this.friction = f;
		this.recreateBody = true;
	};
	Acts.prototype.SetElasticity = function (e)
	{
		if (!this.enabled)
			return;
		if (this.restitution === e)
			return;
		this.restitution = e;
		this.recreateBody = true;
	};
	Acts.prototype.SetLinearDamping = function (ld)
	{
		if (!this.enabled)
			return;
		if (this.linearDamping === ld)
			return;
		this.linearDamping = ld;
		this.body.SetLinearDamping(ld);
	};
	Acts.prototype.SetAngularDamping = function (ad)
	{
		if (!this.enabled)
			return;
		if (this.angularDamping === ad)
			return;
		this.angularDamping = ad;
		this.body.SetAngularDamping(ad);
	};
	Acts.prototype.SetImmovable = function (i)
	{
		if (!this.enabled)
			return;
		if (this.immovable === (i !== 0))
			return;
		this.immovable = (i !== 0);
		this.body.SetType(this.immovable ? 0 /*b2BodyDef.b2_staticBody*/ : 2 /*b2BodyDef.b2_dynamicBody*/);
		this.body.SetAwake(true);
	};
	function SetCollisionsEnabled(typeA, typeB, state)
	{
		var s;
		if (state)
		{
			s = typeA.extra["Physics_DisabledCollisions"];
			if (s)
				s.remove(typeB);
			s = typeB.extra["Physics_DisabledCollisions"];
			if (s)
				s.remove(typeA);
		}
		else
		{
			if (!typeA.extra["Physics_DisabledCollisions"])
				typeA.extra["Physics_DisabledCollisions"] = new cr.ObjectSet();
			typeA.extra["Physics_DisabledCollisions"].add(typeB);
			if (!typeB.extra["Physics_DisabledCollisions"])
				typeB.extra["Physics_DisabledCollisions"] = new cr.ObjectSet();
			typeB.extra["Physics_DisabledCollisions"].add(typeA);
		}
	};
	Acts.prototype.EnableCollisions = function (obj, state)
	{
		if (!obj || !this.enabled)
			return;
		var i, len;
		if (obj.is_family)
		{
			for (i = 0, len = obj.members.length; i < len; i++)
			{
				SetCollisionsEnabled(this.inst.type, obj.members[i], state !== 0);
			}
		}
		else
		{
			SetCollisionsEnabled(this.inst.type, obj, state !== 0);
		}
		this.behavior.allCollisionsEnabled = false;
	};
	Acts.prototype.SetPreventRotate = function (i)
	{
		if (!this.enabled)
			return;
		if (this.preventRotation === (i !== 0))
			return;
		this.preventRotation = (i !== 0);
		this.body.SetFixedRotation(this.preventRotation);
		this.body.m_torque = 0;
		this.body.SetAngularVelocity(0);
		this.body.SetAwake(true);
	};
	Acts.prototype.SetBullet = function (i)
	{
		if (!this.enabled)
			return;
		if (this.bullet === (i !== 0))
			return;
		this.bullet = (i !== 0);
		this.body.SetBullet(this.bullet);
		this.body.SetAwake(true);
	};
	Acts.prototype.RemoveJoints = function ()
	{
		if (!this.enabled)
			return;
		this.destroyMyJoints();
		this.myCreatedJoints.length = 0;
		this.joiningMe.clear();
	};
	Acts.prototype.SetEnabled = function (e)
	{
		if (this.enabled && e === 0)
		{
			this.destroyBody();
			this.enabled = false;
		}
		else if (!this.enabled && e === 1)
		{
			this.enabled = true;
			this.createBody();
		}
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.VelocityX = function (ret)
	{
		ret.set_float(this.enabled ? this.body.GetLinearVelocity().x / worldScale : 0);
	};
	Exps.prototype.VelocityY = function (ret)
	{
		ret.set_float(this.enabled ? this.body.GetLinearVelocity().y / worldScale : 0);
	};
	Exps.prototype.AngularVelocity = function (ret)
	{
		ret.set_float(this.enabled ? cr.to_degrees(this.body.GetAngularVelocity()) : 0);
	};
	Exps.prototype.Mass = function (ret)
	{
		ret.set_float(this.enabled ? this.body.GetMass() / worldScale : 0);
	};
	Exps.prototype.CenterOfMassX = function (ret)
	{
		ret.set_float(this.enabled ? (this.body.GetPosition().x + this.body.GetLocalCenter().x) / worldScale : 0);
	};
	Exps.prototype.CenterOfMassY = function (ret)
	{
		ret.set_float(this.enabled ? (this.body.GetPosition().y + this.body.GetLocalCenter().y) / worldScale : 0);
	};
	Exps.prototype.Density = function (ret)
	{
		ret.set_float(this.enabled ? this.density : 0);
	};
	Exps.prototype.Friction = function (ret)
	{
		ret.set_float(this.enabled ? this.friction : 0);
	};
	Exps.prototype.Elasticity = function (ret)
	{
		ret.set_float(this.enabled ? this.restitution : 0);
	};
	Exps.prototype.LinearDamping = function (ret)
	{
		ret.set_float(this.enabled ? this.linearDamping : 0);
	};
	Exps.prototype.AngularDamping = function (ret)
	{
		ret.set_float(this.enabled ? this.angularDamping : 0);
	};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.Platform = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.Platform.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	var ANIMMODE_STOPPED = 0;
	var ANIMMODE_MOVING = 1;
	var ANIMMODE_JUMPING = 2;
	var ANIMMODE_FALLING = 3;
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
		this.leftkey = false;
		this.rightkey = false;
		this.jumpkey = false;
		this.jumped = false;			// prevent bunnyhopping
		this.doubleJumped = false;
		this.canDoubleJump = false;
		this.ignoreInput = false;
		this.simleft = false;
		this.simright = false;
		this.simjump = false;
		this.lastFloorObject = null;
		this.loadFloorObject = -1;
		this.lastFloorX = 0;
		this.lastFloorY = 0;
		this.floorIsJumpthru = false;
		this.animMode = ANIMMODE_STOPPED;
		this.fallthrough = 0;			// fall through jump-thru.  >0 to disable, lasts a few ticks
		this.firstTick = true;
		this.dx = 0;
		this.dy = 0;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.updateGravity = function()
	{
		this.downx = Math.cos(this.ga);
		this.downy = Math.sin(this.ga);
		this.rightx = Math.cos(this.ga - Math.PI / 2);
		this.righty = Math.sin(this.ga - Math.PI / 2);
		this.downx = cr.round6dp(this.downx);
		this.downy = cr.round6dp(this.downy);
		this.rightx = cr.round6dp(this.rightx);
		this.righty = cr.round6dp(this.righty);
		this.g1 = this.g;
		if (this.g < 0)
		{
			this.downx *= -1;
			this.downy *= -1;
			this.g = Math.abs(this.g);
		}
	};
	behinstProto.onCreate = function()
	{
		this.maxspeed = this.properties[0];
		this.acc = this.properties[1];
		this.dec = this.properties[2];
		this.jumpStrength = this.properties[3];
		this.g = this.properties[4];
		this.g1 = this.g;
		this.maxFall = this.properties[5];
		this.enableDoubleJump = (this.properties[6] !== 0);	// 0=disabled, 1=enabled
		this.jumpSustain = (this.properties[7] / 1000);		// convert ms to s
		this.defaultControls = (this.properties[8] === 1);	// 0=no, 1=yes
		this.enabled = (this.properties[9] !== 0);
		this.wasOnFloor = false;
		this.wasOverJumpthru = this.runtime.testOverlapJumpThru(this.inst);
		this.loadOverJumpthru = -1;
		this.sustainTime = 0;				// time of jump sustain remaining
		this.ga = cr.to_radians(90);
		this.updateGravity();
		var self = this;
		if (this.defaultControls && !this.runtime.isDomFree)
		{
			jQuery(document).keydown(function(info) {
						self.onKeyDown(info);
					});
			jQuery(document).keyup(function(info) {
						self.onKeyUp(info);
					});
		}
		if (!this.recycled)
		{
			this.myDestroyCallback = function(inst) {
										self.onInstanceDestroyed(inst);
									};
		}
		this.runtime.addDestroyCallback(this.myDestroyCallback);
		this.inst.extra["isPlatformBehavior"] = true;
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"ii": this.ignoreInput,
			"lfx": this.lastFloorX,
			"lfy": this.lastFloorY,
			"lfo": (this.lastFloorObject ? this.lastFloorObject.uid : -1),
			"am": this.animMode,
			"en": this.enabled,
			"fall": this.fallthrough,
			"ft": this.firstTick,
			"dx": this.dx,
			"dy": this.dy,
			"ms": this.maxspeed,
			"acc": this.acc,
			"dec": this.dec,
			"js": this.jumpStrength,
			"g": this.g,
			"g1": this.g1,
			"mf": this.maxFall,
			"wof": this.wasOnFloor,
			"woj": (this.wasOverJumpthru ? this.wasOverJumpthru.uid : -1),
			"ga": this.ga,
			"edj": this.enableDoubleJump,
			"cdj": this.canDoubleJump,
			"dj": this.doubleJumped,
			"sus": this.jumpSustain
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.ignoreInput = o["ii"];
		this.lastFloorX = o["lfx"];
		this.lastFloorY = o["lfy"];
		this.loadFloorObject = o["lfo"];
		this.animMode = o["am"];
		this.enabled = o["en"];
		this.fallthrough = o["fall"];
		this.firstTick = o["ft"];
		this.dx = o["dx"];
		this.dy = o["dy"];
		this.maxspeed = o["ms"];
		this.acc = o["acc"];
		this.dec = o["dec"];
		this.jumpStrength = o["js"];
		this.g = o["g"];
		this.g1 = o["g1"];
		this.maxFall = o["mf"];
		this.wasOnFloor = o["wof"];
		this.loadOverJumpthru = o["woj"];
		this.ga = o["ga"];
		this.enableDoubleJump = o["edj"];
		this.canDoubleJump = o["cdj"];
		this.doubleJumped = o["dj"];
		this.jumpSustain = o["sus"];
		this.leftkey = false;
		this.rightkey = false;
		this.jumpkey = false;
		this.jumped = false;
		this.simleft = false;
		this.simright = false;
		this.simjump = false;
		this.sustainTime = 0;
		this.updateGravity();
	};
	behinstProto.afterLoad = function ()
	{
		if (this.loadFloorObject === -1)
			this.lastFloorObject = null;
		else
			this.lastFloorObject = this.runtime.getObjectByUID(this.loadFloorObject);
		if (this.loadOverJumpthru === -1)
			this.wasOverJumpthru = null;
		else
			this.wasOverJumpthru = this.runtime.getObjectByUID(this.loadOverJumpthru);
	};
	behinstProto.onInstanceDestroyed = function (inst)
	{
		if (this.lastFloorObject == inst)
			this.lastFloorObject = null;
	};
	behinstProto.onDestroy = function ()
	{
		this.lastFloorObject = null;
		this.runtime.removeDestroyCallback(this.myDestroyCallback);
	};
	behinstProto.onKeyDown = function (info)
	{
		switch (info.which) {
		case 38:	// up
			info.preventDefault();
			this.jumpkey = true;
			break;
		case 37:	// left
			info.preventDefault();
			this.leftkey = true;
			break;
		case 39:	// right
			info.preventDefault();
			this.rightkey = true;
			break;
		}
	};
	behinstProto.onKeyUp = function (info)
	{
		switch (info.which) {
		case 38:	// up
			info.preventDefault();
			this.jumpkey = false;
			this.jumped = false;
			break;
		case 37:	// left
			info.preventDefault();
			this.leftkey = false;
			break;
		case 39:	// right
			info.preventDefault();
			this.rightkey = false;
			break;
		}
	};
	behinstProto.onWindowBlur = function ()
	{
		this.leftkey = false;
		this.rightkey = false;
		this.jumpkey = false;
	};
	behinstProto.getGDir = function ()
	{
		if (this.g < 0)
			return -1;
		else
			return 1;
	};
	behinstProto.isOnFloor = function ()
	{
		var ret = null;
		var ret2 = null;
		var i, len, j;
		var oldx = this.inst.x;
		var oldy = this.inst.y;
		this.inst.x += this.downx;
		this.inst.y += this.downy;
		this.inst.set_bbox_changed();
		if (this.lastFloorObject && this.runtime.testOverlap(this.inst, this.lastFloorObject))
		{
			this.inst.x = oldx;
			this.inst.y = oldy;
			this.inst.set_bbox_changed();
			return this.lastFloorObject;
		}
		else
		{
			ret = this.runtime.testOverlapSolid(this.inst);
			if (!ret && this.fallthrough === 0)
				ret2 = this.runtime.testOverlapJumpThru(this.inst, true);
			this.inst.x = oldx;
			this.inst.y = oldy;
			this.inst.set_bbox_changed();
			if (ret)		// was overlapping solid
			{
				if (this.runtime.testOverlap(this.inst, ret))
					return null;
				else
				{
					this.floorIsJumpthru = false;
					return ret;
				}
			}
			if (ret2 && ret2.length)
			{
				for (i = 0, j = 0, len = ret2.length; i < len; i++)
				{
					ret2[j] = ret2[i];
					if (!this.runtime.testOverlap(this.inst, ret2[i]))
						j++;
				}
				if (j >= 1)
				{
					this.floorIsJumpthru = true;
					return ret2[0];
				}
			}
			return null;
		}
	};
	behinstProto.tick = function ()
	{
	};
	behinstProto.posttick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		var mx, my, obstacle, mag, allover, i, len, j, oldx, oldy;
		if (!this.jumpkey && !this.simjump)
			this.jumped = false;
		var left = this.leftkey || this.simleft;
		var right = this.rightkey || this.simright;
		var jumpkey = (this.jumpkey || this.simjump);
		var jump = jumpkey && !this.jumped;
		this.simleft = false;
		this.simright = false;
		this.simjump = false;
		if (!this.enabled)
			return;
		if (this.ignoreInput)
		{
			left = false;
			right = false;
			jumpkey = false;
			jump = false;
		}
		if (!jumpkey)
			this.sustainTime = 0;
		var lastFloor = this.lastFloorObject;
		var floor_moved = false;
		if (this.firstTick)
		{
			if (this.runtime.testOverlapSolid(this.inst) || this.runtime.testOverlapJumpThru(this.inst))
			{
				this.runtime.pushOutSolid(this.inst, -this.downx, -this.downy, 4, true);
			}
			this.firstTick = false;
		}
		if (lastFloor && this.dy === 0 && (lastFloor.y !== this.lastFloorY || lastFloor.x !== this.lastFloorX))
		{
			mx = (lastFloor.x - this.lastFloorX);
			my = (lastFloor.y - this.lastFloorY);
			this.inst.x += mx;
			this.inst.y += my;
			this.inst.set_bbox_changed();
			this.lastFloorX = lastFloor.x;
			this.lastFloorY = lastFloor.y;
			floor_moved = true;
			if (this.runtime.testOverlapSolid(this.inst))
			{
				this.runtime.pushOutSolid(this.inst, -mx, -my, Math.sqrt(mx * mx + my * my) * 2.5);
			}
		}
		var floor_ = this.isOnFloor();
		var collobj = this.runtime.testOverlapSolid(this.inst);
		if (collobj)
		{
			if (this.inst.extra["inputPredicted"])
			{
				this.runtime.pushOutSolid(this.inst, -this.downx, -this.downy, 10, false);
			}
			else if (this.runtime.pushOutSolidNearest(this.inst, Math.max(this.inst.width, this.inst.height) / 2))
			{
				this.runtime.registerCollision(this.inst, collobj);
			}
			else
				return;
		}
		if (floor_)
		{
			this.doubleJumped = false;		// reset double jump flags for next jump
			this.canDoubleJump = false;
			if (this.dy > 0)
			{
				if (!this.wasOnFloor)
				{
					this.runtime.pushInFractional(this.inst, -this.downx, -this.downy, floor_, 16);
					this.wasOnFloor = true;
				}
				this.dy = 0;
			}
			if (lastFloor != floor_)
			{
				this.lastFloorObject = floor_;
				this.lastFloorX = floor_.x;
				this.lastFloorY = floor_.y;
				this.runtime.registerCollision(this.inst, floor_);
			}
			else if (floor_moved)
			{
				collobj = this.runtime.testOverlapSolid(this.inst);
				if (collobj)
				{
					this.runtime.registerCollision(this.inst, collobj);
					if (mx !== 0)
					{
						if (mx > 0)
							this.runtime.pushOutSolid(this.inst, -this.rightx, -this.righty);
						else
							this.runtime.pushOutSolid(this.inst, this.rightx, this.righty);
					}
					this.runtime.pushOutSolid(this.inst, -this.downx, -this.downy);
				}
			}
		}
		else
		{
			if (!jumpkey)
				this.canDoubleJump = true;
		}
		if ((floor_ && jump) || (!floor_ && this.enableDoubleJump && jumpkey && this.canDoubleJump && !this.doubleJumped))
		{
			oldx = this.inst.x;
			oldy = this.inst.y;
			this.inst.x -= this.downx;
			this.inst.y -= this.downy;
			this.inst.set_bbox_changed();
			if (!this.runtime.testOverlapSolid(this.inst))
			{
				this.sustainTime = this.jumpSustain;
				this.runtime.trigger(cr.behaviors.Platform.prototype.cnds.OnJump, this.inst);
				this.animMode = ANIMMODE_JUMPING;
				this.dy = -this.jumpStrength;
				jump = true;		// set in case is double jump
				if (floor_)
					this.jumped = true;
				else
					this.doubleJumped = true;
			}
			else
				jump = false;
			this.inst.x = oldx;
			this.inst.y = oldy;
			this.inst.set_bbox_changed();
		}
		if (!floor_)
		{
			if (jumpkey && this.sustainTime > 0)
			{
				this.dy = -this.jumpStrength;
				this.sustainTime -= dt;
			}
			else
			{
				this.lastFloorObject = null;
				this.dy += this.g * dt;
				if (this.dy > this.maxFall)
					this.dy = this.maxFall;
			}
			if (jump)
				this.jumped = true;
		}
		this.wasOnFloor = !!floor_;
		if (left == right)	// both up or both down
		{
			if (this.dx < 0)
			{
				this.dx += this.dec * dt;
				if (this.dx > 0)
					this.dx = 0;
			}
			else if (this.dx > 0)
			{
				this.dx -= this.dec * dt;
				if (this.dx < 0)
					this.dx = 0;
			}
		}
		if (left && !right)
		{
			if (this.dx > 0)
				this.dx -= (this.acc + this.dec) * dt;
			else
				this.dx -= this.acc * dt;
		}
		if (right && !left)
		{
			if (this.dx < 0)
				this.dx += (this.acc + this.dec) * dt;
			else
				this.dx += this.acc * dt;
		}
		if (this.dx > this.maxspeed)
			this.dx = this.maxspeed;
		else if (this.dx < -this.maxspeed)
			this.dx = -this.maxspeed;
		var landed = false;
		if (this.dx !== 0)
		{
			oldx = this.inst.x;
			oldy = this.inst.y;
			mx = this.dx * dt * this.rightx;
			my = this.dx * dt * this.righty;
			this.inst.x += this.rightx * (this.dx > 1 ? 1 : -1) - this.downx;
			this.inst.y += this.righty * (this.dx > 1 ? 1 : -1) - this.downy;
			this.inst.set_bbox_changed();
			var is_jumpthru = false;
			var slope_too_steep = this.runtime.testOverlapSolid(this.inst);
			/*
			if (!slope_too_steep && floor_)
			{
				slope_too_steep = this.runtime.testOverlapJumpThru(this.inst);
				is_jumpthru = true;
				if (slope_too_steep)
				{
					this.inst.x = oldx;
					this.inst.y = oldy;
					this.inst.set_bbox_changed();
					if (this.runtime.testOverlap(this.inst, slope_too_steep))
					{
						slope_too_steep = null;
						is_jumpthru = false;
					}
				}
			}
			*/
			this.inst.x = oldx + mx;
			this.inst.y = oldy + my;
			this.inst.set_bbox_changed();
			obstacle = this.runtime.testOverlapSolid(this.inst);
			if (!obstacle && floor_)
			{
				obstacle = this.runtime.testOverlapJumpThru(this.inst);
				if (obstacle)
				{
					this.inst.x = oldx;
					this.inst.y = oldy;
					this.inst.set_bbox_changed();
					if (this.runtime.testOverlap(this.inst, obstacle))
					{
						obstacle = null;
						is_jumpthru = false;
					}
					else
						is_jumpthru = true;
					this.inst.x = oldx + mx;
					this.inst.y = oldy + my;
					this.inst.set_bbox_changed();
				}
			}
			if (obstacle)
			{
				var push_dist = Math.abs(this.dx * dt) + 2;
				if (slope_too_steep || !this.runtime.pushOutSolid(this.inst, -this.downx, -this.downy, push_dist, is_jumpthru, obstacle))
				{
					this.runtime.registerCollision(this.inst, obstacle);
					push_dist = Math.max(Math.abs(this.dx * dt * 2.5), 30);
					if (!this.runtime.pushOutSolid(this.inst, this.rightx * (this.dx < 0 ? 1 : -1), this.righty * (this.dx < 0 ? 1 : -1), push_dist, false))
					{
						this.inst.x = oldx;
						this.inst.y = oldy;
						this.inst.set_bbox_changed();
					}
					else if (floor_ && !is_jumpthru && !this.floorIsJumpthru)
					{
						oldx = this.inst.x;
						oldy = this.inst.y;
						this.inst.x += this.downx;
						this.inst.y += this.downy;
						if (this.runtime.testOverlapSolid(this.inst))
						{
							if (!this.runtime.pushOutSolid(this.inst, -this.downx, -this.downy, 3, false))
							{
								this.inst.x = oldx;
								this.inst.y = oldy;
								this.inst.set_bbox_changed();
							}
						}
						else
						{
							this.inst.x = oldx;
							this.inst.y = oldy;
							this.inst.set_bbox_changed();
						}
					}
					if (!is_jumpthru)
						this.dx = 0;	// stop
				}
				else if (!slope_too_steep && !jump && (Math.abs(this.dy) < Math.abs(this.jumpStrength / 4)))
				{
					this.dy = 0;
					if (!floor_)
						landed = true;
				}
			}
			else
			{
				var newfloor = this.isOnFloor();
				if (floor_ && !newfloor)
				{
					mag = Math.ceil(Math.abs(this.dx * dt)) + 2;
					oldx = this.inst.x;
					oldy = this.inst.y;
					this.inst.x += this.downx * mag;
					this.inst.y += this.downy * mag;
					this.inst.set_bbox_changed();
					if (this.runtime.testOverlapSolid(this.inst) || this.runtime.testOverlapJumpThru(this.inst))
						this.runtime.pushOutSolid(this.inst, -this.downx, -this.downy, mag + 2, true);
					else
					{
						this.inst.x = oldx;
						this.inst.y = oldy;
						this.inst.set_bbox_changed();
					}
				}
				else if (newfloor && this.dy === 0)
				{
					this.runtime.pushInFractional(this.inst, -this.downx, -this.downy, newfloor, 16);
				}
			}
		}
		if (this.dy !== 0)
		{
			oldx = this.inst.x;
			oldy = this.inst.y;
			this.inst.x += this.dy * dt * this.downx;
			this.inst.y += this.dy * dt * this.downy;
			var newx = this.inst.x;
			var newy = this.inst.y;
			this.inst.set_bbox_changed();
			collobj = this.runtime.testOverlapSolid(this.inst);
			var fell_on_jumpthru = false;
			if (!collobj && (this.dy > 0) && !floor_)
			{
				allover = this.fallthrough > 0 ? null : this.runtime.testOverlapJumpThru(this.inst, true);
				if (allover && allover.length)
				{
					if (this.wasOverJumpthru)
					{
						this.inst.x = oldx;
						this.inst.y = oldy;
						this.inst.set_bbox_changed();
						for (i = 0, j = 0, len = allover.length; i < len; i++)
						{
							allover[j] = allover[i];
							if (!this.runtime.testOverlap(this.inst, allover[i]))
								j++;
						}
						allover.length = j;
						this.inst.x = newx;
						this.inst.y = newy;
						this.inst.set_bbox_changed();
					}
					if (allover.length >= 1)
						collobj = allover[0];
				}
				fell_on_jumpthru = !!collobj;
			}
			if (collobj)
			{
				this.runtime.registerCollision(this.inst, collobj);
				this.sustainTime = 0;
				var push_dist = (fell_on_jumpthru ? Math.abs(this.dy * dt * 2.5 + 10) : Math.max(Math.abs(this.dy * dt * 2.5 + 10), 30));
				if (!this.runtime.pushOutSolid(this.inst, this.downx * (this.dy < 0 ? 1 : -1), this.downy * (this.dy < 0 ? 1 : -1), push_dist, fell_on_jumpthru, collobj))
				{
					this.inst.x = oldx;
					this.inst.y = oldy;
					this.inst.set_bbox_changed();
					this.wasOnFloor = true;		// prevent adjustment for unexpected floor landings
					if (!fell_on_jumpthru)
						this.dy = 0;	// stop
				}
				else
				{
					this.lastFloorObject = collobj;
					this.lastFloorX = collobj.x;
					this.lastFloorY = collobj.y;
					this.floorIsJumpthru = fell_on_jumpthru;
					if (fell_on_jumpthru)
						landed = true;
					this.dy = 0;	// stop
				}
			}
		}
		if (this.animMode !== ANIMMODE_FALLING && this.dy > 0 && !floor_)
		{
			this.runtime.trigger(cr.behaviors.Platform.prototype.cnds.OnFall, this.inst);
			this.animMode = ANIMMODE_FALLING;
		}
		if (floor_ || landed)
		{
			if (this.animMode === ANIMMODE_FALLING || landed || (jump && this.dy === 0))
			{
				this.runtime.trigger(cr.behaviors.Platform.prototype.cnds.OnLand, this.inst);
				if (this.dx === 0 && this.dy === 0)
					this.animMode = ANIMMODE_STOPPED;
				else
					this.animMode = ANIMMODE_MOVING;
			}
			else
			{
				if (this.animMode !== ANIMMODE_STOPPED && this.dx === 0 && this.dy === 0)
				{
					this.runtime.trigger(cr.behaviors.Platform.prototype.cnds.OnStop, this.inst);
					this.animMode = ANIMMODE_STOPPED;
				}
				if (this.animMode !== ANIMMODE_MOVING && (this.dx !== 0 || this.dy !== 0) && !jump)
				{
					this.runtime.trigger(cr.behaviors.Platform.prototype.cnds.OnMove, this.inst);
					this.animMode = ANIMMODE_MOVING;
				}
			}
		}
		if (this.fallthrough > 0)
			this.fallthrough--;
		this.wasOverJumpthru = this.runtime.testOverlapJumpThru(this.inst);
	};
	function Cnds() {};
	Cnds.prototype.IsMoving = function ()
	{
		return this.dx !== 0 || this.dy !== 0;
	};
	Cnds.prototype.CompareSpeed = function (cmp, s)
	{
		var speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
		return cr.do_cmp(speed, cmp, s);
	};
	Cnds.prototype.IsOnFloor = function ()
	{
		if (this.dy !== 0)
			return false;
		var ret = null;
		var ret2 = null;
		var i, len, j;
		var oldx = this.inst.x;
		var oldy = this.inst.y;
		this.inst.x += this.downx;
		this.inst.y += this.downy;
		this.inst.set_bbox_changed();
		ret = this.runtime.testOverlapSolid(this.inst);
		if (!ret && this.fallthrough === 0)
			ret2 = this.runtime.testOverlapJumpThru(this.inst, true);
		this.inst.x = oldx;
		this.inst.y = oldy;
		this.inst.set_bbox_changed();
		if (ret)		// was overlapping solid
		{
			return !this.runtime.testOverlap(this.inst, ret);
		}
		if (ret2 && ret2.length)
		{
			for (i = 0, j = 0, len = ret2.length; i < len; i++)
			{
				ret2[j] = ret2[i];
				if (!this.runtime.testOverlap(this.inst, ret2[i]))
					j++;
			}
			if (j >= 1)
				return true;
		}
		return false;
	};
	Cnds.prototype.IsByWall = function (side)
	{
		var ret = false;
		var oldx = this.inst.x;
		var oldy = this.inst.y;
		this.inst.x -= this.downx * 3;
		this.inst.y -= this.downy * 3;
		this.inst.set_bbox_changed();
		if (this.runtime.testOverlapSolid(this.inst))
		{
			this.inst.x = oldx;
			this.inst.y = oldy;
			this.inst.set_bbox_changed();
			return false;
		}
		if (side === 0)		// left
		{
			this.inst.x -= this.rightx * 2;
			this.inst.y -= this.righty * 2;
		}
		else
		{
			this.inst.x += this.rightx * 2;
			this.inst.y += this.righty * 2;
		}
		this.inst.set_bbox_changed();
		ret = this.runtime.testOverlapSolid(this.inst);
		this.inst.x = oldx;
		this.inst.y = oldy;
		this.inst.set_bbox_changed();
		return ret;
	};
	Cnds.prototype.IsJumping = function ()
	{
		return this.dy < 0;
	};
	Cnds.prototype.IsFalling = function ()
	{
		return this.dy > 0;
	};
	Cnds.prototype.OnJump = function ()
	{
		return true;
	};
	Cnds.prototype.OnFall = function ()
	{
		return true;
	};
	Cnds.prototype.OnStop = function ()
	{
		return true;
	};
	Cnds.prototype.OnMove = function ()
	{
		return true;
	};
	Cnds.prototype.OnLand = function ()
	{
		return true;
	};
	Cnds.prototype.IsDoubleJumpEnabled = function ()
	{
		return this.enableDoubleJump;
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetIgnoreInput = function (ignoring)
	{
		this.ignoreInput = ignoring;
	};
	Acts.prototype.SetMaxSpeed = function (maxspeed)
	{
		this.maxspeed = maxspeed;
		if (this.maxspeed < 0)
			this.maxspeed = 0;
	};
	Acts.prototype.SetAcceleration = function (acc)
	{
		this.acc = acc;
		if (this.acc < 0)
			this.acc = 0;
	};
	Acts.prototype.SetDeceleration = function (dec)
	{
		this.dec = dec;
		if (this.dec < 0)
			this.dec = 0;
	};
	Acts.prototype.SetJumpStrength = function (js)
	{
		this.jumpStrength = js;
		if (this.jumpStrength < 0)
			this.jumpStrength = 0;
	};
	Acts.prototype.SetGravity = function (grav)
	{
		if (this.g1 === grav)
			return;		// no change
		this.g = grav;
		this.updateGravity();
		if (this.runtime.testOverlapSolid(this.inst))
		{
			this.runtime.pushOutSolid(this.inst, this.downx, this.downy, 10);
			this.inst.x += this.downx * 2;
			this.inst.y += this.downy * 2;
			this.inst.set_bbox_changed();
		}
		this.lastFloorObject = null;
	};
	Acts.prototype.SetMaxFallSpeed = function (mfs)
	{
		this.maxFall = mfs;
		if (this.maxFall < 0)
			this.maxFall = 0;
	};
	Acts.prototype.SimulateControl = function (ctrl)
	{
		switch (ctrl) {
		case 0:		this.simleft = true;	break;
		case 1:		this.simright = true;	break;
		case 2:		this.simjump = true;	break;
		}
	};
	Acts.prototype.SetVectorX = function (vx)
	{
		this.dx = vx;
	};
	Acts.prototype.SetVectorY = function (vy)
	{
		this.dy = vy;
	};
	Acts.prototype.SetGravityAngle = function (a)
	{
		a = cr.to_radians(a);
		a = cr.clamp_angle(a);
		if (this.ga === a)
			return;		// no change
		this.ga = a;
		this.updateGravity();
		this.lastFloorObject = null;
	};
	Acts.prototype.SetEnabled = function (en)
	{
		if (this.enabled !== (en === 1))
		{
			this.enabled = (en === 1);
			if (!this.enabled)
				this.lastFloorObject = null;
		}
	};
	Acts.prototype.FallThrough = function ()
	{
		var oldx = this.inst.x;
		var oldy = this.inst.y;
		this.inst.x += this.downx;
		this.inst.y += this.downy;
		this.inst.set_bbox_changed();
		var overlaps = this.runtime.testOverlapJumpThru(this.inst, false);
		this.inst.x = oldx;
		this.inst.y = oldy;
		this.inst.set_bbox_changed();
		if (!overlaps)
			return;
		this.fallthrough = 3;			// disable jumpthrus for 3 ticks (1 doesn't do it, 2 does, 3 to be on safe side)
		this.lastFloorObject = null;
	};
	Acts.prototype.SetDoubleJumpEnabled = function (e)
	{
		this.enableDoubleJump = (e !== 0);
	};
	Acts.prototype.SetJumpSustain = function (s)
	{
		this.jumpSustain = s / 1000;		// convert to ms
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.Speed = function (ret)
	{
		ret.set_float(Math.sqrt(this.dx * this.dx + this.dy * this.dy));
	};
	Exps.prototype.MaxSpeed = function (ret)
	{
		ret.set_float(this.maxspeed);
	};
	Exps.prototype.Acceleration = function (ret)
	{
		ret.set_float(this.acc);
	};
	Exps.prototype.Deceleration = function (ret)
	{
		ret.set_float(this.dec);
	};
	Exps.prototype.JumpStrength = function (ret)
	{
		ret.set_float(this.jumpStrength);
	};
	Exps.prototype.Gravity = function (ret)
	{
		ret.set_float(this.g);
	};
	Exps.prototype.GravityAngle = function (ret)
	{
		ret.set_float(cr.to_degrees(this.ga));
	};
	Exps.prototype.MaxFallSpeed = function (ret)
	{
		ret.set_float(this.maxFall);
	};
	Exps.prototype.MovingAngle = function (ret)
	{
		ret.set_float(cr.to_degrees(Math.atan2(this.dy, this.dx)));
	};
	Exps.prototype.VectorX = function (ret)
	{
		ret.set_float(this.dx);
	};
	Exps.prototype.VectorY = function (ret)
	{
		ret.set_float(this.dy);
	};
	Exps.prototype.JumpSustain = function (ret)
	{
		ret.set_float(this.jumpSustain * 1000);		// convert back to ms
	};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.Sin = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.Sin.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
		this.i = 0;		// period offset (radians)
	};
	var behinstProto = behaviorProto.Instance.prototype;
	var _2pi = 2 * Math.PI;
	var _pi_2 = Math.PI / 2;
	var _3pi_2 = (3 * Math.PI) / 2;
	behinstProto.onCreate = function()
	{
		this.active = (this.properties[0] === 1);
		this.movement = this.properties[1]; // 0=Horizontal|1=Vertical|2=Size|3=Width|4=Height|5=Angle|6=Opacity|7=Value only
		this.wave = this.properties[2];		// 0=Sine|1=Triangle|2=Sawtooth|3=Reverse sawtooth|4=Square
		this.period = this.properties[3];
		this.period += Math.random() * this.properties[4];								// period random
		if (this.period === 0)
			this.i = 0;
		else
		{
			this.i = (this.properties[5] / this.period) * _2pi;								// period offset
			this.i += ((Math.random() * this.properties[6]) / this.period) * _2pi;			// period offset random
		}
		this.mag = this.properties[7];													// magnitude
		this.mag += Math.random() * this.properties[8];									// magnitude random
		this.initialValue = 0;
		this.initialValue2 = 0;
		this.ratio = 0;
		this.init();
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"i": this.i,
			"a": this.active,
			"mv": this.movement,
			"w": this.wave,
			"p": this.period,
			"mag": this.mag,
			"iv": this.initialValue,
			"iv2": this.initialValue2,
			"r": this.ratio,
			"lkv": this.lastKnownValue,
			"lkv2": this.lastKnownValue2
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.i = o["i"];
		this.active = o["a"];
		this.movement = o["mv"];
		this.wave = o["w"];
		this.period = o["p"];
		this.mag = o["mag"];
		this.initialValue = o["iv"];
		this.initialValue2 = o["iv2"] || 0;
		this.ratio = o["r"];
		this.lastKnownValue = o["lkv"];
		this.lastKnownValue2 = o["lkv2"] || 0;
	};
	behinstProto.init = function ()
	{
		switch (this.movement) {
		case 0:		// horizontal
			this.initialValue = this.inst.x;
			break;
		case 1:		// vertical
			this.initialValue = this.inst.y;
			break;
		case 2:		// size
			this.initialValue = this.inst.width;
			this.ratio = this.inst.height / this.inst.width;
			break;
		case 3:		// width
			this.initialValue = this.inst.width;
			break;
		case 4:		// height
			this.initialValue = this.inst.height;
			break;
		case 5:		// angle
			this.initialValue = this.inst.angle;
			this.mag = cr.to_radians(this.mag);		// convert magnitude from degrees to radians
			break;
		case 6:		// opacity
			this.initialValue = this.inst.opacity;
			break;
		case 7:
			this.initialValue = 0;
			break;
		case 8:		// forwards/backwards
			this.initialValue = this.inst.x;
			this.initialValue2 = this.inst.y;
			break;
		default:
;
		}
		this.lastKnownValue = this.initialValue;
		this.lastKnownValue2 = this.initialValue2;
	};
	behinstProto.waveFunc = function (x)
	{
		x = x % _2pi;
		switch (this.wave) {
		case 0:		// sine
			return Math.sin(x);
		case 1:		// triangle
			if (x <= _pi_2)
				return x / _pi_2;
			else if (x <= _3pi_2)
				return 1 - (2 * (x - _pi_2) / Math.PI);
			else
				return (x - _3pi_2) / _pi_2 - 1;
		case 2:		// sawtooth
			return 2 * x / _2pi - 1;
		case 3:		// reverse sawtooth
			return -2 * x / _2pi + 1;
		case 4:		// square
			return x < Math.PI ? -1 : 1;
		};
		return 0;
	};
	behinstProto.tick = function ()
	{
		var dt = this.runtime.getDt(this.inst);
		if (!this.active || dt === 0)
			return;
		if (this.period === 0)
			this.i = 0;
		else
		{
			this.i += (dt / this.period) * _2pi;
			this.i = this.i % _2pi;
		}
		switch (this.movement) {
		case 0:		// horizontal
			if (this.inst.x !== this.lastKnownValue)
				this.initialValue += this.inst.x - this.lastKnownValue;
			this.inst.x = this.initialValue + this.waveFunc(this.i) * this.mag;
			this.lastKnownValue = this.inst.x;
			break;
		case 1:		// vertical
			if (this.inst.y !== this.lastKnownValue)
				this.initialValue += this.inst.y - this.lastKnownValue;
			this.inst.y = this.initialValue + this.waveFunc(this.i) * this.mag;
			this.lastKnownValue = this.inst.y;
			break;
		case 2:		// size
			this.inst.width = this.initialValue + this.waveFunc(this.i) * this.mag;
			this.inst.height = this.inst.width * this.ratio;
			break;
		case 3:		// width
			this.inst.width = this.initialValue + this.waveFunc(this.i) * this.mag;
			break;
		case 4:		// height
			this.inst.height = this.initialValue + this.waveFunc(this.i) * this.mag;
			break;
		case 5:		// angle
			if (this.inst.angle !== this.lastKnownValue)
				this.initialValue = cr.clamp_angle(this.initialValue + (this.inst.angle - this.lastKnownValue));
			this.inst.angle = cr.clamp_angle(this.initialValue + this.waveFunc(this.i) * this.mag);
			this.lastKnownValue = this.inst.angle;
			break;
		case 6:		// opacity
			this.inst.opacity = this.initialValue + (this.waveFunc(this.i) * this.mag) / 100;
			if (this.inst.opacity < 0)
				this.inst.opacity = 0;
			else if (this.inst.opacity > 1)
				this.inst.opacity = 1;
			break;
		case 8:		// forwards/backwards
			if (this.inst.x !== this.lastKnownValue)
				this.initialValue += this.inst.x - this.lastKnownValue;
			if (this.inst.y !== this.lastKnownValue2)
				this.initialValue2 += this.inst.y - this.lastKnownValue2;
			this.inst.x = this.initialValue + Math.cos(this.inst.angle) * this.waveFunc(this.i) * this.mag;
			this.inst.y = this.initialValue2 + Math.sin(this.inst.angle) * this.waveFunc(this.i) * this.mag;
			this.lastKnownValue = this.inst.x;
			this.lastKnownValue2 = this.inst.y;
			break;
		}
		this.inst.set_bbox_changed();
	};
	behinstProto.onSpriteFrameChanged = function (prev_frame, next_frame)
	{
		switch (this.movement) {
		case 2:	// size
			this.initialValue *= (next_frame.width / prev_frame.width);
			this.ratio = next_frame.height / next_frame.width;
			break;
		case 3:	// width
			this.initialValue *= (next_frame.width / prev_frame.width);
			break;
		case 4:	// height
			this.initialValue *= (next_frame.height / prev_frame.height);
			break;
		}
	};
	function Cnds() {};
	Cnds.prototype.IsActive = function ()
	{
		return this.active;
	};
	Cnds.prototype.CompareMovement = function (m)
	{
		return this.movement === m;
	};
	Cnds.prototype.ComparePeriod = function (cmp, v)
	{
		return cr.do_cmp(this.period, cmp, v);
	};
	Cnds.prototype.CompareMagnitude = function (cmp, v)
	{
		if (this.movement === 5)
			return cr.do_cmp(this.mag, cmp, cr.to_radians(v));
		else
			return cr.do_cmp(this.mag, cmp, v);
	};
	Cnds.prototype.CompareWave = function (w)
	{
		return this.wave === w;
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetActive = function (a)
	{
		this.active = (a === 1);
	};
	Acts.prototype.SetPeriod = function (x)
	{
		this.period = x;
	};
	Acts.prototype.SetMagnitude = function (x)
	{
		this.mag = x;
		if (this.movement === 5)	// angle
			this.mag = cr.to_radians(this.mag);
	};
	Acts.prototype.SetMovement = function (m)
	{
		if (this.movement === 5)
			this.mag = cr.to_degrees(this.mag);
		this.movement = m;
		this.init();
	};
	Acts.prototype.SetWave = function (w)
	{
		this.wave = w;
	};
	Acts.prototype.SetPhase = function (x)
	{
		this.i = (x * _2pi) % _2pi;
	};
	Acts.prototype.UpdateInitialState = function ()
	{
		this.init();
	};
	behaviorProto.acts = new Acts();
	function Exps() {};
	Exps.prototype.CyclePosition = function (ret)
	{
		ret.set_float(this.i / _2pi);
	};
	Exps.prototype.Period = function (ret)
	{
		ret.set_float(this.period);
	};
	Exps.prototype.Magnitude = function (ret)
	{
		if (this.movement === 5)	// angle
			ret.set_float(cr.to_degrees(this.mag));
		else
			ret.set_float(this.mag);
	};
	Exps.prototype.Value = function (ret)
	{
		ret.set_float(this.waveFunc(this.i) * this.mag);
	};
	behaviorProto.exps = new Exps();
}());
;
;
cr.behaviors.scrollto = function(runtime)
{
	this.runtime = runtime;
	this.shakeMag = 0;
	this.shakeStart = 0;
	this.shakeEnd = 0;
	this.shakeMode = 0;
};
(function ()
{
	var behaviorProto = cr.behaviors.scrollto.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.enabled = (this.properties[0] !== 0);
	};
	behinstProto.saveToJSON = function ()
	{
		return {
			"smg": this.behavior.shakeMag,
			"ss": this.behavior.shakeStart,
			"se": this.behavior.shakeEnd,
			"smd": this.behavior.shakeMode
		};
	};
	behinstProto.loadFromJSON = function (o)
	{
		this.behavior.shakeMag = o["smg"];
		this.behavior.shakeStart = o["ss"];
		this.behavior.shakeEnd = o["se"];
		this.behavior.shakeMode = o["smd"];
	};
	behinstProto.tick = function ()
	{
	};
	function getScrollToBehavior(inst)
	{
		var i, len, binst;
		for (i = 0, len = inst.behavior_insts.length; i < len; ++i)
		{
			binst = inst.behavior_insts[i];
			if (binst.behavior instanceof cr.behaviors.scrollto)
				return binst;
		}
		return null;
	};
	behinstProto.tick2 = function ()
	{
		if (!this.enabled)
			return;
		var all = this.behavior.my_instances.valuesRef();
		var sumx = 0, sumy = 0;
		var i, len, binst, count = 0;
		for (i = 0, len = all.length; i < len; i++)
		{
			binst = getScrollToBehavior(all[i]);
			if (!binst || !binst.enabled)
				continue;
			sumx += all[i].x;
			sumy += all[i].y;
			++count;
		}
		var layout = this.inst.layer.layout;
		var now = this.runtime.kahanTime.sum;
		var offx = 0, offy = 0;
		if (now >= this.behavior.shakeStart && now < this.behavior.shakeEnd)
		{
			var mag = this.behavior.shakeMag * Math.min(this.runtime.timescale, 1);
			if (this.behavior.shakeMode === 0)
				mag *= 1 - (now - this.behavior.shakeStart) / (this.behavior.shakeEnd - this.behavior.shakeStart);
			var a = Math.random() * Math.PI * 2;
			var d = Math.random() * mag;
			offx = Math.cos(a) * d;
			offy = Math.sin(a) * d;
		}
		layout.scrollToX(sumx / count + offx);
		layout.scrollToY(sumy / count + offy);
	};
	function Acts() {};
	Acts.prototype.Shake = function (mag, dur, mode)
	{
		this.behavior.shakeMag = mag;
		this.behavior.shakeStart = this.runtime.kahanTime.sum;
		this.behavior.shakeEnd = this.behavior.shakeStart + dur;
		this.behavior.shakeMode = mode;
	};
	Acts.prototype.SetEnabled = function (e)
	{
		this.enabled = (e !== 0);
	};
	behaviorProto.acts = new Acts();
}());
;
;
cr.behaviors.solid = function(runtime)
{
	this.runtime = runtime;
};
(function ()
{
	var behaviorProto = cr.behaviors.solid.prototype;
	behaviorProto.Type = function(behavior, objtype)
	{
		this.behavior = behavior;
		this.objtype = objtype;
		this.runtime = behavior.runtime;
	};
	var behtypeProto = behaviorProto.Type.prototype;
	behtypeProto.onCreate = function()
	{
	};
	behaviorProto.Instance = function(type, inst)
	{
		this.type = type;
		this.behavior = type.behavior;
		this.inst = inst;				// associated object instance to modify
		this.runtime = type.runtime;
	};
	var behinstProto = behaviorProto.Instance.prototype;
	behinstProto.onCreate = function()
	{
		this.inst.extra["solidEnabled"] = (this.properties[0] !== 0);
	};
	behinstProto.tick = function ()
	{
	};
	function Cnds() {};
	Cnds.prototype.IsEnabled = function ()
	{
		return this.inst.extra["solidEnabled"];
	};
	behaviorProto.cnds = new Cnds();
	function Acts() {};
	Acts.prototype.SetEnabled = function (e)
	{
		this.inst.extra["solidEnabled"] = !!e;
	};
	behaviorProto.acts = new Acts();
}());
cr.getObjectRefTable = function () { return [
	cr.plugins_.c2canvas,
	cr.plugins_.Keyboard,
	cr.plugins_.Mouse,
	cr.plugins_.Text,
	cr.plugins_.Sprite,
	cr.plugins_.Touch,
	cr.behaviors.Sin,
	cr.behaviors.solid,
	cr.behaviors.Physics,
	cr.behaviors.scrollto,
	cr.behaviors.Platform,
	cr.system_object.prototype.cnds.EveryTick,
	cr.plugins_.Text.prototype.acts.SetText,
	cr.system_object.prototype.exps.fps,
	cr.plugins_.Keyboard.prototype.cnds.OnKey,
	cr.system_object.prototype.acts.GoToLayout,
	cr.system_object.prototype.cnds.OnLayoutStart,
	cr.plugins_.Sprite.prototype.acts.SetEffectEnabled,
	cr.plugins_.c2canvas.prototype.acts.SetPos,
	cr.plugins_.c2canvas.prototype.acts.SetSize,
	cr.system_object.prototype.exps.layoutwidth,
	cr.system_object.prototype.exps.layoutheight,
	cr.system_object.prototype.cnds.IsGroupActive,
	cr.plugins_.Sprite.prototype.acts.Destroy,
	cr.system_object.prototype.cnds.ForEach,
	cr.plugins_.Sprite.prototype.acts.SetInstanceVar,
	cr.system_object.prototype.exps.loopindex,
	cr.plugins_.Sprite.prototype.exps.Count,
	cr.system_object.prototype.exps.floor,
	cr.plugins_.Sprite.prototype.exps.Width,
	cr.plugins_.Sprite.prototype.acts.SetOpacity,
	cr.plugins_.Sprite.prototype.acts.SetPosToObject,
	cr.plugins_.Sprite.prototype.acts.SetSize,
	cr.plugins_.Sprite.prototype.exps.Height,
	cr.plugins_.Sprite.prototype.acts.ZMoveToObject,
	cr.plugins_.Sprite.prototype.acts.SetVisible,
	cr.system_object.prototype.cnds.For,
	cr.system_object.prototype.acts.CreateObject,
	cr.plugins_.Sprite.prototype.exps.LayerName,
	cr.plugins_.Sprite.prototype.exps.BBoxLeft,
	cr.plugins_.Sprite.prototype.exps.BBoxBottom,
	cr.plugins_.Sprite.prototype.acts.SetWidth,
	cr.plugins_.Sprite.prototype.acts.SetHeight,
	cr.behaviors.Sin.prototype.acts.SetMagnitude,
	cr.system_object.prototype.exps.random,
	cr.behaviors.Sin.prototype.acts.SetPeriod,
	cr.behaviors.Sin.prototype.acts.SetPhase,
	cr.behaviors.Sin.prototype.acts.SetMovement,
	cr.plugins_.c2canvas.prototype.acts.ClearCanvas,
	cr.plugins_.Sprite.prototype.cnds.IsOverlapping,
	cr.plugins_.c2canvas.prototype.acts.moveTo,
	cr.plugins_.Sprite.prototype.exps.BBoxTop,
	cr.plugins_.c2canvas.prototype.acts.beginPath,
	cr.plugins_.c2canvas.prototype.acts.bezierCurveTo,
	cr.plugins_.c2canvas.prototype.exps.X,
	cr.plugins_.c2canvas.prototype.exps.Y,
	cr.plugins_.Sprite.prototype.exps.X,
	cr.system_object.prototype.cnds.ForEachOrdered,
	cr.system_object.prototype.cnds.Compare,
	cr.plugins_.Sprite.prototype.exps.BBoxRight,
	cr.plugins_.c2canvas.prototype.acts.lineTo,
	cr.plugins_.c2canvas.prototype.acts.fillPath,
	cr.behaviors.Platform.prototype.acts.SetVectorY,
	cr.behaviors.Platform.prototype.exps.VectorY,
	cr.behaviors.Platform.prototype.exps.Gravity,
	cr.behaviors.Physics.prototype.acts.ApplyForceAtAngle,
	cr.system_object.prototype.exps.angle,
	cr.plugins_.Sprite.prototype.exps.Y,
	cr.plugins_.Sprite.prototype.cnds.IsBoolInstanceVarSet,
	cr.plugins_.Sprite.prototype.cnds.CompareInstanceVar,
	cr.plugins_.Sprite.prototype.cnds.IsOverlappingOffset,
	cr.behaviors.Physics.prototype.acts.SetFriction,
	cr.plugins_.Sprite.prototype.acts.SetEffectParam,
	cr.system_object.prototype.exps["int"],
	cr.system_object.prototype.exps.tokenat,
	cr.behaviors.Physics.prototype.acts.EnableCollisions,
	cr.behaviors.Physics.prototype.acts.SetDensity,
	cr.behaviors.Physics.prototype.acts.SetIterations,
	cr.plugins_.Sprite.prototype.acts.SetBoolInstanceVar,
	cr.plugins_.Sprite.prototype.cnds.PickInstVarHiLow,
	cr.system_object.prototype.acts.SetVar,
	cr.system_object.prototype.cnds.PickAll,
	cr.system_object.prototype.cnds.PickByComparison,
	cr.plugins_.Sprite.prototype.exps.PickedCount,
	cr.behaviors.Physics.prototype.exps.Mass,
	cr.plugins_.Sprite.prototype.cnds.OnCollision,
	cr.plugins_.Sprite.prototype.acts.AddInstanceVar,
	cr.plugins_.Touch.prototype.cnds.IsInTouch,
	cr.behaviors.Platform.prototype.acts.SimulateControl,
	cr.plugins_.Touch.prototype.cnds.OnTouchEnd,
	cr.system_object.prototype.cnds.TriggerOnce,
	cr.system_object.prototype.acts.Wait,
	cr.plugins_.Touch.prototype.cnds.OnTapGestureObject,
	cr.system_object.prototype.acts.ResetGlobals,
	cr.system_object.prototype.acts.RestartLayout,
	cr.plugins_.Sprite.prototype.acts.SetCollisions,
	cr.behaviors.Platform.prototype.acts.SetEnabled
];};

