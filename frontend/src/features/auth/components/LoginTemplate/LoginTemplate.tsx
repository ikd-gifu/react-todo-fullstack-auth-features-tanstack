import { Controller } from "react-hook-form";
import { NavLink } from "react-router";

import { CommonButton } from "../../../../shared/components/ui/CommonButton";
import { InputFormValidation } from "../../../../shared/components/ui";
import { NAV_ITEMS } from "../../../../shared/constants/navigation";

import { useLoginTemplate } from "./useLoginTemplate";
import styles from "./style.module.css";

export const LoginTemplate = () => {
  const { control, errors, handleLoginSubmit } = useLoginTemplate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ログイン</h1>

      <form className={styles.form} onSubmit={handleLoginSubmit}>
        <div className={styles.area}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <InputFormValidation
                inputValue={field.value}
                placeholder="email"
                handleChangeValue={field.onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />
        </div>

        <div className={styles.area}>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <InputFormValidation
                type="password"
                inputValue={field.value}
                placeholder="password"
                handleChangeValue={field.onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />
        </div>

        <div className={styles.area}>
          <CommonButton type="submit">ログイン</CommonButton>
        </div>

        <div className={styles.link}>
          <NavLink to={NAV_ITEMS.SIGNUP}>&lt;&lt; 新規登録はこちら</NavLink>
        </div>
      </form>
    </div>
  );
};
