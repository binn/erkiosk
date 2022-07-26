using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();
builder.WebHost.UseWebRoot("wwwroot");
builder.WebHost.UseUrls("http://localhost:5133");

var app = builder.Build();
Process screenProcess = null;
Process cameraProcess = null;
string recordingFolder = app.Configuration["RecordingLocation"];

app.UseCors(b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
app.UseStaticFiles();

app.MapGet("/", () => Results.LocalRedirect("/index.html", true));

app.MapGet("/recording/begin", async () =>
{
    if (screenProcess != null)
    {
        await screenProcess.StandardInput.WriteAsync("q");
        await screenProcess.WaitForExitAsync();
        screenProcess = null;
    }

    if (cameraProcess != null)
    {
        await cameraProcess.StandardInput.WriteAsync("q");
        await cameraProcess.WaitForExitAsync();
        cameraProcess = null;
    }

var psi = new ProcessStartInfo("ffmpeg/ffmpeg.exe", 
    "-f gdigrab -i desktop -framerate 25 -vf \"scale=1280x720\" \"" + recordingFolder + $"\\output_{DateTime.Now.Ticks}.mkv\"") {
        RedirectStandardInput = true,
    };

var camerapsi = new ProcessStartInfo("ffmpeg/ffmpeg.exe", 
    "-f dshow -s 320x240 -r 30 -vcodec mjpeg -i video=\"HP Wide Vision HD Camera\" " + recordingFolder + $"\\camera_output_{DateTime.Now.Ticks}.mkv\"") {
        RedirectStandardInput = true,
    };

    screenProcess = Process.Start(psi);
    cameraProcess = Process.Start(camerapsi);
    return Results.Ok();
});

app.MapGet("/recording/end", async () =>
{
    await screenProcess.StandardInput.WriteAsync("q");
    await cameraProcess.StandardInput.WriteAsync("q");
    await screenProcess.WaitForExitAsync();
    await cameraProcess.WaitForExitAsync();
    cameraProcess = null;
    screenProcess = null;

    return Results.Ok();
});

Process.Start(new ProcessStartInfo() { FileName = "http://localhost:5133", UseShellExecute = true });
app.Run();