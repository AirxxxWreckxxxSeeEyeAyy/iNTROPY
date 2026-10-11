# iNTROPY

## Pause

An interactive browser visualization of an opt-in app that helps people pause selected apps during a night out.

## Preview

Download `pause-app.html` and open it in a browser. For a local HTTP preview, run this command in the folder containing the file:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000/pause-app.html. Stop the server with Ctrl+C.

The demo lets you choose apps, simulate a check-in, and explore a protection screen. All authentication and app restrictions in this visualization are simulated. It does not access Face ID, detect intoxication, measure blood alcohol, or block other apps on your phone.

## Integral concept

A normalized, exponentially weighted integral summarizes a concern signal over time:

```text
R(t) = integral[t-W,t] exp(-(t-u)/tau) s(u) du
       / integral[t-W,t] exp(-(t-u)/tau) du
```

Here `s(u)` is a self-reported concern value between 0 and 1, `W` is the history window, and `tau` controls how quickly older reports lose weight. The integral combines reports across time; the denominator keeps the result normalized. A sampled implementation can approximate both integrals with the trapezoidal rule.

This is an illustrative commitment policy, not a clinically validated intoxication score. It must never certify sobriety or fitness to drive. A native implementation would need separate authorization and platform-supported app restriction APIs; this HTML is a design prototype.

## File integrity and isolation

`pause-app.html` is the original supplied export, preserved byte for byte. Its sandboxed iframe (`allow-scripts`) and Content Security Policy are retained. No build step or package installation is needed. Some styling resources may require an internet connection under the export's CSP.

SHA-256:

```text
8a9c07d2254e083b67db49356ea73b4ccb9c6647d10badedeb99e47923f54f02
```
