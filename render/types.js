/**
 * Created by kaidi on 14-12-11.
 */

(function(win) {

    //define class Vector3
    var vector3 = win.Vector3 = function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    };
    vector3.prototype = {
        Copy: function() {
            return new vector3(x, y, z);
        },
        Length: function() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        },
        SqrtLength: function() {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        },
        normailize: function() {
            var inv = 1 / this.Length;
            return new vector3(this.x * inv, this.y * inv, this.z * inv);
        },
        negate: function() {
            return new vector3(-this.x, -this.y, -this.z);
        },
        add: function(v) {
            return new vector3(this.x + v.x, this.y + v.y, this.z + v.z);
        },
        subtract: function(v) {
            return new vector3(this.x - v.x, this.y - v.y, this.z - v.z);
        },
        multiply: function(f) {
            return new vector3(this.x * f, this.y * f, this.z * f);
        },
        divide: function(f) {
            var inv = 1 / f;
            return new vector3(this.x * inv, this.y * inv, this.z * inv);
        },
        dot: function(v) {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        },
        cross: function(v) {
            return new vector3(this.y * v.z - this.z * v.y,
                               this.z * v.x - this.x * v.z,
                               this.x * v.y - this.y * v.x);
        }
    };
    vector3.zero = new vector3(0, 0, 0);

    //define class Ray
    var ray3 = win.Ray3 = function(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    };
    ray3.prototype = {
        getPoint: function(t) {
            return this.origin.add(this.direction.multiply(t));
        }
    };


    //define Sphere
    var sphere = win.Sphere = function(center, radius) {
        this.center = center;
        this.radius = radius;
    };
    sphere.prototype = {
        copy: function() {
            return new sphere(this.center.copy(), this.radius.copy());
        },
        initialize: function() {
            this.sqrtRadius = this.radius * this.radius;
        },
        intersect: function(ray) {
            var v = ray.origin.subtract(this.center);
            var a0 = v.SqrtLength() - this.sqrtRadius;
            var Ddotv = ray.direction.dot(v);

            if (Ddotv <= 0) {
                var discr = Ddotv * Ddotv - a0;
                if (discr >= 0) {
                    var result = new intersectResult();
                    result.geometry = this;
                    result.distance = -Ddotv - Math.sqrt(discr);
                    result.position = ray.getPoint(result.distance);
                    result.normal = result.position.subtract(this.center).normailize();
                    return result;
                }
            }
            return intersectResult.noHit;
        }
    };

    //Define class IntersectResult
    var intersectResult = win.IntersectResult = function() {
        this.geometry = null;
        this.distance = 0;
        this.position = vector3.zero;
        this.normal = vector3.zero;
    };
    intersectResult.noHit = new IntersectResult();

    //Define class PerspectiveCamera
    var perspectiveCamera = win.PerspectiveCamera = function(eye, front, up, fov) {
        this.eye = eye;
        this.front = front;
        this.refUp = up;
        this.fov = fov;
    };

    perspectiveCamera.prototype = {
        initialize: function() {
            this.right = this.front.cross(this.refUp);
            this.up = this.right.cross(this.front);
            this.fovScale = Math.tan(this.fov * 0.5 * Math.PI / 180) * 2;
        },
        generateRay: function(x, y) {
            var r = this.right.multiply((x - 0.5) * this.fovScale);
            var u = this.up.multiply((y - 0.5)) * this.fovScale;
            return new ray3(this.eye, this.front.add(r).add(u).normailize());
        }
    }





})(window);



