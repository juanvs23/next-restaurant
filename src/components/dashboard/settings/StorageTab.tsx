"use client";
import { ImFolderOpen, ImCloud } from "react-icons/im";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useT } from "@/i18n/useT";

interface StorageTabProps {
  form: any;
  setForm: (f: any) => void;
}

export function StorageTab({ form, setForm }: StorageTabProps) {
  const { t } = useT();
  const isS3 = form.storageProvider === "s3";

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{t("settings.storageHint")}</p>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setForm({ ...form, storageProvider: "local" })}
          className={`flex items-center gap-3 rounded-lg border-2 p-4 flex-1 transition-all ${
            !isS3
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground"
          }`}
        >
          <ImFolderOpen className="w-6 h-6" />
          <div className="text-left">
            <p className="font-medium">{t("settings.storageLocal")}</p>
            <p className="text-xs text-muted-foreground">
              {t("settings.storageLocalDesc")}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setForm({ ...form, storageProvider: "s3" })}
          className={`flex items-center gap-3 rounded-lg border-2 p-4 flex-1 transition-all ${
            isS3
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground"
          }`}
        >
          <ImCloud className="w-6 h-6" />
          <div className="text-left">
            <p className="font-medium">S3 Compatible</p>
            <p className="text-xs text-muted-foreground">
              {t("settings.s3Desc")}
            </p>
          </div>
        </button>
      </div>

      {isS3 && (
        <div className="space-y-4 rounded-lg border p-4">
          <p className="font-medium text-sm">{t("settings.s3Config")}</p>

          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="s3-bucket">{t("settings.s3Bucket")}</Label>
              <Input
                id="s3-bucket"
                value={form.s3Config?.bucket || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    s3Config: { ...form.s3Config, bucket: e.target.value },
                  })
                }
                placeholder="my-bucket"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="s3-region">{t("settings.s3Region")}</Label>
              <Input
                id="s3-region"
                value={form.s3Config?.region || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    s3Config: { ...form.s3Config, region: e.target.value },
                  })
                }
                placeholder="us-east-1"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="s3-key">{t("settings.s3AccessKey")}</Label>
              <Input
                id="s3-key"
                type="password"
                value={form.s3Config?.accessKeyId || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    s3Config: {
                      ...form.s3Config,
                      accessKeyId: e.target.value,
                    },
                  })
                }
                placeholder="AKIA..."
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="s3-secret">{t("settings.s3SecretKey")}</Label>
              <Input
                id="s3-secret"
                type="password"
                value={form.s3Config?.secretAccessKey || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    s3Config: {
                      ...form.s3Config,
                      secretAccessKey: e.target.value,
                    },
                  })
                }
                placeholder="••••••••"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="s3-endpoint">
                {t("settings.s3Endpoint")}
                <span className="text-xs text-muted-foreground ml-1">
                  ({t("common.optional")})
                </span>
              </Label>
              <Input
                id="s3-endpoint"
                value={form.s3Config?.endpoint || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    s3Config: {
                      ...form.s3Config,
                      endpoint: e.target.value,
                    },
                  })
                }
                placeholder="https://fra1.digitaloceanspaces.com"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {t("settings.s3EndpointHint")}
          </p>
        </div>
      )}
    </div>
  );
}
