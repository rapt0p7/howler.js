const fs = require('fs');
const { execSync } = require('child_process');
const packageJson = require('./package.json');

const version = `v${packageJson.version}`;

const updateVersion = (filePath, lineNumber, replacement) => {
  const content = fs.readFileSync(filePath, 'utf8').split('\n');
  content[lineNumber - 1] = replacement;
  fs.writeFileSync(filePath, content.join('\n'));
};

// path, line number, replacement
updateVersion('src/howler.core.js', 2, ` *  howler.js ${version}`);
updateVersion('src/plugins/howler.spatial.js', 4, ` *  howler.js ${version}`);
updateVersion('src/plugins/howler.convolver.js', 42, ` *  howler.js ${version}`);
updateVersion('src/plugins/howler.filter.js', 5, ` *  howler.js ${version}`);
updateVersion('src/plugins/howler.delay.js', 6, ` *  howler.js ${version}`);

const minify = (input, output, preamble) => {
  execSync(`uglifyjs --preamble "${preamble}" ${input} -c -m --screw-ie8 -o ${output}`);
};

const corePreamble = `/*! howler.js ${version} | (c) 2013-2020, James Simpson of GoldFire Studios | MIT License | howlerjs.com */`;
minify('src/howler.core.js', 'dist/howler.core.min.js', corePreamble);

const pluginPreambles = {
  spatial: `/*! howler.js ${version} | Spatial Plugin | (c) 2013-2020, James Simpson of GoldFire Studios | MIT License | howlerjs.com */`,
  convolver: `/*! howler.js ${version} | Convolver Plugin | (c) 2013-2020, James Simpson of GoldFire Studios | MIT License | howlerjs.com */`,
  filter: `/*! howler.js ${version} | Filter Plugin | (c) 2013-2020, James Simpson of GoldFire Studios | MIT License | howlerjs.com */`,
  delay: `/*! howler.js ${version} | Delay Plugin | (c) 2013-2020, James Simpson of GoldFire Studios | MIT License | howlerjs.com */`
};

minify('src/plugins/howler.spatial.js', 'dist/howler.spatial.min.js', pluginPreambles.spatial);
minify('src/plugins/howler.convolver.js', 'dist/howler.convolver.min.js', pluginPreambles.convolver);
minify('src/plugins/howler.filter.js', 'dist/howler.filter.min.js', pluginPreambles.filter);
minify('src/plugins/howler.delay.js', 'dist/howler.delay.min.js', pluginPreambles.delay);

const combineFiles = (files, output, separator = '\n\n') => {
  const content = files.map(file => fs.readFileSync(file, 'utf8')).join(separator);
  fs.writeFileSync(output, content);
};

// Combine minified files
combineFiles(
  ['dist/howler.core.min.js', 'dist/howler.spatial.min.js', 'dist/howler.convolver.min.js', 'dist/howler.filter.min.js', 'dist/howler.delay.min.js'],
  'dist/howler.min.js',
  '\n\n/*! Spatial Plugin */\n\n/*! Convolver Plugin */\n\n/*! Filter Plugin */\n\n/*! Delay Plugin */\n\n'
);

// Combine source files
combineFiles(
  ['src/howler.core.js', 'src/plugins/howler.spatial.js', 'src/plugins/howler.convolver.js', 'src/plugins/howler.filter.js', 'src/plugins/howler.delay.js'],
  'dist/howler.js'
);

console.log('Build done.');

// "build": "VERSION=`printf 'v' && node -e 'console.log(require(\"./package.json\").version)'` && sed -i '' '2s/.*/ *  howler.js '\"$VERSION\"'/' src/howler.core.js && sed -i '' '4s/.*/ *  howler.js '\"$VERSION\"'/' src/plugins/howler.spatial.js && uglifyjs --preamble \"/*! howler.js $VERSION | (c) 2013-2020, James Simpson of GoldFire Studios | MIT License | howlerjs.com */\" src/howler.core.js -c -m --screw-ie8 -o dist/howler.core.min.js && uglifyjs --preamble \"/*! howler.js $VERSION | Spatial Plugin | (c) 2013-2020, James Simpson of GoldFire Studios | MIT License | howlerjs.com */\" src/plugins/howler.spatial.js -c -m --screw-ie8 -o dist/howler.spatial.min.js && awk 'FNR==1{echo \"\"}1' dist/howler.core.min.js dist/howler.spatial.min.js | sed '3s~.*~/*! Spatial Plugin */~' | perl -pe 'chomp if eof' > dist/howler.min.js && awk '(NR>1 && FNR==1){printf (\"\\n\\n\")};1' src/howler.core.js src/plugins/howler.spatial.js > dist/howler.js  && uglifyjs --preamble \"/*! howler.js $VERSION | (c) 2013-2020, James Simpson of GoldFire Studios | MIT License | howlerjs.com */\" src/howler.core.js -c -m --screw-ie8 -o dist/howler.core.min.js && uglifyjs --preamble \"/*! howler.js $VERSION | convolver Plugin | (c) 2013-2020, James Simpson of GoldFire Studios | MIT License | howlerjs.com */\" src/plugins/howler.convolver.js -c -m --screw-ie8 -o dist/howler.convolver.min.js && awk 'FNR==1{echo \"\"}1' dist/howler.core.min.js dist/howler.convolver.min.js | sed '3s~.*~/*! convolver Plugin */~' | perl -pe 'chomp if eof' > dist/howler.min.js && awk '(NR>1 && FNR==1){printf (\"\\n\\n\")};1' src/howler.core.js src/plugins/howler.convolver.js > dist/howler.js && uglifyjs --preamble \"/*! howler.js $VERSION | (c) 2013-2020, James Simpson of GoldFire Studios | MIT License | howlerjs.com */\" src/howler.core.js -c -m --screw-ie8 -o dist/howler.core.min.js && uglifyjs --preamble \"/*! howler.js $VERSION | filter Plugin | (c) 2013-2020, James Simpson of GoldFire Studios | MIT License | howlerjs.com */\" src/plugins/howler.filter.js -c -m --screw-ie8 -o dist/howler.filter.min.js && awk 'FNR==1{echo \"\"}1' dist/howler.core.min.js dist/howler.filter.min.js | sed '3s~.*~/*! filter Plugin */~' | perl -pe 'chomp if eof' > dist/howler.min.js && awk '(NR>1 && FNR==1){printf (\"\\n\\n\")};1' src/howler.core.js src/plugins/howler.filter.js > dist/howler.js",
