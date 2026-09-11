# FelisOS
<hr/>
&emsp;&emsp;<sup> The following sections are only intended to populate README.md while active development is underway. This document and its committed changes will be kept in a future document and commit.</sup><br/>

## Artboards

A look at the native look and feel, future apps and overall conceptualization of FelisOS as I build the user interface and OS shell in active development.<br/>
<table>
  <tr><td><br/>
    <code>-- (!): [Placeholder] - <i>Lunacy artboard depicting a user's viewpoint of the Felis ecosystem.</i></code><br/>
  <samp>[Artboard3.png]<br/>
    &emsp;&emsp; <sub>A description of the image will go here.</samp></sub><br/>
  </td></tr>
  <tr><td><br/>
     <code>-- (!): [Placeholder] - <i>Lunacy artboard depicting a user's viewpoint of the Felis ecosystem.</i></code><br/>
  <samp>[Artboard2.png]<br/>
    &emsp;&emsp; <sub>A description of the image will go here.</samp></sub><br/>
  </td></tr>
</table>
<br/><hr/>

## Software Used and Acknowledgements
<p>I.) Software used: &emsp;<i>Software tools and environments used in the creation of FelisOS and its features, apps and components.</i>
<ul id="tools-used">
  <li><a href="https://icons8.com/lunacy-download">Lunacy 14.1 by <i>icons8</i></a>.<br/>
      <sup><samp> + Download link provided</samp></sup></li>
  <li><a href="https://visualstudio.microsoft.com/insiders/">Microsoft VisualStudio 2026 Insiders</a><br/>
      <sup><samp> + Download link provided</samp></sup></li>
  <li><a href="https://netbeans.apache.org/front/main/download/">Apache NetBeans 30</a><br/>
      <sup><samp> + Download link provided</samp></sup></li>
</ul></p>
<br/>
<p>II.) Acknowledgements: &emsp;<i>Credits, acknowledgements, contributions and special thanks from the FelisOS project.</i>
  <ul id="credits">
    <li><samp>(!)- <i>Placeholder</i></samp></li><br/>
      <sup><samp> + Download link provided</samp></sup></li>
  </ul>
  </ul>
</p>

## UI system

The FelisOS shell uses a small dependency-free design system in `fos-26-9-main/wwwroot/css`.
`tokens.css` is the source of truth for color roles, spacing, typography, shape, and elevation.
`components.css` contains reusable controls and states, while `core.css` and `shelf.css`
compose those primitives into the desktop shell. SVGs exported from Lunacy live under
`wwwroot/assets/ui` and are referenced by semantic app and system components.

To preview the shell locally, open `fos-26-9-main/felis-os.csproj` in Visual Studio and run
the `http` profile. For Apache NetBeans, open `fos-26-9-main/wwwroot` as a static web project,
start its built-in web server, and open `index.html`. Both approaches serve the same
dependency-free `wwwroot` files.
