precision mediump float;

struct DirectionalLight
{
	vec3 direction;
	vec3 color;
};


varying vec2 fragTexCoord;
varying vec3 fragNormal;
varying vec3 fPos;
varying vec3 fNorm;

uniform vec3 ambientLightIntensity;
uniform DirectionalLight sun;
uniform sampler2D sampler;
uniform mat4 mView;
uniform vec4 mCameraLocation;

void main()
{
	vec3 viewVector =vec3(mView*mCameraLocation*vec4(0.0, 0.0, 0.0, 1.0));
	vec3 V=normalize(viewVector - fPos);


	float d = length(sun.direction.xyz - fPos);
	float attenuation = 80.0/(0.25+(0.01*d)+(0.003*d*d));

	vec3 surfaceNormal = normalize(fragNormal);
	vec3 normSunDir = normalize(sun.direction);
	vec4 texel = texture2D(sampler, fragTexCoord);

	float a = max(0.0, dot(reflect(-normSunDir,fragNormal), V));

	float b = a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a*a;

	float c = 2.0 * attenuation*b;

	vec3 especularLightIntensity = sun.color * c ;


	vec3 diffuseLightIntensity = sun.color * max(dot(fragNormal, normSunDir), 0.0);

	vec3 lightIntensity = ambientLightIntensity + diffuseLightIntensity +especularLightIntensity;

	gl_FragColor = vec4(texel.rgb * lightIntensity, texel.a);
}